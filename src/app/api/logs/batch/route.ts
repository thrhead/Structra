import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuth } from "@/lib/auth-helper";
import { logAudit } from "@/lib/audit";

const logSchema = z.object({
  level: z.string(), // Use string to be more flexible, will validate in mapping
  message: z.string(),
  context: z.any().optional(),
  stack: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  createdAt: z
    .any()
    .optional()
    .transform((val) => {
        if (!val) return new Date();
        const d = new Date(val);
        return isNaN(d.getTime()) ? new Date() : d;
    }),
});

const batchSchema = z.array(logSchema);

export async function POST(req: Request) {
  try {
    const session = await verifyAuth(req);
    const body = await req.json();
    const parsed = batchSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const logs = parsed.data;
    const now = new Date();
    const futureThreshold = new Date(now.getTime() + 5 * 60 * 1000);

    const systemLogsToCreate = [];
    const auditLogsToProcess = [];

    for (const log of logs) {
        let finalDate = log.createdAt;
        if (finalDate > futureThreshold) finalDate = new Date();

        const level = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'AUDIT'].includes(log.level) ? log.level : 'INFO';
        const platform = (log.platform as string) || (req.headers.get('user-agent')?.toLowerCase().includes('mobile') ? 'mobile' : 'web');
        
        const details = {
            ...(log.context || {}),
            stack: log.stack || null,
            platform,
            userName: session?.user?.name || 'Sistem'
        };

        if (level === 'AUDIT') {
            auditLogsToProcess.push(logAudit(
                session?.user?.id || 'system',
                log.message,
                details,
                platform
            ));
        } else {
            systemLogsToCreate.push({
                level,
                message: session?.user?.name ? `${session.user.name}: ${log.message}` : log.message,
                platform,
                createdAt: finalDate,
                userId: session?.user?.id || null,
                meta: details as any,
            });
        }
    }

    // Process everything
    if (auditLogsToProcess.length > 0) {
        await Promise.all(auditLogsToProcess);
    }

    if (systemLogsToCreate.length > 0) {
        await prisma.systemLog.createMany({
            data: systemLogsToCreate,
            skipDuplicates: true
        });
    }

    return NextResponse.json({ success: true, count: logs.length }, { status: 201 });
  } catch (error) {
    console.error("Log batch sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}