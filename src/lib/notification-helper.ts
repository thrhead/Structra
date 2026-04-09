import { prisma } from '@/lib/db';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { publishToUser } from '@/lib/ably';

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

const expo = new Expo();

/**
 * Sends a notification to one or more users via DB, Ably (Web) and Expo (Mobile)
 */
export async function sendNotificationToUsers(
    userIds: string[],
    title: string,
    message: string,
    type: NotificationType = 'INFO',
    link?: string,
    data?: Record<string, unknown>
) {
    if (userIds.length === 0) return;

    try {
        // 1. Create notifications in DB
        await prisma.notification.createMany({
            data: userIds.map(userId => ({
                userId,
                title,
                message,
                type,
                link: link || null,
                isRead: false,
            }))
        });

        // 2. Emit Ably events for real-time web updates
        for (const userId of userIds) {
            try {
                await publishToUser(userId, 'notification:new', {
                    title,
                    message,
                    type: type.toLowerCase(),
                    link
                });
            } catch (err) {
                console.error(`Ably error for user ${userId}:`, err);
            }
        }

        // 3. Send Push Notifications (Expo)
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            include: { pushTokens: true }
        });

        const messages: ExpoPushMessage[] = [];
        for (const user of users) {
            const tokens = new Set<string>();
            if (user.pushToken) tokens.add(user.pushToken);
            user.pushTokens.forEach(pt => tokens.add(pt.token));

            for (const token of tokens) {
                if (Expo.isExpoPushToken(token)) {
                    messages.push({
                        to: token,
                        sound: 'default',
                        title,
                        body: message,
                        data: { ...data, link, type },
                        priority: 'high',
                        channelId: 'default',
                    });
                }
            }
        }

        if (messages.length > 0) {
            const chunks = expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
                try {
                    await expo.sendPushNotificationsAsync(chunk);
                } catch (error) {
                    console.error('Error sending push notification chunk:', error);
                }
            }
        }
    } catch (error) {
        console.error('General error in sendNotificationToUsers:', error);
    }
}

/**
 * Legacy helper for job specific notifications
 */
export async function sendJobNotification(
    jobId: string,
    title: string,
    message: string,
    type: NotificationType,
    link?: string
) {
    const assignments = await prisma.jobAssignment.findMany({
        where: { jobId },
        include: {
            team: {
                include: {
                    members: true
                }
            }
        }
    });

    const recipientIds = new Set<string>();
    for (const assignment of assignments) {
        if (assignment.workerId) recipientIds.add(assignment.workerId);
        if (assignment.teamId && assignment.team) {
            assignment.team.members.forEach(m => recipientIds.add(m.userId));
        }
    }

    if (recipientIds.size > 0) {
        await sendNotificationToUsers(Array.from(recipientIds), title, message, type, link, { jobId });
    }
}

/**
 * Alias for sendNotificationToUsers for single user notifications
 */
export async function sendUserNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType = 'INFO',
    link?: string,
    data?: Record<string, unknown>
) {
    return await sendNotificationToUsers([userId], title, message, type, link, data);
}

