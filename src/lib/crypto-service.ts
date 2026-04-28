import AES from 'crypto-js/aes'
import encUtf8 from 'crypto-js/enc-utf8'

// Secret key should be loaded from environment variables in production
const getSecretKey = () => {
    const key = process.env.MESSAGING_SECRET_KEY;
    if (!key) throw new Error('MESSAGING_SECRET_KEY is not configured');
    return key;
}

export class CryptoService {
    /**
     * Encrypts a message content
     * @param content Plain text message
     * @returns Encrypted string
     */
    static async encrypt(content: string): Promise<string> {
        try {
            const encrypted = AES.encrypt(content, getSecretKey()).toString()
            return encrypted
        } catch (error) {
            console.error('Encryption failed:', error)
            throw new Error('Failed to encrypt message')
        }
    }

    /**
     * Decrypts an encrypted message content
     * @param token Encrypted string
     * @returns Plain text message
     */
    static async decrypt(token: string): Promise<string> {
        try {
            const bytes = AES.decrypt(token, getSecretKey())
            const decrypted = bytes.toString(encUtf8)
            if (!decrypted) throw new Error('Decryption failed');
            return decrypted;
        } catch (error) {
            console.error('Decryption failed:', error)
            throw new Error('Decryption failed'); 
        }
    }
}
