
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
    const session = await auth();
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Instead of reading the physical file system (which crashes on Vercel),
        // we fetch logic for finished jobs so they can be exported dynamically from the UI.
        const jobs = await prisma.job.findMany({
            where: { status: 'COMPLETED' },
            orderBy: { completedDate: 'desc' },
            select: { id: true, title: true, jobNo: true, completedDate: true, customer: { select: { company: true } } }
        });

        // Map to a report format for export usage
        const reports = jobs.map(job => ({
            id: job.id,
            filename: `JobReport_${job.jobNo || job.id}.pdf`,
            title: job.title,
            customer: job.customer?.company || 'Bilinmeyen Müşteri',
            createdAt: job.completedDate || new Date().toISOString()
        }));

        return NextResponse.json(reports);
    } catch (error) {
        console.error("Report list error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
