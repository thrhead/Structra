import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Platform, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from '../../components/worker/NotificationItem';

import CustomSpinner from '../../components/CustomSpinner';
export default function NotificationsScreen({ navigation }) {
    const { theme, isDark } = useTheme();
    const { notifications, loading, refreshing, onRefresh, markAsRead, deleteNotification, deleteAllNotifications } = useNotifications();

    const handleNotificationPress = React.useCallback(async (notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.id);
        }

        if (notification.link) {
            const link = notification.link;

            // Job Detail matching
            const jobMatch = /\/jobs\/([a-zA-Z0-9-]+)/.exec(link);
            if (jobMatch && jobMatch[1]) {
                navigation.navigate('JobDetail', { jobId: jobMatch[1] });
                return;
            }

            // Other routes
            if (link.includes('/approvals')) {
                navigation.navigate('Approvals');
            } else if (link.includes('/costs') || link.includes('/expenses')) {
                navigation.navigate('CostManagement');
            } else if (link.includes('/profile')) {
                navigation.navigate('Profile');
            } else if (link.includes('/jobs')) {
                navigation.navigate('Jobs');
            }
        }
    }, [markAsRead, navigation]);

    const handleDeleteNotification = React.useCallback((id) => {
        deleteNotification(id);
    }, [deleteNotification]);

    const handleDeleteAll = React.useCallback(() => {
        console.log('[NotificationsScreen] Bulk delete button pressed');
        Alert.alert(
            "Tümünü Sil",
            "Tüm bildirimleri silmek istediğinize emin misiniz?",
            [
                { text: "Vazgeç", style: "cancel" },
                { 
                    text: "Sil", 
                    style: "destructive", 
                    onPress: () => {
                        console.log('[NotificationsScreen] Confirming bulk delete');
                        deleteAllNotifications();
                    }
                }
            ]
        );
    }, [deleteAllNotifications]);

    const renderItem = React.useCallback(({ item }) => (
        <NotificationItem
            item={item}
            onPress={handleNotificationPress}
            onDelete={handleDeleteNotification}
            theme={theme}
        />
    ), [handleNotificationPress, handleDeleteNotification, theme]);

    if (loading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <CustomSpinner size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {notifications.length} Bildirim
                </Text>
                {notifications.length > 0 && (
                    <TouchableOpacity onPress={handleDeleteAll} style={styles.clearButton}>
                        <MaterialIcons name="delete-sweep" size={24} color={theme.colors.error} />
                        <Text style={[styles.clearText, { color: theme.colors.error }]}>Tümünü Sil</Text>
                    </TouchableOpacity>
                )}
            </View>
            <FlatList
                style={{ flex: 1 }}
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.list, { flexGrow: 1 }]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="notifications-none" size={64} color={theme.colors.subText} />
                        <Text style={[styles.emptyText, { color: theme.colors.subText }]}>Bildiriminiz yok.</Text>
                    </View>
                }
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={Platform.OS === 'android'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clearText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    list: {
        padding: 16,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
    },
});
