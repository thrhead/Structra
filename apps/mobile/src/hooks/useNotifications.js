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
            setNotifications(data);
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
        console.log('[useNotifications] 🔥 START: deleteAllNotifications');
        
        try {
            const result = await notificationService.deleteAllNotifications();
            console.log('[useNotifications] ✅ SUCCESS: deleteAllNotifications', result);
            setNotifications([]);
            Alert.alert('Başarılı', 'Tüm bildirimler silindi.');
        } catch (error) {
            console.error('[useNotifications] ❌ ERROR: deleteAllNotifications', error);
            const errorMsg = error.response?.data?.error || error.message || 'Bilinmeyen bir hata oluştu.';
            Alert.alert('Hata', `Bildirimler silinirken bir hata oluştu: ${errorMsg}`);
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
