import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- FETCHING RECENT AUDIT LOGS ---');
    const logs = await prisma.systemLog.findMany({
        where: {
            level: 'AUDIT',
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 10,
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    });

    console.log(JSON.stringify(logs, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
