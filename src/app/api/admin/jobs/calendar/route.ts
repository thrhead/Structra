import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdminOrManager } from '@/lib/auth-helper'

export async function GET(req: Request) {
    try {
        const session = await verifyAdminOrManager(req)
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const url = new URL(req.url)
        const yearParam = url.searchParams.get('year')
        const monthParam = url.searchParams.get('month')

        let startDate, endDate

        if (yearParam && monthParam) {
            // Get jobs for the specific month
            startDate = new Date(parseInt(yearParam), parseInt(monthParam) - 1, 1)
            endDate = new Date(parseInt(yearParam), parseInt(monthParam), 0, 23, 59, 59, 999)
        } else {
            // Fallback: 3 month range (previous, current, next)
            const now = new Date()
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999)
        }

        // Fetch jobs within the date range
        const jobs = await prisma.job.findMany({
            where: {
                scheduledDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                scheduledDate: true,
                status: true
            }
        });

        // Group job counts by "YYYY-MM-DD"
        const jobCountsByDate: Record<string, { total: number, completed: number }> = {}

        jobs.forEach((job) => {
            if (!job.scheduledDate) return;

            // Format to YYYY-MM-DD local string string part
            const dateStr = job.scheduledDate.toISOString().split('T')[0];

            if (!jobCountsByDate[dateStr]) {
                jobCountsByDate[dateStr] = { total: 0, completed: 0 }
            }

            jobCountsByDate[dateStr].total += 1;

            if (job.status === 'COMPLETED') {
                jobCountsByDate[dateStr].completed += 1;
            }
        })

        return NextResponse.json(jobCountsByDate)

    } catch (error) {
        console.error('Jobs calendar fetch error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
