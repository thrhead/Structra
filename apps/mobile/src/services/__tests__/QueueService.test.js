import { describe, it, expect, vi, beforeEach } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueueService } from '../QueueService';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

// Mock expo-file-system
vi.mock('expo-file-system', () => ({
  documentDirectory: 'test-dir/',
  getInfoAsync: vi.fn().mockResolvedValue({ exists: true }),
  makeDirectoryAsync: vi.fn(),
  writeAsStringAsync: vi.fn(),
  readAsStringAsync: vi.fn(),
  deleteAsync: vi.fn(),
}));

describe('QueueService', () => {
  const STORAGE_KEY = 'OFFLINE_QUEUE';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should add an item to the queue', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
    
    const item = { type: 'TEST_ACTION', url: '/test', payload: { data: 'test' } };
    await QueueService.addItem(item);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      expect.stringContaining('TEST_ACTION')
    );
    
    const savedData = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(savedData[0].type).toBe('TEST_ACTION');
    expect(savedData[0].id).toBeDefined();
    expect(savedData[0].createdAt).toBeDefined();
    expect(savedData[0].retryCount).toBe(0);
  });

  it('should get all items from the queue', async () => {
    const mockQueue = [{ id: '1', type: 'ACTION' }];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockQueue));

    const items = await QueueService.getItems();
    expect(items).toEqual(mockQueue);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('should return empty array if queue is empty', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const items = await QueueService.getItems();
    expect(items).toEqual([]);
  });

  it('should remove an item by id', async () => {
    const mockQueue = [
      { id: '1', type: 'ACTION1' },
      { id: '2', type: 'ACTION2' }
    ];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockQueue));

    await QueueService.removeItem('1');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY,
      JSON.stringify([{ id: '2', type: 'ACTION2' }])
    );
  });

  describe('initialize', () => {
    it('should return the count of items in queue', async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1' }, { id: '2' }]));
      const count = await QueueService.initialize();
      expect(count).toBe(2);
    });

    it('should return 0 and log error if data is corrupted', async () => {
      AsyncStorage.getItem.mockResolvedValue('invalid-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const count = await QueueService.initialize();
      
      expect(count).toBe(0);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
