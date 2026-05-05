const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobId = process.argv[2];
  if (!jobId) {
    console.error('Job ID required');
    process.exit(1);
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      customer: {
        include: {
          user: true
        }
      }
    }
  });

  if (!job) {
    console.log('Job not found');
    return;
  }

  console.log('Job Title:', job.title);
  console.log('Customer:', job.customer?.company);
  console.log('User Name:', job.customer?.user?.name);
  console.log('User Role:', job.customer?.user?.role);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
