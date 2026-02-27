import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import JobFilterModal from './JobFilterModal';

const JobSearchHeader = ({ 
    searchQuery, 
    setSearchQuery, 
    selectedFilter, 
    setSelectedFilter,
    dateFilter,
    setDateFilter,
    isAdmin,
    onAddNewJob,
    onUploadExcel,
    title = "Görevler" 
}) => {
    const { theme, isDark } = useTheme();
    const [showSearch, setShowSearch] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const toggleSearch = () => {
        const newState = !showSearch;
        setShowSearch(newState);
        if (!newState) {
            setSearchQuery('');
        }
    };

    const hasActiveFilters = selectedFilter !== 'Tümü' || dateFilter !== 'Tümü';

    const ActionButton = ({ icon, micon, label, onPress, color, badge, primary }) => (
        <TouchableOpacity
            style={styles.actionItem}
            onPress={onPress}
        >
            <View style={[
                styles.actionButton, 
                { backgroundColor: primary ? theme.colors.primary : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') }
            ]}>
                {icon ? (
                    <MaterialIcons name={icon} size={22} color={primary ? "#fff" : (color || theme.colors.primary)} />
                ) : (
                    <MaterialCommunityIcons name={micon} size={22} color={primary ? "#fff" : (color || theme.colors.primary)} />
                )}
                {badge && (
                    <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]} />
                )}
            </View>
            {!showSearch && <Text style={[styles.actionLabel, { color: theme.colors.subText }]}>{label}</Text>}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerLeft}>
                <MaterialIcons name="assignment" size={30} color={theme.colors.primary} />
            </View>
            
            {showSearch ? (
                <TextInput
                    style={[styles.searchInput, {
                        color: theme.colors.text,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }]}
                    placeholder="İş no, ID veya başlık ara..."
                    placeholderTextColor={theme.colors.subText}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                />
            ) : (
                <View style={styles.titleContainer}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{title}</Text>
                </View>
            )}

            <View style={styles.headerRight}>
                {isAdmin && !showSearch && (
                    <>
                        <ActionButton 
                            icon="add" 
                            label="Yeni İş" 
                            primary 
                            onPress={onAddNewJob} 
                        />
                        <ActionButton 
                            micon="file-excel-box" 
                            label="Excel" 
                            color="#107c10" 
                            onPress={onUploadExcel} 
                        />
                    </>
                )}

                <ActionButton 
                    icon={showSearch ? "close" : "search"} 
                    label="Ara" 
                    onPress={toggleSearch} 
                />

                <ActionButton 
                    icon="filter-list" 
                    label="Filtre" 
                    onPress={() => setFilterModalVisible(true)} 
                    badge={hasActiveFilters} 
                />
            </View>

            <JobFilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingTop: 12,
        paddingBottom: 8, 
        borderBottomWidth: 1 
    },
    headerLeft: { width: 32, alignItems: 'flex-start' },
    titleContainer: { flex: 1, marginLeft: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerRight: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
    searchInput: { flex: 1, fontSize: 16, paddingHorizontal: 12, height: 40, borderRadius: 8, marginHorizontal: 12 },
    actionItem: { alignItems: 'center', gap: 4 },
    actionButton: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    actionLabel: { fontSize: 10, fontWeight: '600' },
    filterBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#fff'
    }
});

export default JobSearchHeader;
