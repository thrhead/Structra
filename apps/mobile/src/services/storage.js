import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
    USER: '@assembly_tracker:user',
    TOKEN: '@assembly_tracker:token',
};

export const storage = {
    // Kullanıcı bilgilerini kaydet
    saveUser: async (user) => {
        try {
            if (Platform.OS === 'web') { await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)); } else { await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user)); }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    },

    // Kullanıcı bilgilerini al
    getUser: async () => {
        try {
            const user = Platform.OS === 'web' ? await AsyncStorage.getItem(STORAGE_KEYS.USER) : await SecureStore.getItemAsync(STORAGE_KEYS.USER);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    // Token kaydet
    saveToken: async (token) => {
        try {
            if (Platform.OS === 'web') { await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token); } else { await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token); }
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    // Token al
    getToken: async () => {
        try {
            return Platform.OS === 'web' ? await AsyncStorage.getItem(STORAGE_KEYS.TOKEN) : await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    // Tüm verileri temizle (logout)
    clearAll: async () => {
        try {
            if (Platform.OS === 'web') { await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.TOKEN]); } else { await SecureStore.deleteItemAsync(STORAGE_KEYS.USER); await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN); }
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },
};
