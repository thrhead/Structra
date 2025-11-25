import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl, Modal, Alert, ScrollView } from 'react-native';

export default function CustomerManagementScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {
        filterCustomers();
    }, [searchQuery, customers]);

    const loadCustomers = async () => {
        try {
            // MOCK DATA
            const mockCustomers = [
                {
                    id: 1,
                    companyName: 'ABC Şirketi',
                    contactPerson: 'Ahmet Yılmaz',
                    email: 'ahmet@abc.com',
                    phone: '+90 555 123 4567',
                    address: 'İstanbul, Kadıköy',
                    activeJobs: 3,
                },
                {
                    id: 2,
                    companyName: 'XYZ Ltd',
                    contactPerson: 'Mehmet Kaya',
                    email: 'mehmet@xyz.com',
                    phone: '+90 555 234 5678',
                    address: 'Ankara, Çankaya',
                    activeJobs: 1,
                },
                {
                    id: 3,
                    companyName: 'DEF A.Ş.',
                    contactPerson: 'Ayşe Demir',
                    email: 'ayse@def.com',
                    phone: '+90 555 345 6789',
                    address: 'İzmir, Konak',
                    activeJobs: 2,
                },
                {
                    id: 4,
                    companyName: 'GHI Ticaret',
                    contactPerson: 'Fatma Şahin',
                    email: 'fatma@ghi.com',
                    phone: '+90 555 456 7890',
                    address: 'Bursa, Nilüfer',
                    activeJobs: 0,
                },
            ];

            setTimeout(() => {
                setCustomers(mockCustomers);
                setLoading(false);
                setRefreshing(false);
            }, 500);
        } catch (error) {
            console.error('Error loading customers:', error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadCustomers();
    };

    const filterCustomers = () => {
        let filtered = customers;

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(customer =>
                customer.companyName.toLowerCase().includes(query) ||
                customer.contactPerson.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query)
            );
        }

        setFilteredCustomers(filtered);
    };

    const handleAddCustomer = () => {
        setEditingCustomer(null);
        setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
        });
        setModalVisible(true);
    };

    const handleEditCustomer = (customer) => {
        setEditingCustomer(customer);
        setFormData({
            companyName: customer.companyName,
            contactPerson: customer.contactPerson,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
        });
        setModalVisible(true);
    };

    const handleDeleteCustomer = (customer) => {
        Alert.alert(
            'Müşteriyi Sil',
            `${customer.companyName} müşterisini silmek istediğinize emin misiniz?`,
            [
                { text: 'İptal', style: 'cancel' },
                {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => {
                        const updatedCustomers = customers.filter(c => c.id !== customer.id);
                        setCustomers(updatedCustomers);
                        Alert.alert('Başarılı', 'Müşteri silindi.');
                    }
                }
            ]
        );
    };

    const handleSaveCustomer = () => {
        if (!formData.companyName || !formData.contactPerson || !formData.email) {
            Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun.');
            return;
        }

        if (!formData.email.includes('@')) {
            Alert.alert('Hata', 'Geçerli bir email adresi girin.');
            return;
        }

        if (editingCustomer) {
            // Update existing customer
            const updatedCustomers = customers.map(c =>
                c.id === editingCustomer.id
                    ? {
                        ...c,
                        companyName: formData.companyName,
                        contactPerson: formData.contactPerson,
                        email: formData.email,
                        phone: formData.phone,
                        address: formData.address,
                    }
                    : c
            );
            setCustomers(updatedCustomers);
            Alert.alert('Başarılı', 'Müşteri güncellendi.');
        } else {
            // Add new customer
            const newCustomer = {
                id: Math.max(...customers.map(c => c.id)) + 1,
                companyName: formData.companyName,
                contactPerson: formData.contactPerson,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                activeJobs: 0,
            };
            setCustomers([...customers, newCustomer]);
            Alert.alert('Başarılı', 'Yeni müşteri eklendi.');
        }

        setModalVisible(false);
        setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            address: '',
        });
    };

    const renderCustomer = ({ item }) => (
        <View style={styles.customerCard}>
            <View style={styles.customerHeader}>
                <View style={styles.companyIcon}>
                    <Text style={styles.companyIconText}>🏢</Text>
                </View>
                <View style={styles.customerInfo}>
                    <Text style={styles.companyName}>{item.companyName}</Text>
                    <Text style={styles.contactPerson}>👤 {item.contactPerson}</Text>
                    <Text style={styles.contactEmail}>✉️ {item.email}</Text>
                    {item.phone && <Text style={styles.contactPhone}>📞 {item.phone}</Text>}
                    {item.address && <Text style={styles.contactAddress}>📍 {item.address}</Text>}
                </View>
            </View>

            <View style={styles.customerStats}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{item.activeJobs}</Text>
                    <Text style={styles.statLabel}>Aktif İş</Text>
                </View>
            </View>

            <View style={styles.customerActions}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditCustomer(item)}
                >
                    <Text style={styles.editButtonText}>✏️ Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCustomer(item)}
                >
                    <Text style={styles.deleteButtonText}>🗑️ Sil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏢</Text>
            <Text style={styles.emptyTitle}>Müşteri bulunamadı</Text>
            <Text style={styles.emptyText}>
                {searchQuery ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz müşteri eklenmemiş.'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#EF4444" />
                <Text style={styles.loadingText}>Müşteriler yükleniyor...</Text>
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
                        placeholder="Müşteri ara..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={filteredCustomers}
                renderItem={renderCustomer}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#EF4444']}
                        tintColor="#EF4444"
                    />
                }
            />

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.fab} onPress={handleAddCustomer}>
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>

            {/* Add/Edit Customer Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>
                                {editingCustomer ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}
                            </Text>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Şirket Adı *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="ABC Şirketi"
                                    value={formData.companyName}
                                    onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>İletişim Kişisi *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ahmet Yılmaz"
                                    value={formData.contactPerson}
                                    onChangeText={(text) => setFormData({ ...formData, contactPerson: text })}
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Email *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="info@sirket.com"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Telefon</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+90 555 123 4567"
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Adres</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="İstanbul, Kadıköy"
                                    value={formData.address}
                                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>İptal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handleSaveCustomer}
                                >
                                    <Text style={styles.saveButtonText}>
                                        {editingCustomer ? 'Güncelle' : 'Ekle'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    listContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    customerCard: {
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
    customerHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    companyIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    companyIconText: {
        fontSize: 24,
    },
    customerInfo: {
        flex: 1,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    contactPerson: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
    },
    contactEmail: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 2,
    },
    contactPhone: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 2,
    },
    contactAddress: {
        fontSize: 13,
        color: '#6B7280',
    },
    customerStats: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 12,
        marginBottom: 12,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3B82F6',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    customerActions: {
        flexDirection: 'row',
    },
    editButton: {
        flex: 1,
        backgroundColor: '#3B82F6',
        padding: 10,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
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
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '300',
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
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 20,
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#111827',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        padding: 16,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
