import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import notificationService from '../services/notification.service';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [loadNotifications])
    );

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(_ => {
            loadNotifications();
        });
        return () => subscription.remove();
    }, [loadNotifications]);

    const onRefresh = () => {
        setRefreshing(true);
        loadNotifications();
    };

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const deleteNotification = useCallback(async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }, []);

    const deleteAllNotifications = useCallback(async () => {
        const { Alert } = require('react-native');
        console.log('[useNotifications] Triggering deleteAllNotifications...');
        
        try {
            // Check if service exists
            if (!notificationService || !notificationService.deleteAllNotifications) {
                throw new Error('Notification service is not properly initialized.');
            }

            const response = await notificationService.deleteAllNotifications();
            console.log('[useNotifications] API Response:', response);
            
            setNotifications([]);
            Alert.alert('Başarılı', 'Tüm bildirimler silindi.');
        } catch (error) {
            console.error('[useNotifications] FAILED to delete all:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Bilinmeyen bir ağ hatası.';
            Alert.alert('İşlem Başarısız', `Hata: ${errorMessage}`);
        }
    }, []);

    return {
        notifications,
        loading,
        refreshing,
        onRefresh,
        markAsRead,
        deleteNotification,
        deleteAllNotifications
    };
};
