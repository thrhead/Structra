import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChatPanel } from '../ChatPanel'
import { useSocket } from '@/components/providers/socket-provider'
import { useSession } from 'next-auth/react'
import { CryptoService } from '@/lib/crypto-service'
import { offlineDB } from '@/lib/offline-db'

// Mocks
vi.mock('@/components/providers/socket-provider', () => ({
    useSocket: vi.fn(),
}))

vi.mock('next-auth/react', () => ({
    useSession: vi.fn(),
}))

vi.mock('@/lib/crypto-service', () => ({
    CryptoService: {
        encrypt: vi.fn((text) => Promise.resolve(`encrypted-${text}`)),
        decrypt: vi.fn((text) => Promise.resolve(text.replace('encrypted-', ''))),
    },
}))

vi.mock('@/lib/offline-db', () => ({
    offlineDB: {
        messages: {
            where: vi.fn().mockReturnThis(),
            equals: vi.fn().mockReturnThis(),
            sortBy: vi.fn().mockResolvedValue([]),
            bulkPut: vi.fn().mockResolvedValue([]),
        },
    },
}))

// Mock Global Fetch
global.fetch = vi.fn()

describe('ChatPanel Component', () => {
    const mockSession = {
        user: { id: 'user-1', name: 'Test User' },
    }

    const mockSocket = {
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        ;(useSession as any).mockReturnValue({ data: mockSession })
        ;(useSocket as any).mockReturnValue({ socket: mockSocket, isConnected: true })
        ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([]),
        })
    })

    it('should render loading state initially', async () => {
        render(<ChatPanel jobId="job-1" />)
        expect(screen.getByRole('status')).toBeDefined() // Loader
    })

    it('should load and display messages', async () => {
        const mockMessages = [
            {
                id: 'msg-1',
                content: 'Hello World',
                senderId: 'user-2',
                sentAt: new Date().toISOString(),
                isEncrypted: false,
                sender: { id: 'user-2', name: 'Other User', avatarUrl: null },
            },
        ]

        ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockMessages),
        })

        render(<ChatPanel jobId="job-1" />)

        await waitFor(() => {
            expect(screen.getByText('Hello World')).toBeDefined()
            expect(screen.getByText('Other User')).toBeDefined()
        })
    })

    it('should send a message successfully', async () => {
        render(<ChatPanel jobId="job-1" />)

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByRole('status')).toBeNull()
        })

        const input = screen.getByPlaceholderText('Mesajınızı yazın...')
        const sendButton = screen.getByRole('button')

        fireEvent.change(input, { target: { value: 'New Message' } })
        
        ;(global.fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({
                id: 'msg-new',
                content: 'encrypted-New Message',
                senderId: 'user-1',
                sentAt: new Date().toISOString(),
                isEncrypted: true,
                sender: mockSession.user,
            }),
        })

        fireEvent.click(sendButton)

        await waitFor(() => {
            expect(CryptoService.encrypt).toHaveBeenCalledWith('New Message')
            expect(global.fetch).toHaveBeenCalledWith('/api/messages', expect.objectContaining({
                method: 'POST',
            }))
            expect(screen.getByText('New Message')).toBeDefined()
        })
    })

    it('should handle real-time message reception', async () => {
        let receiveCallback: any
        mockSocket.on.mockImplementation((event, cb) => {
            if (event === 'receive:message') receiveCallback = cb
        })

        render(<ChatPanel jobId="job-1" />)

        await waitFor(() => {
            expect(receiveCallback).toBeDefined()
        })

        const newMessage = {
            id: 'msg-2',
            content: 'Real-time message',
            senderId: 'user-2',
            sentAt: new Date().toISOString(),
            isEncrypted: false,
            sender: { id: 'user-2', name: 'Other User', avatarUrl: null },
        }

        // Trigger socket event
        receiveCallback(newMessage)

        await waitFor(() => {
            expect(screen.getByText('Real-time message')).toBeDefined()
        })
    })
})
