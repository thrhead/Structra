import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 16px padding on sides + 16px gap between columns

const JobGridItem = ({ job, onPress, style }) => {
    const { theme, isDark } = useTheme();

    const renderStatusBadge = () => {
        let bgColor = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)';
        let textColor = theme.colors.primary;
        let label = 'Bekliyor';

        if (job.status === 'IN_PROGRESS' || job.status === 'In Progress') {
            bgColor = isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)';
            textColor = '#22c55e';
            label = 'Devam Ediyor';
        } else if (job.status === 'COMPLETED' || job.status === 'Completed') {
            bgColor = isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.1)';
            textColor = isDark ? '#9ca3af' : '#6b7280';
            label = 'Tamamlandı';
        }

        return (
            <View style={[styles.badge, { backgroundColor: bgColor }]}>
                <Text style={[styles.badgeText, { color: textColor }]} numberOfLines={1}>{label}</Text>
            </View>
        );
    };

    return (
        <TouchableOpacity
            onPress={() => onPress(job)}
            activeOpacity={0.8}
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                },
                job.status === 'IN_PROGRESS' && { borderColor: theme.colors.primary + '60', borderWidth: 1.5 },
                style
            ]}
        >
            {/* Top Row: Badge & Priority */}
            <View style={styles.topRow}>
                {renderStatusBadge()}
                {job.priority === 'HIGH' && (
                    <View style={styles.priorityContainer}>
                        <MaterialIcons name="priority-high" size={12} color="#fff" />
                    </View>
                )}
            </View>

            {/* Content: ID, Title, Customer */}
            <View style={styles.content}>
                <Text style={[styles.jobId, { color: theme.colors.primary }]}>
                    #{job.jobNo || (job.id ? job.id.toString().slice(-4).toUpperCase() : '---')}
                </Text>
                <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
                    {job.title}
                </Text>
                
                {/* New: Customer Info */}
                <View style={styles.customerRow}>
                    <MaterialIcons name="business" size={14} color={theme.colors.secondary} />
                    <Text style={[styles.customerText, { color: theme.colors.text }]} numberOfLines={1}>
                        {job.customerName || job.customer?.company || 'Müşteri Belirtilmemiş'}
                    </Text>
                </View>
            </View>

            {/* Footer: Location & Progress Percentage */}
            <View style={styles.footer}>
                <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={14} color={theme.colors.subText} />
                    <Text style={[styles.infoText, { color: theme.colors.subText }]} numberOfLines={1}>
                        {job.location || 'Konum yok'}
                    </Text>
                </View>
                
                {/* Enhanced Progress with Percentage */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressLabel, { color: theme.colors.subText }]}>Tamamlanma</Text>
                        <Text style={[styles.percentageText, { color: theme.colors.primary }]}>%{job.progress || 0}</Text>
                    </View>
                    <View style={[styles.progressBg, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { 
                                    width: `${job.progress || 0}%`, 
                                    backgroundColor: job.status === 'COMPLETED' ? '#22c55e' : theme.colors.primary 
                                }
                            ]} 
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: COLUMN_WIDTH,
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        justifyContent: 'space-between',
        minHeight: 200, // Büyütüldü (Eskisi 155)
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        maxWidth: '85%',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    priorityContainer: {
        backgroundColor: '#ef4444',
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginBottom: 12,
    },
    jobId: {
        fontSize: 12,
        fontWeight: '900',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
        marginBottom: 6,
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    customerText: {
        fontSize: 12,
        fontWeight: '600',
        flex: 1,
    },
    footer: {
        marginTop: 'auto',
        gap: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 11,
        flex: 1,
        fontWeight: '500',
    },
    progressSection: {
        gap: 6,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressLabel: {
        fontSize: 10,
        fontWeight: '600',
    },
    percentageText: {
        fontSize: 11,
        fontWeight: '800',
    },
    progressBg: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
        width: '100%',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
});

export default JobGridItem;
