import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoggerService, LogLevel } from '../LoggerService';
import api from '../api';
import NetInfo from '@react-native-community/netinfo';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../api', () => ({
  post: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

// Mock global ErrorUtils
global.ErrorUtils = {
  getGlobalHandler: jest.fn(),
  setGlobalHandler: jest.fn(),
};

describe('LoggerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    LoggerService._interval = null;
    AsyncStorage.getItem.mockResolvedValue('[]');
  });

  it('should initialize and start interval', () => {
    LoggerService.init();
    expect(LoggerService._interval).not.toBeNull();
    expect(global.ErrorUtils.setGlobalHandler).toHaveBeenCalled();
  });

  it('should clear interval on destroy', () => {
    LoggerService.init();
    LoggerService.destroy();
    expect(LoggerService._interval).toBeNull();
  });

  it('should add log to storage', async () => {
    await LoggerService.log(LogLevel.INFO, 'Test message');
    
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'SYSTEM_LOGS',
      expect.stringContaining('Test message')
    );
  });

  it('should trigger sync when batch size reached', async () => {
    // Mock 4 logs already in storage
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{}, {}, {}, {}]));
    const syncSpy = jest.spyOn(LoggerService, 'sync');
    
    await LoggerService.log(LogLevel.INFO, '5th message');
    
    expect(syncSpy).toHaveBeenCalled();
  });

  it('should sync logs to server when online', async () => {
    NetInfo.fetch.mockResolvedValue({ isConnected: true });
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ message: 'log1' }]));
    api.post.mockResolvedValue({ status: 201 });

    await LoggerService.sync();

    expect(api.post).toHaveBeenCalledWith('/api/logs/batch', expect.any(Array));
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('SYSTEM_LOGS');
  });

  it('should not sync if offline', async () => {
    NetInfo.fetch.mockResolvedValue({ isConnected: false });
    
    await LoggerService.sync();
    
    expect(api.post).not.toHaveBeenCalled();
  });
});
