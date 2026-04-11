const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const jobNos = ['JOB-cmkz', 'JOB-cmj5'];
    
    console.log('Cleaning up mock jobs:', jobNos);
    
    // Using deleteMany because we want to remove the jobs and their relations (Cascade is sets)
    const result = await prisma.job.deleteMany({
        where: {
            jobNo: { in: jobNos, mode: 'insensitive' }
        }
    });
    
    console.log(`Deleted ${result.count} mock jobs.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
