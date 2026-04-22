import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminOrManager } from '@/lib/auth-helper';

export async function GET(req: Request) {
    const session = await verifyAdminOrManager(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const jobs = await prisma.job.findMany({
            select: { id: true, title: true },
            orderBy: { title: 'asc' }
        });
        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}
