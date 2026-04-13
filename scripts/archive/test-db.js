const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  console.log("--- DATABASE VERIFICATION START ---");
  
  try {
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({
      where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }
    });
    const completedJobsToday = await prisma.job.count({
      where: { 
        status: 'COMPLETED',
        completedDate: { gte: new Date(new Date().setHours(0,0,0,0)) }
      }
    });
    
    const totalUsers = await prisma.user.count();
    const workers = await prisma.user.count({
      where: { role: { in: ['WORKER', 'MANAGER'] } }
    });

    console.log("Result:", {
      totalJobs,
      activeJobs,
      completedJobsToday,
      totalUsers,
      workers
    });

  } catch (error) {
    console.error("Query Error:", error);
  } finally {
    await prisma.$disconnect();
  }
  
  console.log("--- DATABASE VERIFICATION END ---");
}

debug();
