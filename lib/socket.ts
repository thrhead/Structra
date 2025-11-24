import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { NextApiResponse } from 'next'

export type SocketServer = SocketIOServer

let io: SocketIOServer | undefined

export const initSocketServer = (httpServer: HTTPServer): SocketIOServer => {
    if (io) {
        return io
    }

    io = new SocketIOServer(httpServer, {
        path: '/api/socket',
        addTrailingSlash: false,
        cors: {
            origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    })

    io.on('connection', (socket: Socket) => {
        console.log('Client connected:', socket.id)

        // Join user-specific room
        socket.on('join:user', (userId: string) => {
            socket.join(`user:${userId}`)
            console.log(`User ${userId} joined their room`)
        })

        // Join team-specific room
        socket.on('join:team', (teamId: string) => {
            socket.join(`team:${teamId}`)
            console.log(`Joined team room: ${teamId}`)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id)
        })
    })

    return io
}

export const getSocketServer = (): SocketIOServer | undefined => {
    return io
}

// Helper to emit events to specific users
export const emitToUser = (userId: string, event: string, data: any) => {
    if (!io) return
    io.to(`user:${userId}`).emit(event, data)
}

// Helper to emit events to specific teams
export const emitToTeam = (teamId: string, event: string, data: any) => {
    if (!io) return
    io.to(`team:${teamId}`).emit(event, data)
}

// Helper to broadcast to all connected clients
export const broadcast = (event: string, data: any) => {
    if (!io) return
    io.emit(event, data)
}
