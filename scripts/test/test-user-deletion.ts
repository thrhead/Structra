import { prisma } from '../src/lib/db';

async function testUserDeletion() {
    console.log('🚀 Starting User Deletion Test...');

    // 1. Create a test user
    const testEmail = `test-delete-${Date.now()}@example.com`;
    const user = await prisma.user.create({
        data: {
            email: testEmail,
            name: 'Test Delete User',
            passwordHash: 'dummy-hash',
            role: 'WORKER'
        }
    });

    console.log(`👤 Created test user: ${user.email} (${user.id})`);

    // 2. Delete the test user
    try {
        await prisma.user.delete({
            where: { id: user.id }
        });
        console.log('✅ User deleted successfully from database.');
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        process.exit(1);
    }

    // 3. Verify deletion
    const deletedUser = await prisma.user.findUnique({
        where: { id: user.id }
    });

    if (!deletedUser) {
        console.log('🏁 Verification successful: User no longer exists.');
    } else {
        console.error('❌ Verification failed: User still exists.');
        process.exit(1);
    }

    process.exit(0);
}

testUserDeletion();
