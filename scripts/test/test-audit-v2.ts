import { prisma } from './src/lib/db';
import { logAudit, AuditAction } from './src/lib/audit';

async function testAuditLogging() {
    console.log('--- Audit Logging Test Started ---');

    try {
        // 1. Mock a user ID (Admin)
        const adminUser = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (!adminUser) {
            console.error('No admin user found to perform test.');
            return;
        }

        const userId = adminUser.id;

        // 2. Test JOB_CREATE
        console.log('Testing JOB_CREATE log...');
        const testJobId = 'test-job-id-123';
        const testTitle = 'Test İşi: Klima Bakımı';
        const testJobNo = 'JOB-2024-001';

        await logAudit(userId, AuditAction.JOB_CREATE, {
            jobId: testJobId,
            title: testTitle,
            jobNo: testJobNo,
            platform: 'web'
        });

        // 3. Verify in DB
        const latestLog = await prisma.systemLog.findFirst({
            where: { 
                level: 'AUDIT',
                userId: userId
            },
            orderBy: { createdAt: 'desc' }
        });

        if (latestLog) {
            console.log('Latest Audit Log found:');
            console.log('- Message:', latestLog.message);
            console.log('- Platform:', latestLog.platform);
            console.log('- Meta (JSON):', JSON.stringify(latestLog.meta, null, 2));

            const expectedMessage = `İş oluşturuldu: ${testTitle} #${testJobNo} (ID: ${testJobId})`;
            if (latestLog.message === expectedMessage) {
                console.log('✅ Success: Log message matches expected format.');
            } else {
                console.error(`❌ Failure: Expected "${expectedMessage}", but got "${latestLog.message}"`);
            }
        } else {
            console.error('❌ Failure: No audit log found in database.');
        }

        // 4. Test JOB_STATUS_CHANGE
        console.log('
Testing JOB_STATUS_CHANGE log...');
        await logAudit(userId, AuditAction.JOB_STATUS_CHANGE, {
            jobId: testJobId,
            title: testTitle,
            before: { status: 'PENDING' },
            after: { status: 'IN_PROGRESS' },
            platform: 'mobile'
        });

        const statusLog = await prisma.systemLog.findFirst({
            where: { 
                level: 'AUDIT',
                userId: userId,
                message: { contains: 'durumu değişti' }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (statusLog) {
            console.log('Status Change Log found:');
            console.log('- Message:', statusLog.message);
            console.log('- Platform:', statusLog.platform);
        }

    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAuditLogging();
