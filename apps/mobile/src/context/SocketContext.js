import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Ably from 'ably';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../services/api';
import { Platform } from 'react-native';

const SocketContext = createContext({
    socket: null,
    isConnected: false,
    unreadCount: 0,
    notifications: [],
    markAsRead: () => { },
    markAllAsRead: () => { },
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    // Ref to keep track of client instance to prevent multiple connections
    const clientRef = useRef(null);
    const channelRef = useRef(null);

    console.log('[SocketContext] Render. Auth:', isAuthenticated, 'User:', user?.id);

    useEffect(() => {
        console.log('[SocketContext] Effect triggered. Auth:', isAuthenticated, 'User:', user?.id);
        
        if (!isAuthenticated || !user) {
            if (clientRef.current) {
                console.log('[Ably] Closing connection due to logout');
                clientRef.current.close();
                clientRef.current = null;
                channelRef.current = null;
                setSocket(null);
                setIsConnected(false);
                setUnreadCount(0);
                setNotifications([]);
            }
            return;
        }

        if (clientRef.current && clientRef.current.connection.state === 'connected') {
            console.log('[Ably] Already connected');
            return;
        }

        // Initialize Ably client (reuse the same pattern as SocketContext for compatibility)
        console.log('[Ably] Initializing connection to:', API_BASE_URL);

        // Use authCallback to pass the JWT token manually
        const ably = new Ably.Realtime({
            authCallback: (tokenParams, callback) => {
                // Ably SDK calls this with tokenParams, we need to call callback(err, tokenRequest)
                (async () => {
                    try {
                        const api = require('../services/api');
                        const token = await api.getAuthToken();
                        
                        const response = await fetch(`${API_BASE_URL}/api/ably/auth`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (response.ok) {
                            const tokenRequestData = await response.json();
                            callback(null, tokenRequestData);
                        } else {
                            const errorText = await response.text();
                            callback(new Error(errorText || 'Auth failed'), null);
                        }
                    } catch (error) {
                        console.error('[Ably] Auth callback error:', error);
                        callback(error, null);
                    }
                })();
            },
            clientId: user.id,
        });

        clientRef.current = ably;
        setSocket(ably);

        ably.connection.on('connected', () => {
            console.log('[Ably] ✅ Connected:', ably.clientId);
            setIsConnected(true);

            // Subscribe to user-specific channel for notifications
            const userChannel = ably.channels.get(`user:${user.id}`);
            channelRef.current = userChannel;

            console.log('[Ably] Subscribing to user channel:', `user:${user.id}`);

            // Listen for new notifications
            userChannel.subscribe('notification:new', (message) => {
                console.log('[Ably] 🔔 New notification received:', message.data);
                setUnreadCount(prev => prev + 1);
                setNotifications(prev => [message.data, ...prev]);

                // Show alert for notification
                if (Platform.OS !== 'web') {
                    const { Alert } = require('react-native');
                    if (message.data.title && message.data.message) {
                        Alert.alert(message.data.title, message.data.message);
                    }
                }
            });

            // Listen for job completion
            userChannel.subscribe('job:completed', (message) => {
                console.log('[Ably] ✅ Job completed:', message.data);
                if (Platform.OS !== 'web') {
                    const { Alert } = require('react-native');
                    Alert.alert('İş Tamamlandı', `${message.data?.title || 'İş'} tamamlandı.`);
                }
            });

            // Listen for job status changes
            userChannel.subscribe('job:status_changed', (message) => {
                console.log('[Ably] 📊 Job status changed:', message.data);
            });

            // Listen for photo upload
            userChannel.subscribe('photo:uploaded', (message) => {
                console.log('[Ably] 📸 Photo uploaded:', message.data);
                if (Platform.OS !== 'web') {
                    const { Alert } = require('react-native');
                    Alert.alert('Fotoğraf Yüklendi', `${message.data?.uploadedBy || 'Kullanıcı'} yeni bir fotoğraf yükledi.`);
                }
            });

            // Listen for cost submitted
            userChannel.subscribe('cost:submitted', (message) => {
                console.log('[Ably] 💰 Cost submitted:', message.data);
                if (Platform.OS !== 'web') {
                    const { Alert } = require('react-native');
                    Alert.alert('Maliyet Gönderildi', 'Yeni bir maliyet gönderildi.');
                }
            });

            // Fetch initial unread count
            fetchUnreadCount();
        });

        ably.connection.on('disconnected', () => {
            console.log('[Ably] ⚠️ Disconnected');
            setIsConnected(false);
        });

        ably.connection.on('failed', (error) => {
            console.error('[Ably] ❌ Connection failed:', error);
            setIsConnected(false);
        });

        return () => {
            console.log('[Ably] Cleaning up connection');
            if (clientRef.current) {
                clientRef.current.close();
                clientRef.current = null;
                channelRef.current = null;
            }
        };
    }, [isAuthenticated, user]);

    const fetchUnreadCount = async () => {
        try {
            // We can use the existing axios instance which has the auth token
            const response = await fetch(`${API_BASE_URL}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${await require('../services/api').getAuthToken()}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Filter unread
                const unread = data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
                setNotifications(data);
            }
        } catch (error) {
            console.error('[Socket] Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            // Optimistic update
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            ));

            const response = await fetch(`${API_BASE_URL}/api/notifications`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await require('../services/api').getAuthToken()}`
                },
                body: JSON.stringify({ id: notificationId })
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            // Revert on error
            setUnreadCount(prev => prev + 1);
        }
    };

    const markAllAsRead = async () => {
        try {
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

            const response = await fetch(`${API_BASE_URL}/api/notifications`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${await require('../services/api').getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    return (
        <SocketContext.Provider value={{
            socket,
            isConnected,
            unreadCount,
            notifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </SocketContext.Provider>
    );
};
