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
    joinJobRoom: () => { },
    leaveJobRoom: () => { },
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
    const jobChannelsRef = useRef({});

    console.log('[SocketContext] Render. Auth:', isAuthenticated, 'User:', user?.id);

    // Create a compatible socket object
    const createSocketWrapper = (ably) => {
        // Map to keep track of wrapped callbacks for unsubscription
        const wrappedCallbacks = new Map();

        return {
            ably,
            on: (event, callback) => {
                console.log(`[Ably Wrapper] Subscribing to: ${event}`);
                
                const wrappedCallback = (message) => {
                    if (message && message.data) {
                        callback(message.data);
                    } else {
                        callback(message);
                    }
                };
                
                // Store the mapping
                if (!wrappedCallbacks.has(event)) {
                    wrappedCallbacks.set(event, new Map());
                }
                wrappedCallbacks.get(event).set(callback, wrappedCallback);

                if (event === 'connect') {
                    ably.connection.on('connected', callback);
                } else if (event === 'disconnect') {
                    ably.connection.on('disconnected', callback);
                } else if (event === 'error') {
                    ably.connection.on('failed', callback);
                } else if (event === 'job:updated') {
                    // This is a special case for JobDetailScreen
                    Object.values(jobChannelsRef.current).forEach(channel => {
                        channel.subscribe('job:updated', wrappedCallback);
                    });
                    ably._jobUpdateCallback = callback;
                } else {
                    // Default to user channel for other events
                    const userChannel = ably.channels.get(`user:${user?.id}`);
                    userChannel.subscribe(event, wrappedCallback);
                    
                    // Also listen on system channel for broadcast events
                    const systemChannel = ably.channels.get('system');
                    systemChannel.subscribe(event, wrappedCallback);
                }
            },
            off: (event, callback) => {
                console.log(`[Ably Wrapper] Unsubscribing from: ${event}`);
                
                const eventMap = wrappedCallbacks.get(event);
                const wrappedCallback = eventMap ? eventMap.get(callback) : null;

                if (event === 'connect') {
                    ably.connection.off('connected', callback);
                } else if (event === 'disconnect') {
                    ably.connection.off('disconnected', callback);
                } else if (event === 'job:updated') {
                    Object.values(jobChannelsRef.current).forEach(channel => {
                        if (wrappedCallback) {
                            channel.unsubscribe('job:updated', wrappedCallback);
                        } else {
                            channel.unsubscribe('job:updated');
                        }
                    });
                    ably._jobUpdateCallback = null;
                } else {
                    const userChannel = ably.channels.get(`user:${user?.id}`);
                    const systemChannel = ably.channels.get('system');
                    
                    if (wrappedCallback) {
                        userChannel.unsubscribe(event, wrappedCallback);
                        systemChannel.unsubscribe(event, wrappedCallback);
                        eventMap.delete(callback);
                    } else {
                        userChannel.unsubscribe(event);
                        systemChannel.unsubscribe(event);
                    }
                }
            },
            emit: (event, ...args) => {
                console.log(`[Ably Wrapper] Emitting: ${event}`, args);
                // Simple emit to user-specific channel
                const userChannel = ably.channels.get(`user:${user?.id}`);
                userChannel.publish(event, args[0]);
            }
        };
    };

    const joinJobRoom = (jobId) => {
        if (!clientRef.current) return;
        console.log(`[Ably] Joining job room: job:${jobId}`);
        const channel = clientRef.current.channels.get(`job:${jobId}`);
        jobChannelsRef.current[jobId] = channel;

        // If we have a pending job:updated callback, subscribe now
        if (clientRef.current._jobUpdateCallback) {
            channel.subscribe('job:updated', (message) => {
                clientRef.current._jobUpdateCallback(message.data);
            });
        }
    };

    const leaveJobRoom = (jobId) => {
        if (!clientRef.current) return;
        console.log(`[Ably] Leaving job room: job:${jobId}`);
        const channel = jobChannelsRef.current[jobId];
        if (channel) {
            try {
                channel.unsubscribe();
                // Detach returns a promise that can throw if connection is dropped
                channel.detach().catch(e => console.warn('[Ably] detach warning:', e));
            } catch (error) {
                console.warn('[Ably] unsubscribe warning:', error);
            }
            delete jobChannelsRef.current[jobId];
        }
    };

    useEffect(() => {
        console.log('[SocketContext] Effect triggered. Auth:', isAuthenticated, 'User:', user?.id);
        
        if (!isAuthenticated || !user) {
            if (clientRef.current) {
                console.log('[Ably] Closing connection due to logout');
                clientRef.current.close();
                clientRef.current = null;
                channelRef.current = null;
                jobChannelsRef.current = {};
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
        setSocket(createSocketWrapper(ably));

        ably.connection.on('connected', () => {
            console.log('[Ably] ✅ Connected:', ably.clientId);
            setIsConnected(true);
            console.log('[Ably] Subscribing to user channel (catch-all):', `user:${user.id}`);
            
            // Generic handler for all messages on user channel
            const handleMessage = (message) => {
                const eventName = message.name;
                const data = message.data;
                console.log(`[Ably-Mobile] Received event "${eventName}":`, data);

                switch (eventName) {
                    case 'notification:new':
                    case 'notification:refresh':
                        console.log('[Ably-Mobile] Refreshing notifications...');
                        setUnreadCount(prev => prev + 1);
                        if (data && typeof data === 'object') {
                            setNotifications(prev => [data, ...prev]);
                            if (Platform.OS !== 'web' && data.title && data.message) {
                                const { Alert } = require('react-native');
                                Alert.alert(data.title, data.message);
                            }
                        }
                        fetchUnreadCount(); // Full sync
                        break;
                    
                    case 'job:completed':
                        if (Platform.OS !== 'web') {
                            const { Alert } = require('react-native');
                            Alert.alert('İş Tamamlandı', `${data?.title || 'İş'} tamamlandı.`);
                        }
                        break;

                    case 'photo:uploaded':
                        if (Platform.OS !== 'web') {
                            const { Alert } = require('react-native');
                            Alert.alert('Fotoğraf Yüklendi', `${data?.uploadedBy || 'Kullanıcı'} yeni bir fotoğraf yükledi.`);
                        }
                        break;

                    case 'cost:approved':
                    case 'cost:rejected':
                        console.log(`[Ably-Mobile] Cost event received: ${eventName}`);
                        if (Platform.OS !== 'web') {
                            const { Alert } = require('react-native');
                            const statusText = eventName === 'cost:approved' ? 'Onaylandı' : 'Reddedildi';
                            Alert.alert('Masraf Güncellemesi', `Masraf durumu: ${statusText}`);
                        }
                        fetchUnreadCount();
                        break;

                    default:
                        console.log(`[Ably-Mobile] Unhandled event: ${eventName}`);
                }
            };

            // Catch-all subscription
            const userChannel = ably.channels.get(`user:${user.id}`);
            channelRef.current = userChannel;
            userChannel.subscribe(handleMessage);

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
                jobChannelsRef.current = {};
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
                // API returns { notifications: Array, unreadCount: Number }
                // Handle both object with 'notifications' key and direct array for robustness
                const notificationsList = data.notifications || (Array.isArray(data) ? data : []);
                const count = typeof data.unreadCount === 'number' ? data.unreadCount : notificationsList.filter(n => !n.isRead).length;
                
                setUnreadCount(count);
                setNotifications(notificationsList);
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
            markAllAsRead,
            joinJobRoom,
            leaveJobRoom
        }}>
            {children}
        </SocketContext.Provider>
    );
};
