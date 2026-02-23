import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView, FlatList, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/theme';
import jobService from '../../services/job.service';
import templateService from '../../services/template.service';
import customerService from '../../services/customer.service';
import teamService from '../../services/team.service';

export default function CreateJobModal({ visible, onClose, onSuccess }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        customerId: '',
        customerName: '',
        teamId: null,
        teamName: '',
        priority: 'MEDIUM',
        scheduledDate: new Date(),
        scheduledEndDate: new Date(),
        location: '',
        templateId: null,
        templateName: '',
        steps: []
    });

    const [templates, setTemplates] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [teams, setTeams] = useState([]);

    // Selection Modal State
    const [selectionModalVisible, setSelectionModalVisible] = useState(false);
    const [selectionItems, setSelectionItems] = useState([]);
    const [selectionTitle, setSelectionTitle] = useState('');
    const [selectionTarget, setSelectionTarget] = useState('');

    // Date Picker State
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dateTarget, setDateTarget] = useState('start');

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setValidationError(null);
            setLoading(false);
        }
    }, [visible]);

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            customerId: '',
            customerName: '',
            teamId: null,
            teamName: '',
            priority: 'MEDIUM',
            scheduledDate: new Date(),
            scheduledEndDate: new Date(),
            location: '',
            templateId: null,
            templateName: '',
            steps: []
        });
        setLoading(false);
        setValidationError(null);
    };

    const handleCreateJob = async () => {
        setValidationError(null);
        
        if (!formData.title || formData.title.trim() === '') {
            setValidationError("Lütfen iş başlığı giriniz.");
            return;
        }
        if (!formData.customerId) {
            setValidationError("Lütfen bir müşteri seçiniz.");
            return;
        }

        setLoading(true);
        try {
            await jobService.create(formData);
            resetForm();
            onSuccess();
        } catch (error) {
            console.error('Create job error:', error);
            const msg = error.response?.data?.error || "İş oluşturulurken bir hata oluştu.";
            setValidationError(msg);
        } finally {
            setLoading(false);
        }
    };

    const openSelection = async (target) => {
        if (loading) return;
        setSelectionTarget(target);
        setSelectionModalVisible(true);

        if (target === 'customer') {
            setSelectionTitle(t('jobs.selectCustomer'));
            if (customers.length === 0) {
                try {
                    const custData = await customerService.getAll();
                    if (Array.isArray(custData)) setCustomers(custData);
                    setSelectionItems(custData.map(c => ({
                        id: c.id,
                        label: c.company || c.companyName,
                        sub: c.user?.name || c.contactPerson
                    })));
                } catch (e) { setValidationError("Müşteriler yüklenemedi."); }
            } else {
                setSelectionItems(customers.map(c => ({
                    id: c.id,
                    label: c.company || c.companyName,
                    sub: c.user?.name || c.contactPerson
                })));
            }

        } else if (target === 'team') {
            setSelectionTitle(t('jobs.selectTeam'));
            if (teams.length === 0) {
                try {
                    const teamData = await teamService.getAll();
                    if (Array.isArray(teamData)) setTeams(teamData);
                    const options = [{ id: null, label: t('jobs.noAssignment') }, ...teamData.map(t => ({ id: t.id, label: t.name }))];
                    setSelectionItems(options);
                } catch (e) { setValidationError("Ekipler yüklenemedi."); }
            } else {
                const options = [{ id: null, label: t('jobs.noAssignment') }, ...teams.map(t => ({ id: t.id, label: t.name }))];
                setSelectionItems(options);
            }

        } else if (target === 'priority') {
            setSelectionTitle(t('jobs.selectPriority'));
            setSelectionItems([
                { id: 'LOW', label: t('jobs.low') },
                { id: 'MEDIUM', label: t('jobs.medium') },
                { id: 'HIGH', label: t('jobs.high') },
                { id: 'URGENT', label: t('jobs.urgent') }
            ]);
        } else if (target === 'template') {
            setSelectionTitle(t('jobs.selectTemplate'));
            if (templates.length === 0) {
                try {
                    const tmplData = await templateService.getAll();
                    if (Array.isArray(tmplData)) setTemplates(tmplData);
                    setSelectionItems(tmplData.map(t => ({ id: t.id, label: t.name, sub: t.description })));
                } catch (e) { console.error(e); }
            } else {
                setSelectionItems(templates.map(t => ({ id: t.id, label: t.name, sub: t.description })));
            }
        }
    };

    const handleSelect = (item) => {
        if (selectionTarget === 'customer') {
            setFormData(prev => ({ ...prev, customerId: item.id, customerName: item.label }));
        } else if (selectionTarget === 'team') {
            setFormData(prev => ({ ...prev, teamId: item.id, teamName: item.label }));
        } else if (selectionTarget === 'priority') {
            setFormData(prev => ({ ...prev, priority: item.id }));
        } else if (selectionTarget === 'template') {
            const template = templates.find(t => t.id === item.id);
            if (template) {
                const steps = template.steps.map(s => ({
                    title: s.title,
                    description: s.description,
                    subSteps: s.subSteps?.map(sub => ({ title: sub.title })) || []
                }));
                setFormData(prev => ({
                    ...prev,
                    templateId: item.id,
                    templateName: item.label,
                    steps: steps
                }));
            }
        }
        setSelectionModalVisible(false);
        setValidationError(null);
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            if (dateTarget === 'start') {
                setFormData(prev => ({ ...prev, scheduledDate: selectedDate }));
            } else {
                setFormData(prev => ({ ...prev, scheduledEndDate: selectedDate }));
            }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t('jobs.createTitle')}</Text>
                    
                    {validationError && (
                        <View style={styles.errorContainer}>
                            <MaterialIcons name="error" size={20} color="#ff4444" />
                            <Text style={styles.errorText}>{validationError}</Text>
                        </View>
                    )}

                    <ScrollView style={{ maxHeight: 500 }}>
                        <Text style={styles.label}>{t('jobs.template')} {t('jobs.optional')}</Text>
                        <TouchableOpacity 
                            style={[styles.selectorButton, loading && { opacity: 0.5 }]} 
                            onPress={() => openSelection('template')}
                            disabled={loading}
                        >
                            <Text style={styles.selectorButtonText}>{formData.templateName || t('jobs.selectTemplate')}</Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#aaa" />
                        </TouchableOpacity>

                        <Text style={styles.label}>{t('jobs.jobTitle')} *</Text>
                        <TextInput
                            style={[styles.input, loading && { opacity: 0.5 }, validationError && !formData.title && { borderColor: '#ff4444' }]}
                            value={formData.title}
                            onChangeText={(text) => {
                                setFormData(prev => ({ ...prev, title: text }));
                                setValidationError(null);
                            }}
                            placeholder={t('jobs.titlePlaceholder')}
                            placeholderTextColor="#666"
                            editable={!loading}
                        />

                        <Text style={styles.label}>{t('jobs.customer')} *</Text>
                        <TouchableOpacity 
                            style={[styles.selectorButton, loading && { opacity: 0.5 }, validationError && !formData.customerId && { borderColor: '#ff4444' }]} 
                            onPress={() => openSelection('customer')}
                            disabled={loading}
                        >
                            <Text style={styles.selectorButtonText}>{formData.customerName || t('jobs.selectCustomer')}</Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#aaa" />
                        </TouchableOpacity>

                        <Text style={styles.label}>{t('jobs.assignTeam')} {t('jobs.optional')}</Text>
                        <TouchableOpacity 
                            style={[styles.selectorButton, loading && { opacity: 0.5 }]} 
                            onPress={() => openSelection('team')}
                            disabled={loading}
                        >
                            <Text style={styles.selectorButtonText}>{formData.teamName || t('jobs.selectTeam')}</Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#aaa" />
                        </TouchableOpacity>

                        <Text style={styles.label}>{t('jobs.priority')}</Text>
                        <TouchableOpacity 
                            style={[styles.selectorButton, loading && { opacity: 0.5 }]} 
                            onPress={() => openSelection('priority')}
                            disabled={loading}
                        >
                            <Text style={styles.selectorButtonText}>
                                {formData.priority === 'LOW' ? t('jobs.low') :
                                    formData.priority === 'MEDIUM' ? t('jobs.medium') :
                                        formData.priority === 'HIGH' ? t('jobs.high') : t('jobs.urgent')}
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#aaa" />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('jobs.start')}</Text>
                                <TouchableOpacity 
                                    style={[styles.selectorButton, loading && { opacity: 0.5 }]} 
                                    onPress={() => { setDateTarget('start'); setShowDatePicker(true); }}
                                    disabled={loading}
                                >
                                    <Text style={styles.selectorButtonText}>{formData.scheduledDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>{t('jobs.end')}</Text>
                                <TouchableOpacity 
                                    style={[styles.selectorButton, loading && { opacity: 0.5 }]} 
                                    onPress={() => { setDateTarget('end'); setShowDatePicker(true); }}
                                    disabled={loading}
                                >
                                    <Text style={styles.selectorButtonText}>{formData.scheduledEndDate.toLocaleDateString()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.label}>{t('jobs.location')}</Text>
                        <TextInput
                            style={[styles.input, loading && { opacity: 0.5 }]}
                            value={formData.location}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                            placeholder={t('jobs.addressPlaceholder')}
                            placeholderTextColor="#666"
                            editable={!loading}
                        />

                        <Text style={styles.label}>{t('jobs.description')}</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }, loading && { opacity: 0.5 }]}
                            value={formData.description}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                            placeholder={t('jobs.descriptionPlaceholder')}
                            placeholderTextColor="#666"
                            multiline
                            editable={!loading}
                        />
                    </ScrollView>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={() => { onClose(); resetForm(); }}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.saveButton, loading && { opacity: 0.7 }]} 
                            onPress={handleCreateJob}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.saveButtonText}>{t('jobs.create')}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Internal Selection Modal */}
                <Modal
                    visible={selectionModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectionModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 10 }}>
                                <Text style={styles.modalTitle}>{selectionTitle}</Text>
                                <TouchableOpacity onPress={() => setSelectionModalVisible(false)}>
                                    <MaterialIcons name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={selectionItems}
                                keyExtractor={item => item.id?.toString() || Math.random().toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.selectionItem} onPress={() => handleSelect(item)}>
                                        <Text style={styles.selectionItemText}>{item.label}</Text>
                                        {item.sub && <Text style={styles.selectionItemSub}>{item.sub}</Text>}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                {showDatePicker && (
                    <DateTimePicker
                        value={dateTarget === 'start' ? formData.scheduledDate : formData.scheduledEndDate}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#333' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 20, textAlign: 'center' },
    errorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 68, 68, 0.1)', padding: 12, borderRadius: 8, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: '#ff4444' },
    errorText: { color: '#ff4444', marginLeft: 10, fontSize: 14, fontWeight: '700' },
    label: { color: '#e2e8f0', marginBottom: 6, fontWeight: '600', fontSize: 14, marginTop: 10 },
    input: { backgroundColor: '#2d3748', borderRadius: 8, padding: 12, color: '#ffffff', borderWidth: 1, borderColor: '#4b5563' },
    selectorButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2d3748', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#4b5563' },
    selectorButtonText: { color: '#ffffff' },
    modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
    cancelButton: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#334155', alignItems: 'center' },
    saveButton: { flex: 1, padding: 14, borderRadius: 8, backgroundColor: '#CCFF04', alignItems: 'center' },
    cancelButtonText: { color: '#e2e8f0', fontWeight: '600' },
    saveButtonText: { color: '#000000', fontWeight: 'bold' },
    selectionItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
    selectionItemText: { color: '#fff', fontSize: 16 },
    selectionItemSub: { color: '#888', fontSize: 12, marginTop: 4 }
});
