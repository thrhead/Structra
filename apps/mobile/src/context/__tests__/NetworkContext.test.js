import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { NetworkProvider, useNetwork } from '../NetworkContext';
import NetInfo from '@react-native-community/netinfo';

const getNetInfo = () => NetInfo.fetch ? NetInfo : (NetInfo.default || NetInfo);
const getAsyncStorage = () => AsyncStorage.getItem ? AsyncStorage : (AsyncStorage.default || AsyncStorage);
// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({ fetch: jest.fn(), addEventListener: jest.fn() }));

describe('NetworkContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock return for addEventListener
    getNetInfo().addEventListener.mockReturnValue(() => {});
  });

  it('should provide isConnected status', async () => {
    getNetInfo().fetch.mockResolvedValue({ isConnected: true, isInternetReachable: true });
    
    const wrapper = ({ children }) => <NetworkProvider>{children}</NetworkProvider>;
    const { result } = renderHook(() => useNetwork(), { wrapper });

    // Wait for the useEffect to complete the fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    }); 

    expect(result.current.isConnected).toBe(true);
  });

  it('should update isConnected status when NetInfo emits changes', async () => {
    let callback;
    getNetInfo().addEventListener.mockImplementation((cb) => {
      callback = cb;
      return () => {};
    });
    getNetInfo().fetch.mockResolvedValue({ isConnected: true });

    const wrapper = ({ children }) => <NetworkProvider>{children}</NetworkProvider>;
    const { result } = renderHook(() => useNetwork(), { wrapper });

    // Wait for initial fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Simulate network change
    await act(async () => {
      if (callback) {
        callback({ isConnected: false, isInternetReachable: false });
      }
    });

    expect(result.current.isConnected).toBe(false);
  });
});
