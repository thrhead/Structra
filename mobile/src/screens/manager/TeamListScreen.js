import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl } from 'react-native';

export default function TeamListScreen({ navigation }) {
    const [team, setTeam] = useState([]);
    const [filteredTeam, setFilteredTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('ALL');

    const statusFilters = [
        { key: 'ALL', label: 'Tümü' },
        { key: 'active', label: 'Aktif' },
        { key: 'offline', label: 'Çevrimdışı' },
    ];

    useEffect(() => {
        loadTeam();
    }, []);

    useEffect(() => {
        filterTeam();
    }, [searchQuery, selectedFilter, team]);

    const loadTeam = async () => {
        try {
            // MOCK DATA
            const mockTeam = [
                {
                    id: 1,
                    name: 'Ali Yılmaz',
                    email: 'worker1@montaj.com',
                    role: 'worker',
                    status: 'active',
                    activeJobs: 2,
                    completedJobs: 15,
                    completionRate: 94,
                    avatar: 'A',
                },
                {
                    id: 2,
                    name: 'Mehmet Kaya',
                    email: 'worker2@montaj.com',
                    role: 'worker',
                    status: 'active',
                    activeJobs: 1,
                    completedJobs: 22,
                    completionRate: 88,
                    avatar: 'M',
                },
                {
                    id: 3,
                    name: 'Ayşe Demir',
                    email: 'worker3@montaj.com',
                    role: 'worker',
                    status: 'offline',
                    activeJobs: 0,
                    completedJobs: 18,
                    completionRate: 91,
                    avatar: 'A',
                },
                {
                    id: 4,
                    name: 'Fatma Şahin',
                    email: 'worker4@montaj.com',
                    role: 'worker',
                    status: 'active',
                    activeJobs: 3,
                    completedJobs: 12,
                    completionRate: 85,
                    avatar: 'F',
                },
            ];

            setTimeout(() => {
                setTeam(mockTeam);
                setLoading(false);
                setRefreshing(false);
            }, 500);
        } catch (error) {
            console.error('Error loading team:', error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadTeam();
    };

    const filterTeam = () => {
        let filtered = team;

        // Status filter
        if (selectedFilter !== 'ALL') {
            filtered = filtered.filter(member => member.status === selectedFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(member =>
                member.name.toLowerCase().includes(query) ||
                member.email.toLowerCase().includes(query)
            );
        }

        setFilteredTeam(filtered);
    };

    const renderMember = ({ item }) => (
        <TouchableOpacity style={styles.memberCard}>
            <View style={styles.memberHeader}>
                <View style={[
                    styles.avatar,
                    { backgroundColor: item.status === 'active' ? '#3B82F6' : '#9CA3AF' }
                ]}>
                    <Text style={styles.avatarText}>{item.avatar}</Text>
                </View>
                <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                        <Text style={styles.memberName}>{item.name}</Text>
                        <View style={[
                            styles.statusBadge,
                            { backgroundColor: item.status === 'active' ? '#D1FAE5' : '#F3F4F6' }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                { color: item.status === 'active' ? '#059669' : '#6B7280' }
                            ]}>
                                {item.status === 'active' ? 'Aktif' : 'Çevrimdışı'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.memberEmail}>{item.email}</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{item.activeJobs}</Text>
                    <Text style={styles.statLabel}>Aktif İş</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{item.completedJobs}</Text>
                    <Text style={styles.statLabel}>Tamamlanan</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={[styles.statValue, { color: '#16A34A' }]}>{item.completionRate}%</Text>
                    <Text style={styles.statLabel}>Başarı Oranı</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>Ekip üyesi bulunamadı</Text>
            <Text style={styles.emptyText}>
                {searchQuery ? 'Arama kriterlerinize uygun ekip üyesi bulunamadı.' : 'Henüz ekip üyesi eklenmemiş.'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#F59E0B" />
                <Text style={styles.loadingText}>Ekip yükleniyor...</Text>
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
                        placeholder="Ekip üyesi ara..."
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
                data={filteredTeam}
                renderItem={renderMember}
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
    memberCard: {
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
    memberHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    memberInfo: {
        flex: 1,
    },
    memberNameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    memberEmail: {
        fontSize: 14,
        color: '#6B7280',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    statLabel: {
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
