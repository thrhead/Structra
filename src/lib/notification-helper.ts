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

        // 2. Run Ably and Push notifications in parallel
        const ablyPromises = userIds.map(userId => {
            console.log(`[Ably-Server] Publishing to user:${userId}`, { title, type });
            return publishToUser(userId, 'notification:new', {
                title,
                message,
                type: type.toLowerCase(),
                link
            }).catch(err => console.error(`❌ Ably error for user ${userId}:`, err));
        });

        const pushPromise = (async () => {
            try {
                const users = await prisma.user.findMany({
                    where: { id: { in: userIds } },
                    include: { pushTokens: true }
                });

                const messages: ExpoPushMessage[] = [];
                let totalTokens = 0;
                let validTokens = 0;

                for (const user of users) {
                    const tokens = new Set<string>();
                    if (user.pushToken) tokens.add(user.pushToken);
                    user.pushTokens.forEach(pt => tokens.add(pt.token));

                    for (const token of tokens) {
                        totalTokens++;
                        if (Expo.isExpoPushToken(token)) {
                            validTokens++;
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

                // Debug logging
                console.log(`[PushNotification] Attempting for ${userIds.length} users. Total tokens: ${totalTokens}, Valid: ${validTokens}`);
                
                if (totalTokens > 0) {
                    await prisma.systemLog.create({
                        data: {
                            level: 'INFO',
                            message: `Push notification attempt for ${userIds.length} users`,
                            platform: 'server',
                            meta: {
                                userIds,
                                totalTokens,
                                validTokens,
                                messagesCount: messages.length,
                                title
                            }
                        }
                    }).catch(() => {}); // Ignore logging errors
                }

                if (messages.length > 0) {
                    const chunks = expo.chunkPushNotifications(messages);
                    for (const chunk of chunks) {
                        try {
                            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                            // Log success for each chunk
                            await prisma.systemLog.create({
                                data: {
                                    level: 'INFO',
                                    message: `Push notification chunk sent`,
                                    platform: 'server',
                                    meta: {
                                        chunkSize: chunk.length,
                                        tickets: ticketChunk
                                    }
                                }
                            }).catch(() => {});
                        } catch (error) {
                            console.error('Error sending push notification chunk:', error);
                            await prisma.systemLog.create({
                                data: {
                                    level: 'ERROR',
                                    message: `Push notification chunk failed`,
                                    platform: 'server',
                                    meta: { error: error instanceof Error ? error.message : String(error) }
                                }
                            }).catch(() => {});
                        }
                    }
                }
            } catch (pushError) {
                console.error('Push notification error:', pushError);
            }
        })();

        // Wait for all to complete (or at least start)
        await Promise.all([...ablyPromises, pushPromise]);
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
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { jobLeadId: true }
    });

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
    
    // Add Job Lead if exists
    if (job?.jobLeadId) {
        recipientIds.add(job.jobLeadId);
    }

    // Add assigned workers and team members
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

/**
 * Sends a notification to all active admins and managers
 */
export async function sendAdminNotification(
    title: string,
    message: string,
    type: NotificationType = 'INFO',
    link?: string,
    excludeUserId?: string
) {
    try {
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'MANAGER', 'TEAM_LEAD'] },
                isActive: true,
                id: excludeUserId ? { not: excludeUserId } : undefined
            },
            select: { id: true }
        });

        const adminIds = admins.map(a => a.id);
        if (adminIds.length > 0) {
            await sendNotificationToUsers(adminIds, title, message, type, link);
        }
    } catch (error) {
        console.error('Error sending admin notification:', error);
    }
}

/**
 * Helper to handle Expo push tickets and cleanup invalid tokens
 */
async function handlePushTickets(tickets: any[]) {
    const invalidTokens: string[] = [];
    
    for (const ticket of tickets) {
        if (ticket.status === 'error') {
            console.error(`Expo push error: ${ticket.message}`);
            if (ticket.details?.error === 'DeviceNotRegistered') {
                // We don't have the token here easily from the ticket alone in this version of SDK
                // But we can log it
            }
        }
    }
}

