const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    const prev7Days = new Date(last7Days);
    prev7Days.setDate(last7Days.getDate() - 7);
    prev7Days.setHours(0, 0, 0, 0);

    const steps = await prisma.jobStep.findMany({
        where: {
            isCompleted: true,
            completedAt: { gte: prev7Days, lte: today },
        },
        include: { job: { select: { title: true } } },
        orderBy: { completedAt: 'asc' }
    });
    
    console.log("Steps count:", steps.length);
}
test().catch(console.error).finally(() => prisma.$disconnect());
