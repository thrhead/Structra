import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import JobFilterModal from './JobFilterModal';

const JobSearchHeader = ({ 
    searchQuery, 
    setSearchQuery, 
    selectedFilter, 
    setSelectedFilter,
    dateFilter,
    setDateFilter,
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
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{title}</Text>
            )}

            <View style={styles.headerRight}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={toggleSearch}
                >
                    <MaterialIcons name={showSearch ? "close" : "search"} size={24} color={theme.colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <MaterialIcons name="filter-list" size={24} color={theme.colors.primary} />
                    {hasActiveFilters && (
                        <View style={[styles.filterBadge, { backgroundColor: theme.colors.primary }]} />
                    )}
                </TouchableOpacity>
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
        padding: 16, 
        paddingBottom: 8, 
        borderBottomWidth: 1 
    },
    headerLeft: { width: 40, alignItems: 'flex-start' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    headerRight: { flexDirection: 'row', gap: 4 },
    searchInput: { flex: 1, fontSize: 16, paddingHorizontal: 12, height: 40, borderRadius: 8, marginHorizontal: 12 },
    actionButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    filterBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#fff'
    }
});

export default JobSearchHeader;
