import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import * as Ably from 'ably';
import { useAuth } from './AuthContext';
import { API_BASE_URL, getAuthToken } from '../services/api';
import { Platform, Alert } from 'react-native';

const AblyContext = createContext({
    ably: null,
    isConnected: false,
    unreadCount: 0,
    notifications: [],
    markAsRead: () => { },
    markAllAsRead: () => { },
    getChannel: () => null,
});

export const useAbly = () => useContext(AblyContext);

export const AblyProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [ably, setAbly] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const ablyRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (ablyRef.current) {
                ablyRef.current.close();
                ablyRef.current = null;
                setAbly(null);
                setIsConnected(false);
            }
            return;
        }

        if (ablyRef.current) return;

        const client = new Ably.Realtime({
            authUrl: `${API_BASE_URL}/api/ably/auth`,
            authHeaders: {
                'Authorization': `Bearer ${getAuthToken()}`
            },
            clientId: user.id
        });

        ablyRef.current = client;
        setAbly(client);

        client.connection.on('connected', () => {
            setIsConnected(true);
            fetchUnreadCount();
        });

        client.connection.on('disconnected', () => {
            setIsConnected(false);
        });

        // Global Notifications Channel
        const notificationChannel = client.channels.get(`user:${user.id}:notifications`);
        notificationChannel.subscribe('notification:new', (msg) => {
            const notification = msg.data;
            setUnreadCount(prev => prev + 1);
            setNotifications(prev => [notification, ...prev]);
            Alert.alert(notification.title, notification.message);
        });

        return () => {
            if (ablyRef.current) {
                ablyRef.current.close();
                ablyRef.current = null;
            }
        };
    }, [isAuthenticated, user]);

    const fetchUnreadCount = async () => {
        try {
            const token = await getAuthToken();
            const response = await fetch(`${API_BASE_URL}/api/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                const unread = data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
                setNotifications(data);
            }
        } catch (error) {
            console.error('[Ably] Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n =>
                n.id === notificationId ? { ...n, isRead: true } : n
            ));
            const api = require('../services/api').default;
            await api.patch('/api/notifications/mark-read', { notificationId });
        } catch (error) {
            console.error('[Ably] Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            const api = require('../services/api').default;
            await api.patch('/api/notifications/mark-read', {});
        } catch (error) {
            console.error('[Ably] Error marking all as read:', error);
        }
    };

    const getChannel = (channelName) => {
        return ablyRef.current ? ablyRef.current.channels.get(channelName) : null;
    };

    return (
        <AblyContext.Provider value={{
            ably,
            isConnected,
            unreadCount,
            notifications,
            markAsRead,
            markAllAsRead,
            getChannel
        }}>
            {children}
        </AblyContext.Provider>
    );
};
