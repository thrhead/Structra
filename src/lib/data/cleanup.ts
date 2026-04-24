"use server"

import { prisma } from "@/lib/db";

/**
 * Data Retention Policy: Cleanup old logs and transient data.
 * This should be scheduled to run periodically (e.g., daily via a CRON job or Vercel Cron).
 */
export async function cleanupOldLogs(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    try {
        console.log(`[Cleanup] Starting cleanup for data older than ${cutoffDate.toISOString()}...`);

        // 1. Cleanup System Logs
        const deletedSystemLogs = await prisma.systemLog.deleteMany({
            where: {
                createdAt: { lt: cutoffDate }
            }
        });

        // 2. Cleanup Integration Logs
        const deletedIntegrationLogs = await prisma.integrationLog.deleteMany({
            where: {
                createdAt: { lt: cutoffDate }
            }
        });

        // 3. Cleanup Webhook Logs
        const deletedWebhookLogs = await prisma.webhookLog.deleteMany({
            where: {
                createdAt: { lt: cutoffDate }
            }
        });

        console.log(`[Cleanup] Success!`);
        return {
            systemLogs: deletedSystemLogs.count,
            integrationLogs: deletedIntegrationLogs.count,
            webhookLogs: deletedWebhookLogs.count
        };
    } catch (error) {
        console.error("[Cleanup] Failed to run retention policy:", error);
        throw error;
    }
}
