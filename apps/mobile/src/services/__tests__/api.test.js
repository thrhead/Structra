import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import { QueueService } from '../QueueService';

jest.mock('@react-native-community/netinfo', () => ({ fetch: jest.fn(), addEventListener: jest.fn() }));

jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() }));

jest.mock('../QueueService', () => ({
  QueueService: {
    addItem: jest.fn(),
    getItems: jest.fn(),
    removeItem: jest.fn(),
    updateItem: jest.fn(),
    initialize: jest.fn(),
  },
}));

describe('API Interceptor (Offline Sync)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(api).toBeDefined();
  });
});
