import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl, Modal, Alert } from 'react-native';

export default function JobAssignmentScreen({ navigation }) {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [workers, setWorkers] = useState([]);

    const statusFilters = [
        { key: 'ALL', label: 'Tümü' },
        { key: 'PENDING', label: 'Bekliyor' },
        { key: 'IN_PROGRESS', label: 'Devam Ediyor' },
        { key: 'COMPLETED', label: 'Tamamlandı' },
    ];

    useEffect(() => {
        loadJobs();
        loadWorkers();
    }, []);

    useEffect(() => {
        filterJobs();
    }, [searchQuery, selectedFilter, jobs]);

    const loadJobs = async () => {
        try {
            // MOCK DATA
            const mockJobs = [
                {
                    id: 1,
                    title: 'Klima Montajı',
                    customer: 'ABC Şirketi',
                    location: 'İstanbul, Kadıköy',
                    status: 'IN_PROGRESS',
                    assignedTo: 'Ali Yılmaz',
                    assignedWorkerId: 1,
                    priority: 'high',
                    scheduledDate: '2024-11-24',
                },
                {
                    id: 2,
                    title: 'Silo Kurulumu',
                    customer: 'XYZ Ltd',
                    location: 'Ankara, Çankaya',
                    status: 'PENDING',
                    assignedTo: null,
                    assignedWorkerId: null,
                    priority: 'medium',
                    scheduledDate: '2024-11-25',
                },
                {
                    id: 3,
                    title: 'Bakım',
                    customer: 'DEF A.Ş.',
                    location: 'İzmir, Konak',
                    status: 'IN_PROGRESS',
                    assignedTo: 'Mehmet Kaya',
                    assignedWorkerId: 2,
                    priority: 'low',
                    scheduledDate: '2024-11-23',
                },
                {
                    id: 4,
                    title: 'Yeni Sistem Kurulumu',
                    customer: 'GHI Ticaret',
                    location: 'Bursa, Nilüfer',
                    status: 'PENDING',
                    assignedTo: null,
                    assignedWorkerId: null,
                    priority: 'high',
                    scheduledDate: '2024-11-26',
                },
                {
                    id: 5,
                    title: 'Kontrol ve Test',
                    customer: 'JKL Sanayi',
                    location: 'Antalya, Muratpaşa',
                    status: 'COMPLETED',
                    assignedTo: 'Fatma Şahin',
                    assignedWorkerId: 4,
                    priority: 'medium',
                    scheduledDate: '2024-11-20',
                },
            ];

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

    const loadWorkers = async () => {
        // MOCK DATA - Same as TeamListScreen
        const mockWorkers = [
            { id: 1, name: 'Ali Yılmaz', status: 'active' },
            { id: 2, name: 'Mehmet Kaya', status: 'active' },
            { id: 3, name: 'Ayşe Demir', status: 'offline' },
            { id: 4, name: 'Fatma Şahin', status: 'active' },
        ];
        setWorkers(mockWorkers);
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadJobs();
    };

    const filterJobs = () => {
        let filtered = jobs;

        // Status filter
        if (selectedFilter !== 'ALL') {
            filtered = filtered.filter(job => job.status === selectedFilter);
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

    const handleAssignJob = (job) => {
        setSelectedJob(job);
        setAssignModalVisible(true);
    };

    const assignWorkerToJob = (workerId) => {
        const worker = workers.find(w => w.id === workerId);
        if (worker) {
            // Update job with new assignment
            const updatedJobs = jobs.map(job => {
                if (job.id === selectedJob.id) {
                    return {
                        ...job,
                        assignedTo: worker.name,
                        assignedWorkerId: workerId,
                        status: 'IN_PROGRESS',
                    };
                }
                return job;
            });
            setJobs(updatedJobs);
            setAssignModalVisible(false);
            Alert.alert('Başarılı', `İş "${selectedJob.title}" başarıyla ${worker.name}'e atandı.`);
        }
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#EF4444';
            case 'medium': return '#F59E0B';
            case 'low': return '#10B981';
            default: return '#6B7280';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'high': return 'Yüksek';
            case 'medium': return 'Orta';
            case 'low': return 'Düşük';
            default: return priority;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const renderJob = ({ item }) => (
        <View style={styles.jobCard}>
            <View style={styles.jobHeader}>
                <View style={styles.jobTitleRow}>
                    <Text style={styles.jobTitle}>{item.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                        <Text style={styles.priorityText}>⚡ {getPriorityText(item.priority)}</Text>
                    </View>
                </View>
                <Text style={styles.jobCustomer}>🏢 {item.customer}</Text>
                <Text style={styles.jobLocation}>📍 {item.location}</Text>
                <Text style={styles.jobDate}>📅 {formatDate(item.scheduledDate)}</Text>
            </View>

            <View style={styles.jobFooter}>
                <View style={styles.assignmentInfo}>
                    {item.assignedTo ? (
                        <>
                            <Text style={styles.assignedLabel}>Atanan:</Text>
                            <Text style={styles.assignedWorker}>{item.assignedTo}</Text>
                        </>
                    ) : (
                        <Text style={styles.unassignedText}>Atanmamış</Text>
                    )}
                </View>
                <View style={styles.jobActions}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                    </View>
                    {item.status !== 'COMPLETED' && (
                        <TouchableOpacity
                            style={styles.assignButton}
                            onPress={() => handleAssignJob(item)}
                        >
                            <Text style={styles.assignButtonText}>
                                {item.assignedTo ? 'Yeniden Ata' : 'Ata'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>İş bulunamadı</Text>
            <Text style={styles.emptyText}>
                {searchQuery ? 'Arama kriterlerinize uygun iş bulunamadı.' : 'Henüz iş eklenmemiş.'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#F59E0B" />
                <Text style={styles.loadingText}>İşler yükleniyor...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
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
                <View style={styles.filtersContainer}>
                    {statusFilters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            style={[
                                styles.filterChip,
                                selectedFilter === filter.key && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedFilter(filter.key)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedFilter === filter.key && styles.filterChipTextActive
                            ]}>
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
                        colors={['#F59E0B']}
                        tintColor="#F59E0B"
                    />
                }
            />

            {/* Worker Assignment Modal */}
            <Modal
                visible={assignModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAssignModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Worker Seç</Text>
                        <Text style={styles.modalSubtitle}>
                            {selectedJob?.title}
                        </Text>

                        <FlatList
                            data={workers.filter(w => w.status === 'active')}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.workerOption}
                                    onPress={() => assignWorkerToJob(item.id)}
                                >
                                    <Text style={styles.workerName}>{item.name}</Text>
                                    <Text style={styles.workerStatus}>✓ Aktif</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setAssignModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>İptal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
        marginTop: 16,
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
        flexDirection: 'row',
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
        backgroundColor: '#F59E0B',
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
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    jobHeader: {
        marginBottom: 12,
    },
    jobTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1,
        marginRight: 8,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    jobCustomer: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    jobLocation: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    jobDate: {
        fontSize: 14,
        color: '#6B7280',
    },
    jobFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    assignmentInfo: {
        flex: 1,
    },
    assignedLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    assignedWorker: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    unassignedText: {
        fontSize: 14,
        color: '#EF4444',
        fontWeight: '600',
    },
    jobActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    assignButton: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    assignButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 20,
    },
    workerOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        marginBottom: 8,
    },
    workerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    workerStatus: {
        fontSize: 14,
        color: '#16A34A',
    },
    cancelButton: {
        backgroundColor: '#E5E7EB',
        padding: 16,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
});
