import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminOrManager } from '@/lib/auth-helper'
import { deleteFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary'
import { prisma } from '@/lib/db'

export async function DELETE(
    request: NextRequest,
    props: { params: { publicId: string } }
) {
    const params = await props.params
    try {
        const session = await verifyAdminOrManager(request)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const photoId = params.publicId

        // 1. Find the photo to get the URL
        const photo = await prisma.stepPhoto.findUnique({
            where: { id: photoId }
        })

        if (!photo) {
            return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
        }

        // 2. Delete from Cloudinary
        const publicId = extractPublicIdFromUrl(photo.url)
        if (publicId) {
            await deleteFromCloudinary(publicId)
        }

        // 3. Delete from database
        await prisma.stepPhoto.delete({
            where: { id: photoId }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Photo delete error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete photo' },
            { status: 500 }
        )
    }
}
