import { sendUserNotification } from '../src/lib/notification-helper';
import { prisma } from '../src/lib/db';

async function testRealtimeNotification() {
    console.log('🚀 Starting Real-time Notification Test...');

    // 1. Find a test user (or create one)
    const user = await prisma.user.findFirst({
        where: { isActive: true }
    });

    if (!user) {
        console.error('❌ No active user found for testing.');
        process.exit(1);
    }

    console.log(`👤 Testing with user: ${user.email} (${user.id})`);

    // 2. Trigger notification
    try {
        await sendUserNotification(
            user.id,
            'Test Real-time Notification',
            `This is a test notification sent at ${new Date().toLocaleTimeString()}`,
            'SUCCESS',
            '/admin/dashboard'
        );
        console.log('✅ sendUserNotification called successfully.');
        console.log('ℹ️  Check the web application (or socket logs) to verify the "notification:new" event was emitted.');
    } catch (error) {
        console.error('❌ Error triggering notification:', error);
    }

    process.exit(0);
}

testRealtimeNotification();
