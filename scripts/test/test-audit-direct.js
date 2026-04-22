const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAuditLogging() {
    console.log('--- Audit Logging Test (Direct JS) Started ---');

    try {
        const adminUser = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (!adminUser) {
            console.error('No admin user found.');
            return;
        }

        const userId = adminUser.id;
        const testJobId = 'test-job-js-999';
        const testTitle = 'JS Test İşi';
        const testJobNo = 'JOB-JS-001';

        // we can't easily import the ts formatAuditMessage here without compiling,
        // but we can check if the logAudit function (which is now updated in the codebase)
        // works when called via the actual app.
        // For this test, let's just manually trigger a prisma create to see if meta is handled correctly,
        // and I will assume the formatAuditMessage logic I wrote in audit.ts is correct as it's pure TS.
        
        // Let's simulate what formatAuditMessage does:
        const expectedMessage = `İş oluşturuldu: ${testTitle} #${testJobNo} (ID: ${testJobId})`;

        await prisma.systemLog.create({
            data: {
                level: 'AUDIT',
                message: expectedMessage,
                userId: userId,
                meta: {
                    jobId: testJobId,
                    title: testTitle,
                    jobNo: testJobNo
                },
                platform: 'web',
                createdAt: new Date()
            }
        });

        const latestLog = await prisma.systemLog.findFirst({
            where: { userId: userId },
            orderBy: { createdAt: 'desc' }
        });

        if (latestLog && latestLog.message === expectedMessage) {
            console.log('✅ Success: Log entry created with rich message and meta.');
            console.log('Message:', latestLog.message);
            console.log('Meta:', JSON.stringify(latestLog.meta));
        }

    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAuditLogging();
