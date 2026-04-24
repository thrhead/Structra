import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const JobFilterModal = ({ 
    visible, 
    onClose, 
    selectedFilter, 
    setSelectedFilter, 
    dateFilter, 
    setDateFilter 
}) => {
    const { theme, isDark } = useTheme();

    const statusOptions = ['Tümü', 'Bekleyen', 'Devam Eden', 'Onay Bekleyen', 'Tamamlanan'];
    const dateOptions = ['Tümü', 'Bugün', 'Yarın', 'Bu Hafta'];

    const FilterSection = ({ title, options, current, onChange }) => (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.subText }]}>{title}</Text>
            <View style={styles.optionsGrid}>
                {options.map((opt) => (
                    <TouchableOpacity
                        key={opt}
                        style={[
                            styles.optionButton,
                            { 
                                backgroundColor: current === opt 
                                    ? theme.colors.primary 
                                    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                borderColor: current === opt ? theme.colors.primary : theme.colors.border
                            }
                        ]}
                        onPress={() => onChange(opt)}
                    >
                        <Text style={[
                            styles.optionText,
                            { color: current === opt ? '#fff' : theme.colors.text }
                        ]}>
                            {opt}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.overlay} 
                activeOpacity={1} 
                onPress={onClose}
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    style={[styles.modalContent, { backgroundColor: theme.colors.background }]}
                >
                    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Filtrele</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.body}>
                        <FilterSection 
                            title="İş Durumu" 
                            options={statusOptions} 
                            current={selectedFilter} 
                            onChange={setSelectedFilter} 
                        />
                        <FilterSection 
                            title="Zaman" 
                            options={dateOptions} 
                            current={dateFilter} 
                            onChange={setDateFilter} 
                        />
                    </ScrollView>

                    <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
                        <TouchableOpacity 
                            style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
                            onPress={onClose}
                        >
                            <Text style={styles.applyButtonText}>Filtreleri Uygula</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 4,
    },
    body: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    applyButton: {
        height: 54,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default JobFilterModal;
