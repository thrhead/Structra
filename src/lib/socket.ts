import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { prisma } from '@/lib/db'

// Use global object to maintain singleton across HMR/Next.js compilations
declare global {
    var io: SocketIOServer | undefined
}

export const initSocketServer = (httpServer: HTTPServer): SocketIOServer => {
    if (global.io) {
        return global.io
    }

    console.log('🔌 Initializing Socket.IO server...')
    const io = new SocketIOServer(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket: Socket) => {
        socket.on('join:user', (userId: string) => {
            socket.join(`user:${userId}`)
            console.log(`👤 User ${userId} joined their personal room`)
        })

        socket.on('join:team', (teamId: string) => {
            socket.join(`team:${teamId}`)
            console.log(`👥 Socket joined team room: team:${teamId}`)
        })

        // Job/Chat Room Support
        socket.on('join:job', (jobId: string) => {
            socket.join(`job:${jobId}`)
            console.log(`💬 Socket joined job room: job:${jobId}`)
        })

        socket.on('leave:job', (jobId: string) => {
            socket.leave(`job:${jobId}`)
            console.log(`👋 Socket left job room: job:${jobId}`)
        })

        // Handle sending messages (Real-time distribution)
        // Note: Persistence should ideally happen via API call, but we can handle it here too
        socket.on('send:message', (message: Record<string, any>) => {
            // Broadcast to the specific job room or user
            if (message.jobId) {
                socket.to(`job:${message.jobId}`).emit('receive:message', message)
            } else if (message.receiverId) {
                socket.to(`user:${message.receiverId}`).emit('receive:message', message)
            }
        })

        // Default senderId if we had to parse from token, but here we trust client userId for now
        socket.on('typing:start', (data: { jobId?: string, receiverId?: string, userId: string }) => {
            if (data.jobId) {
                socket.to(`job:${data.jobId}`).emit('typing:start', { userId: data.userId })
            } else if (data.receiverId) {
                socket.to(`user:${data.receiverId}`).emit('typing:start', { userId: data.userId })
            }
        })

        socket.on('typing:stop', (data: { jobId?: string, receiverId?: string, userId: string }) => {
            if (data.jobId) {
                socket.to(`job:${data.jobId}`).emit('typing:stop', { userId: data.userId })
            } else if (data.receiverId) {
                socket.to(`user:${data.receiverId}`).emit('typing:stop', { userId: data.userId })
            }
        })
    })

    global.io = io
    return io
}

export const getSocketServer = (): SocketIOServer | undefined => {
    return global.io
}

export const emitToUser = (userId: string, event: string, data: Record<string, unknown>) => {
    if (!global.io) return
    global.io.to(`user:${userId}`).emit(event, data)
}

export const emitToTeam = (teamId: string, event: string, data: Record<string, unknown>) => {
    if (!global.io) return
    global.io.to(`team:${teamId}`).emit(event, data)
}

export const emitToJob = (jobId: string, event: string, data: Record<string, unknown>) => {
    if (!global.io) return
    global.io.to(`job:${jobId}`).emit(event, data)
}

export const broadcast = (event: string, data: Record<string, unknown>) => {
    if (!global.io) return
    global.io.emit(event, data)
}

export const notifyAdmins = async (event: string, data: Record<string, unknown>) => {
    if (!global.io) return

    try {
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
        })

        admins.forEach((admin) => {
            global.io!.to(`user:${admin.id}`).emit(event, data)
        })
    } catch (error) {
        console.error('❌ Error notifying admins:', error)
    }
}
