import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Uygulama başladığında kullanıcıyı kontrol et
    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const savedUser = await storage.getUser();
            if (savedUser) {
                setUser(savedUser);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // GEÇICI: Mock login - CORS sorunu olduğu için
            const mockUsers = {
                'worker1@montaj.com': { email: 'worker1@montaj.com', role: 'worker', name: 'Ali Yılmaz' },
                'admin@montaj.com': { email: 'admin@montaj.com', role: 'admin', name: 'Admin User' },
                'manager@montaj.com': { email: 'manager@montaj.com', role: 'manager', name: 'Manager User' },
            };

            if (mockUsers[email] && password === 'worker123') {
                const user = mockUsers[email];
                await storage.saveUser(user);
                setUser(user);
                return { success: true };
            } else {
                return { success: false, error: 'Geçersiz e-posta veya şifre' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        await storage.clearAll();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
