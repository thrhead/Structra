import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SECURE_KEY_NAME = 'app_crypto_secure_key';

export class CryptoService {
    /**
     * Gets or generates the secret key securely
     * @returns {Promise<string>} Secret key
     */
    static async getSecretKey() {
        if (Platform.OS === 'web') {
            let key = typeof window !== 'undefined' ? window.localStorage.getItem(SECURE_KEY_NAME) : null;
            if (!key) {
                key = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
                if (typeof window !== 'undefined') window.localStorage.setItem(SECURE_KEY_NAME, key);
            }
            return key;
        }

        let key = await SecureStore.getItemAsync(SECURE_KEY_NAME);
        if (!key) {
            key = Array.from({ length: 32 }, () => Math.floor(Math.random() * 36).toString(36)).join('');
            await SecureStore.setItemAsync(SECURE_KEY_NAME, key);
        }
        return key;
    }

    /**
     * Encrypts a message content
     * @param {string} content Plain text message
     * @returns {Promise<string>} Encrypted string
     */
    static async encrypt(content) {
        try {
            const key = await this.getSecretKey();
            const encrypted = AES.encrypt(content, key).toString();
            return encrypted;
        } catch (error) {
            console.error('Mobile Encryption failed:', error);
            throw new Error('Encryption failed');
        }
    }

    /**
     * Decrypts an encrypted message content
     * @param {string} token Encrypted string
     * @returns {Promise<string>} Plain text message
     */
    static async decrypt(token) {
        if (!token || typeof token !== 'string') {
            return token;
        }

        try {
            const key = await this.getSecretKey();
            const bytes = AES.decrypt(token, key);
            const decrypted = bytes.toString(encUtf8);
            
            if (!decrypted) {
                throw new Error('Decryption resulted in empty string');
            }
            
            return decrypted;
        } catch (error) {
            console.error('Mobile Decryption failed:', error);
            throw new Error('Decryption failed');
        }
    }
}
