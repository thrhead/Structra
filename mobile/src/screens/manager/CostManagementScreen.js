import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import costService from '../../services/cost.service';

export default function CostManagementScreen({ navigation }) {
    const [costs, setCosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filterStatus, setFilterStatus] = useState('PENDING'); // PENDING, APPROVED, REJECTED, ALL

    useEffect(() => {
        loadCosts();
    }, [filterStatus]);

    const loadCosts = async () => {
        try {
            setLoading(true);
            const status = filterStatus === 'ALL' ? undefined : filterStatus;
            const data = await costService.getAll({ status });
            setCosts(data);
        } catch (error) {
            console.error('Error loading costs:', error);
            Alert.alert('Hata', 'Masraflar yüklenemedi');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadCosts();
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            let rejectionReason = null;
            if (status === 'REJECTED') {
                // In a real app, we would show a prompt for rejection reason.
                // For now, we'll use a default or prompt (Alert.prompt is iOS only).
                // We'll just set a default reason for simplicity in this MVP.
                rejectionReason = "Yönetici tarafından reddedildi.";
            }

            await costService.updateStatus(id, status, rejectionReason);
            Alert.alert('Başarılı', `Masraf ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}.`);
            loadCosts();
        } catch (error) {
            console.error('Error updating cost status:', error);
            Alert.alert('Hata', 'İşlem gerçekleştirilemedi');
        }
    };

    const renderCostItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.category}>{item.category}</Text>
                    <Text style={styles.jobTitle}>{item.job?.title}</Text>
                    <Text style={styles.company}>{item.job?.customer?.company}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amount}>{item.amount} {item.currency}</Text>
                    <Text style={[
                        styles.statusBadge,
                        item.status === 'APPROVED' ? styles.statusApproved :
                            item.status === 'REJECTED' ? styles.statusRejected : styles.statusPending
                    ]}>
                        {item.status === 'APPROVED' ? 'ONAYLANDI' :
                            item.status === 'REJECTED' ? 'REDDEDİLDİ' : 'BEKLİYOR'}
                    </Text>
                </View>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.footer}>
                <Text style={styles.user}>Ekleyen: {item.createdBy?.name || item.createdBy?.email}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>

            {item.status === 'PENDING' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleUpdateStatus(item.id, 'REJECTED')}
                    >
                        <Text style={styles.actionButtonText}>Reddet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleUpdateStatus(item.id, 'APPROVED')}
                    >
                        <Text style={styles.actionButtonText}>Onayla</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
                    <TouchableOpacity
                        key={status}
                        style={[styles.filterTab, filterStatus === status && styles.activeFilterTab]}
                        onPress={() => setFilterStatus(status)}
                    >
                        <Text style={[styles.filterText, filterStatus === status && styles.activeFilterText]}>
                            {status === 'PENDING' ? 'Bekleyen' :
                                status === 'APPROVED' ? 'Onaylı' :
                                    status === 'REJECTED' ? 'Red' : 'Tümü'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#16A34A" />
                </View>
            ) : (
                <FlatList
                    data={costs}
                    renderItem={renderCostItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>Masraf kaydı bulunamadı.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 8,
        marginBottom: 8,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeFilterTab: {
        backgroundColor: '#DCFCE7',
    },
    filterText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeFilterText: {
        color: '#16A34A',
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    category: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#16A34A',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    company: {
        fontSize: 12,
        color: '#6B7280',
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    statusBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
    statusPending: { color: '#F59E0B' },
    statusApproved: { color: '#10B981' },
    statusRejected: { color: '#EF4444' },
    description: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 12,
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 8,
        marginBottom: 8,
    },
    user: {
        fontSize: 12,
        color: '#6B7280',
    },
    date: {
        fontSize: 12,
        color: '#6B7280',
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    rejectButton: {
        backgroundColor: '#FEE2E2',
    },
    approveButton: {
        backgroundColor: '#DCFCE7',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    emptyText: {
        color: '#6B7280',
        fontStyle: 'italic',
    },
});
