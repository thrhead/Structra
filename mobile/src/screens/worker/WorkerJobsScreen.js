import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl, ScrollView } from 'react-native';

export default function WorkerJobsScreen({ navigation }) {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    const statusFilters = [
        { key: 'ALL', label: 'Tümü' },
        { key: 'PENDING', label: 'Bekliyor' },
        { key: 'IN_PROGRESS', label: 'Devam Ediyor' },
        { key: 'COMPLETED', label: 'Tamamlandı' },
    ];

    useEffect(() => {
        loadJobs();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchQuery, selectedStatus, jobs]);

    const loadJobs = async () => {
        try {
            // MOCK DATA - Gerçek API yerine
            const mockJobs = [
                {
                    id: 1,
                    title: 'Klima Montajı - ABC Şirketi',
                    customer: 'ABC Şirketi',
                    location: 'İstanbul, Kadıköy',
                    status: 'IN_PROGRESS',
                    priority: 'HIGH',
                    scheduledDate: '2024-11-24',
                    steps: [
                        { id: 1, name: 'Ön Hazırlık', isCompleted: true },
                        { id: 2, name: 'Montaj', isCompleted: false },
                        { id: 3, name: 'Test', isCompleted: false },
                    ],
                },
                {
                    id: 2,
                    title: 'Silo Kurulumu - XYZ Ltd',
                    customer: 'XYZ Ltd',
                    location: 'Ankara, Çankaya',
                    status: 'PENDING',
                    priority: 'MEDIUM',
                    scheduledDate: '2024-11-25',
                    steps: [
                        { id: 4, name: 'Zemin Hazırlığı', isCompleted: false },
                        { id: 5, name: 'Kurulum', isCompleted: false },
                    ],
                },
                {
                    id: 3,
                    title: 'Bakım - DEF A.Ş.',
                    customer: 'DEF A.Ş.',
                    location: 'İzmir, Konak',
                    status: 'IN_PROGRESS',
                    priority: 'LOW',
                    scheduledDate: '2024-11-23',
                    steps: [
                        { id: 6, name: 'Kontrol', isCompleted: true },
                        { id: 7, name: 'Temizlik', isCompleted: true },
                        { id: 8, name: 'Rapor', isCompleted: false },
                    ],
                },
            ];

            // Simüle edilen gecikme
            setTimeout(() => {
                setJobs(mockJobs);
                setLoading(false);
                setRefreshing(false);
            }, 500);
        } catch (error) {
            console.error('Error loading jobs:', error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadJobs();
    };

    const filterJobs = () => {
        let filtered = jobs;

        // Status filter
        if (selectedStatus !== 'ALL') {
            filtered = filtered.filter(job => job.status === selectedStatus);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.customer.toLowerCase().includes(query) ||
                job.location.toLowerCase().includes(query)
            );
        }

        setFilteredJobs(filtered);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#F59E0B';
            case 'IN_PROGRESS': return '#3B82F6';
            case 'COMPLETED': return '#10B981';
            default: return '#6B7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return 'Bekliyor';
            case 'IN_PROGRESS': return 'Devam Ediyor';
            case 'COMPLETED': return 'Tamamlandı';
            default: return status;
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'HIGH': return 'Yüksek';
            case 'MEDIUM': return 'Orta';
            case 'LOW': return 'Düşük';
            default: return priority;
        }
    };

    const calculateProgress = (steps) => {
        const completed = steps.filter(s => s.isCompleted).length;
        return Math.round((completed / steps.length) * 100);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const renderJob = ({ item }) => (
        <TouchableOpacity
            style={styles.jobCard}
            onPress={() => navigation.navigate('JobDetail', { jobId: item.id })}
        >
            <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>

            <Text style={styles.customer}>📍 {item.location}</Text>
            <Text style={styles.date}>📅 {formatDate(item.scheduledDate)}</Text>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${calculateProgress(item.steps)}%` }]} />
                </View>
                <Text style={styles.progressText}>{calculateProgress(item.steps)}%</Text>
            </View>

            <Text style={styles.priority}>Öncelik: {getPriorityText(item.priority)}</Text>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>İş bulunamadı</Text>
            <Text style={styles.emptyText}>
                {searchQuery ? 'Arama kriterlerinize uygun iş bulunamadı.' : 'Henüz atanmış iş bulunmuyor.'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#16A34A" />
                <Text style={styles.loadingText}>İşler yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Atanan İşler</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="İş ara..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Status Filter Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
                    {statusFilters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[
                                styles.filterChip,
                                selectedStatus === filter.key && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedStatus(filter.key)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedStatus === filter.key && styles.filterChipTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredJobs}
                renderItem={renderJob}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#16A34A']}
                        tintColor="#16A34A"
                    />
                }
            />
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
    },
    loadingText: {
        marginTop: 10,
        color: '#6B7280',
    },
    headerContainer: {
        backgroundColor: '#fff',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 16,
        paddingBottom: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    clearIcon: {
        fontSize: 18,
        color: '#6B7280',
        padding: 4,
    },
    filtersContainer: {
        paddingHorizontal: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    filterChipActive: {
        backgroundColor: '#16A34A',
    },
    filterChipText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    listContainer: {
        padding: 16,
    },
    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    customer: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    date: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginRight: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#16A34A',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#16A34A',
        width: 40,
        textAlign: 'right',
    },
    priority: {
        fontSize: 12,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});
