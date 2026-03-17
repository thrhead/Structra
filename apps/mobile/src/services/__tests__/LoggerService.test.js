import { LoggerService, LogLevel } from '../LoggerService';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../api', () => ({
    post: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe('LoggerService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        LoggerService._interval = null;
    });

    it('should initialize', () => {
        LoggerService.init();
        expect(LoggerService._interval).not.toBeNull();
    });
});
