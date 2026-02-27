import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateJobPDF } from '@/lib/pdf-generator';
import { auth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const jobId = params.id;
        if (!jobId) {
            return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                customer: { include: { user: true } },
                steps: { orderBy: { order: 'asc' } },
                costs: true,
                assignments: { include: { team: true } }
            }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Generate the PDF
        const mappedJob = {
            ...job,
            team: job.assignments[0]?.team
        };
        const doc = generateJobPDF(mappedJob as any);
        const buffer = doc.output('arraybuffer');
        const pdfData = Buffer.from(buffer);

        // Return as a downloadable file Stream via NextResponse
        return new NextResponse(pdfData, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="JobReport_${job.jobNo || job.id}.pdf"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });

    } catch (error) {
        console.error("PDF generation on-the-fly error:", error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
