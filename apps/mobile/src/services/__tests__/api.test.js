import { describe, it, expect, vi, beforeEach } from 'vitest';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../api';
import { QueueService } from '../QueueService';

vi.mock('@react-native-community/netinfo', () => ({
  default: {
    fetch: vi.fn(),
    addEventListener: vi.fn(),
  },
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock('../QueueService', () => ({
  QueueService: {
    addItem: vi.fn(),
    getItems: vi.fn(),
    removeItem: vi.fn(),
    updateItem: vi.fn(),
    initialize: vi.fn(),
  },
}));

describe('API Interceptor (Offline Sync)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock adapter to prevent real network requests
    api.defaults.adapter = vi.fn().mockResolvedValue({
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  });

  it('should send POST request normally when online', async () => {
    NetInfo.fetch.mockResolvedValue({ isConnected: true });
    
    await api.post('/test', { data: 'test' });

    expect(NetInfo.fetch).toHaveBeenCalled();
    expect(QueueService.addItem).not.toHaveBeenCalled();
  });

  it('should queue POST request when offline', async () => {
    NetInfo.fetch.mockResolvedValue({ isConnected: false });
    QueueService.addItem.mockResolvedValue({ id: 'mock-id' });

    // In api.js, when it's queued it throws an object with __isQueued: true
    // Let's check how api.js handles it or if we should catch it
    try {
        await api.post('/api/worker/jobs/1/complete', { notes: 'done' });
    } catch (error) {
        if (error.__isQueued) {
            // This is the expected behavior for offline queueing in api.js
        } else {
            throw error;
        }
    }

    expect(NetInfo.fetch).toHaveBeenCalled();
    expect(QueueService.addItem).toHaveBeenCalledWith(expect.objectContaining({
      type: 'POST',
      url: '/api/worker/jobs/1/complete',
      payload: { notes: 'done' },
      clientVersion: null
    }));
  });

  it('should queue PUT request when offline', async () => {
    NetInfo.fetch.mockResolvedValue({ isConnected: false });
    QueueService.addItem.mockResolvedValue({ id: 'mock-id' });

    try {
        await api.put('/api/users/1', { name: 'New Name' });
    } catch (error) {
        if (!error.__isQueued) throw error;
    }

    expect(QueueService.addItem).toHaveBeenCalledWith(expect.objectContaining({
      type: 'PUT',
      url: '/api/users/1'
    }));
  });
});
