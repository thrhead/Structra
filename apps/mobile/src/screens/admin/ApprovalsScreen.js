import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApprovals } from '../../hooks/useApprovals';
import EnhancedApprovalCard from '../../components/admin/EnhancedApprovalCard';
import { useTheme } from '../../context/ThemeContext';
import CustomSpinner from '../../components/CustomSpinner';

export default function ApprovalsScreen({ navigation }) {
    const { theme } = useTheme();
    const {
        filteredApprovals,
        filter,
        setFilter,
        loading,
        refreshing,
        onRefresh,
        handleApprove,
        handleReject
    } = useApprovals();

    const renderItem = React.useCallback(({ item }) => (
        <EnhancedApprovalCard
            item={item}
            onApprove={handleApprove}
            onReject={handleReject}
            theme={theme}
        />
    ), [handleApprove, handleReject, theme]);

    if (loading && !refreshing) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <CustomSpinner size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.filterContainer}>
                {[
                    { id: 'ALL', label: 'Tümü' },
                    { id: 'JOB', label: 'İşler' },
                    { id: 'STEP', label: 'Adımlar' },
                    { id: 'COST', label: 'Masraflar' }
                ].map(f => (
                    <TouchableOpacity
                        key={f.id}
                        style={[
                            styles.filterButton,
                            {
                                backgroundColor: filter === f.id ? theme.colors.primary : theme.colors.card,
                                borderColor: filter === f.id ? theme.colors.primary : theme.colors.cardBorder
                            }
                        ]}
                        onPress={() => setFilter(f.id)}
                    >
                        <Text style={[
                            styles.filterText,
                            {
                                color: filter === f.id ? '#fff' : theme.colors.subText,
                                fontWeight: filter === f.id ? 'bold' : '500'
                            }
                        ]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                style={{ flex: 1 }}
                data={filteredApprovals}
                renderItem={renderItem}
                keyExtractor={item => `${item.type}-${item.id}`}
                contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="check-circle" size={64} color={theme.colors.subText} />
                        <Text style={[styles.emptyText, { color: theme.colors.subText }]}>Bekleyen onay bulunmuyor</Text>
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
    filterContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
        flexWrap: 'wrap'
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
    },
    filterText: {
        fontSize: 12,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
    },
});
