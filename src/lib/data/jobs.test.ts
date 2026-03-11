import { vi, describe, it, expect, afterEach } from 'vitest';
import { getJobs } from './jobs';
import { prisma } from '@/lib/db';
import { JOB_STATUS, JOB_PRIORITY } from '@/lib/constants/jobs';

vi.mock('@/lib/db', () => ({
    prisma: {
        job: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
    },
}));

describe('getJobs Data Fetching (Refactored)', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should filter jobs by search term (Issue #22)', async () => {
        (prisma.job.findMany as any).mockResolvedValue([]);
        (prisma.job.count as any).mockResolvedValue(0);

        const filter = { search: 'TEST-123' };
        await getJobs({ filter });

        expect(prisma.job.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                OR: expect.arrayContaining([
                    { title: { contains: 'TEST-123', mode: 'insensitive' } },
                    { jobNo: { contains: 'TEST-123', mode: 'insensitive' } },
                ])
            })
        }));
    });

    it('should filter by specific jobNo (exact ID or partial Display No)', async () => {
        (prisma.job.findMany as any).mockResolvedValue([]);
        (prisma.job.count as any).mockResolvedValue(0);

        const filter = { jobNo: 'WO-001' };
        await getJobs({ filter });

        expect(prisma.job.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                OR: [
                    { id: 'WO-001' },
                    { jobNo: { contains: 'WO-001', mode: 'insensitive' } }
                ]
            })
        }));
    });

    it('should filter jobs by team', async () => {
        (prisma.job.findMany as any).mockResolvedValue([]);
        (prisma.job.count as any).mockResolvedValue(0);

        const filter = { teams: ['team-1'] };
        await getJobs({ filter });

        expect(prisma.job.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                assignments: {
                    some: { teamId: { in: ['team-1'] } }
                }
            })
        }));
    });

    it('should filter jobs by priority constant', async () => {
        (prisma.job.findMany as any).mockResolvedValue([]);
        (prisma.job.count as any).mockResolvedValue(0);

        const filter = { priority: JOB_PRIORITY.URGENT };
        await getJobs({ filter });

        expect(prisma.job.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                priority: 'URGENT'
            })
        }));
    });

    it('should filter by date range', async () => {
        (prisma.job.findMany as any).mockResolvedValue([]);
        (prisma.job.count as any).mockResolvedValue(0);

        const start = new Date('2024-01-01');
        const end = new Date('2024-01-31');
        const filter = { dateRange: { start, end } };
        await getJobs({ filter });

        expect(prisma.job.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                scheduledDate: { gte: start, lte: end }
            })
        }));
    });

    it('should combine multiple filters correctly (AND logic)', async () => {
        (prisma.job.findMany as any).mockResolvedValue([]);
        (prisma.job.count as any).mockResolvedValue(0);

        const filter = { 
            status: JOB_STATUS.PENDING, 
            priority: JOB_PRIORITY.HIGH 
        };
        await getJobs({ filter });

        const where = (prisma.job.findMany as any).mock.calls[0][0].where;
        expect(where.status).toBe('PENDING');
        expect(where.priority).toBe('HIGH');
    });
});
