import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'
import { z } from 'zod'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(
    req: Request,
    props: { params: Promise<{ id: string; stepId: string }> }
) {
    const params = await props.params
    try {
        const session = await verifyAuth(req)
        if (!session || (session.user.role !== 'WORKER' && session.user.role !== 'TEAM_LEAD')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('photo') as File
        const subStepId = formData.get('subStepId') as string | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create directory if not exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'jobs', params.id)
        await mkdir(uploadDir, { recursive: true })

        // Generate unique filename
        const filename = `${params.stepId}_${Date.now()}_${file.name}`
        const filepath = join(uploadDir, filename)

        // Save file
        await writeFile(filepath, buffer)

        // Create database record
        const photoUrl = `/uploads/jobs/${params.id}/${filename}`

        const photo = await prisma.stepPhoto.create({
            data: {
                stepId: params.stepId,
                subStepId: subStepId || null,
                url: photoUrl,
                uploadedById: session.user.id
            },
            include: {
                uploadedBy: {
                    select: { name: true }
                }
            }
        })

        return NextResponse.json(photo)
    } catch (error) {
        console.error('Photo upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
