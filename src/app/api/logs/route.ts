import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth-helper';
import { logAudit } from '@/lib/audit';

// Gelen isteğin gövdesi için bir Zod şeması tanımlıyoruz.
// Bu, veri bütünlüğünü ve güvenliği sağlar.
const logSchema = z.object({
  level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR', 'AUDIT']),
  message: z.string(),
  // Corrected: z.record expects key and value types.
  meta: z.record(z.string(), z.any()).optional(), // Esnek bir JSON nesnesi için
});

export async function POST(request: Request) {
  try {
    const session = await verifyAuth(request);
    const body = await request.json();
    const validation = logSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid log payload', errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { level, message, meta = {} } = validation.data;
    const userAgent = request.headers.get('user-agent') || 'Bilinmiyor';
    
    // Determine platform and device info
    const platform = meta.platform || (userAgent.toLowerCase().includes('mobile') ? 'mobile' : 'web');
    const device = meta.deviceModel || meta.device || userAgent.split(')')[0].split('(')[1] || userAgent;

    const auditDetails = {
        ...meta,
        device,
        userAgent,
        platform,
        userName: session?.user?.name || 'Sistem'
    };

    if (level === 'AUDIT') {
        // Use the centralized audit logger for audit level logs
        await logAudit(
            session?.user?.id || 'system',
            message,
            auditDetails,
            platform
        );
    } else {
        // Standard system log
        await prisma.systemLog.create({
          data: {
            level,
            message: session?.user?.name ? `${session.user.name}: ${message}` : message,
            userId: session?.user?.id || null,
            meta: auditDetails as any,
            platform,
          },
        });
    }

    return NextResponse.json({ message: 'Log received' }, { status: 201 });
  } catch (error) {
    console.error('[LOG API] Failed to process log:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
