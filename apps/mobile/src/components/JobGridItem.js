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
                job.status === 'IN_PROGRESS' && { borderColor: theme.colors.primary + '40' },
                style
            ]}
        >
            {/* Status & Priority Row */}
            <View style={styles.topRow}>
                {renderStatusBadge()}
                {job.priority === 'HIGH' && (
                    <MaterialIcons name="priority-high" size={14} color="#ef4444" />
                )}
            </View>

            {/* Job ID & Title */}
            <View style={styles.content}>
                <Text style={[styles.jobId, { color: theme.colors.primary }]}>
                    #{job.jobNo || (job.id ? job.id.toString().slice(-4).toUpperCase() : '---')}
                </Text>
                <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
                    {job.title}
                </Text>
            </View>

            {/* Info Footer */}
            <View style={styles.footer}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="location-on" size={14} color={theme.colors.subText} />
                    <Text style={[styles.infoText, { color: theme.colors.subText }]} numberOfLines={1}>
                        {job.location || 'Konum yok'}
                    </Text>
                </View>
                
                {/* Progress Bar (Minimalist) */}
                <View style={styles.progressContainer}>
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
        borderRadius: 20,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        justifyContent: 'space-between',
        minHeight: 155,
        // Shadow for light mode
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        maxWidth: '85%',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        marginBottom: 8,
    },
    jobId: {
        fontSize: 11,
        fontWeight: '800',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 18,
    },
    footer: {
        marginTop: 'auto',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 11,
        flex: 1,
    },
    progressContainer: {
        height: 4,
        width: '100%',
    },
    progressBg: {
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
});

export default JobGridItem;
