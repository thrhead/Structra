import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function PUT(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth(req)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await props.params

        const existingCost = await prisma.costTracking.findUnique({
            where: { id }
        })

        if (!existingCost) {
            return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
        }

        if (existingCost.createdById !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (existingCost.status !== 'PENDING') {
            return NextResponse.json({ error: 'Only pending costs can be updated' }, { status: 400 })
        }

        let data: any = {}
        let file: File | null = null

        const contentType = req.headers.get('content-type') || ''

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            file = formData.get('receipt') as File | null

            if (formData.has('amount')) data.amount = parseFloat(formData.get('amount') as string)
            if (formData.has('currency')) data.currency = formData.get('currency')
            if (formData.has('category')) data.category = formData.get('category')
            if (formData.has('description')) data.description = formData.get('description')
            if (formData.has('date')) data.date = new Date(formData.get('date') as string)
        } else {
            data = await req.json()
        }

        let receiptUrl = existingCost.receiptUrl

        if (file && file.size > 0) {
            try {
                const uploadResult: any = await uploadToCloudinary(file, `costs/${existingCost.jobId}`)
                receiptUrl = uploadResult.secure_url
            } catch (err) {
                console.error('Cloudinary upload error:', err)
                return NextResponse.json({ error: 'Failed to upload new receipt image' }, { status: 500 })
            }
        }

        const updatedCost = await prisma.costTracking.update({
            where: { id },
            data: {
                ...data,
                receiptUrl
            }
        })

        return NextResponse.json(updatedCost)
    } catch (error) {
        console.error('Update cost error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth(req)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await props.params

        const existingCost = await prisma.costTracking.findUnique({
            where: { id }
        })

        if (!existingCost) {
            return NextResponse.json({ error: 'Cost not found' }, { status: 404 })
        }

        if (existingCost.createdById !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (existingCost.status !== 'PENDING') {
            return NextResponse.json({ error: 'Only pending costs can be deleted' }, { status: 400 })
        }

        await prisma.costTracking.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete cost error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}