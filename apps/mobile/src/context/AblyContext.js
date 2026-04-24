import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import Ably from 'ably';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../services/api';

const AblyContext = createContext({
    client: null,
    isConnected: false,
    channel: null,
});

export const useAbly = () => useContext(AblyContext);

export const AblyProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [channel, setChannel] = useState(null);

    const clientRef = useRef(null);

    useEffect(() => {
        console.log('[AblyContext] Effect triggered. Auth:', isAuthenticated, 'User:', user?.id);

        if (!isAuthenticated || !user) {
            if (clientRef.current) {
                console.log('[Ably] Closing connection due to logout');
                clientRef.current.close();
                clientRef.current = null;
                setClient(null);
                setChannel(null);
                setIsConnected(false);
            }
            return;
        }

        if (clientRef.current && clientRef.current.connection.state === 'connected') {
            console.log('[Ably] Already connected');
            return;
        }

        // Initialize Ably client
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
        setClient(ably);

        ably.connection.on('connected', () => {
            console.log('[Ably] ✅ Connected');
            setIsConnected(true);

            // Subscribe to user-specific channel
            const userChannel = ably.channels.get(`user:${user.id}`);
            setChannel(userChannel);

            console.log('[Ably] Subscribing to user channel:', `user:${user.id}`);
            
            // Subscribe to notification events
            userChannel.subscribe('notification:new', (message) => {
                console.log('[Ably] 🔔 New notification received:', message.data);
            });

            // Subscribe to other events
            userChannel.subscribe('job:completed', (message) => {
                console.log('[Ably] ✅ Job completed:', message.data);
            });

            userChannel.subscribe('job:status_changed', (message) => {
                console.log('[Ably] 📊 Job status changed:', message.data);
            });

            userChannel.subscribe('photo:uploaded', (message) => {
                console.log('[Ably] 📸 Photo uploaded:', message.data);
            });
        });

        ably.connection.on('disconnected', () => {
            console.log('[Ably] ⚠️ Disconnected');
            setIsConnected(false);
        });

        ably.connection.on('failed', (err) => {
            console.error('[Ably] ❌ Connection failed:', err);
            setIsConnected(false);
        });

        return () => {
            console.log('[Ably] Cleaning up');
            if (clientRef.current) {
                clientRef.current.close();
                clientRef.current = null;
            }
        };
    }, [isAuthenticated, user]);

    return (
        <AblyContext.Provider value={{ client, isConnected, channel }}>
            {children}
        </AblyContext.Provider>
    );
};
