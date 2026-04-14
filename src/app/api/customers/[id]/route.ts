
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth-helper'
import { logAudit, AuditAction } from '@/lib/audit'

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth(req)
        const { id } = await params;

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Get customer to find userId and company name
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: { user: true, _count: { select: { jobs: true } } }
        })

        if (!customer) {
            return NextResponse.json({ error: 'Müşteri bulunamadı' }, { status: 404 })
        }

        // Check if customer has jobs
        if (customer._count.jobs > 0) {
            return NextResponse.json({ 
                error: 'Bu müşteriye ait kayıtlı işler (Jobs) mevcut. Geçmiş verilerin korunması için bu müşteri silinemez. Bunun yerine müşteriyi "Pasif" duruma getirmeyi deneyin.' 
            }, { status: 400 })
        }

        // Use a transaction to clean up and delete
        await prisma.$transaction(async (tx) => {
            // Delete the User (this will cascade delete the Customer record)
            await tx.user.delete({
                where: { id: customer.userId }
            })
        });

        // LOGGING: Audit log for customer deletion
        await logAudit(session.user.id, AuditAction.USER_DELETE, {
            targetUserId: customer.userId,
            customerId: id,
            company: customer.company,
            platform: 'web'
        }, 'web');

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Customer deletion error:', error)
        
        // Handle Prisma Foreign Key Constraint error (P2003)
        if (error.code === 'P2003') {
            return NextResponse.json({ 
                error: 'Bu müşteriye bağlı kritik kayıtlar mevcut. Güvenlik nedeniyle bu müşteri doğrudan silinemez.' 
            }, { status: 400 })
        }

        return NextResponse.json({ error: 'Sunucu hatası: ' + (error.message || 'Bilinmeyen hata') }, { status: 500 })
    }
}
