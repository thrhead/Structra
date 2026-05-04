import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getStatusLabel } from '../utils/status-helper';

const JobGridItem = ({ job, onPress, style }) => {
    const { theme, isDark } = useTheme();
    const { t } = useTranslation();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    // KESİN ÖLÇÜLER:
    const numColumns = windowWidth > 600 ? 3 : 2;
    const totalPadding = 48; // (numColumns + 1) * 16
    const cardWidth = (windowWidth - totalPadding) / numColumns;
    
    const cardHeight = windowHeight * 0.22; 

    // Veri Eşleştirme
    const companyName = job.customer?.company || job.customerName || t('common.noData');
    const contactPerson = job.customer?.user?.name || job.contactPerson || t('common.noData');
    
    const teamLead = 
        job.assignments?.[0]?.team?.lead?.name || 
        job.assignments?.[0]?.worker?.name ||      
        job.teamLeadName ||                        
        job.assignee?.name ||                      
        t('common.unassigned');

    const renderStatusBadge = () => {
        let bgColor = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)';
        let textColor = theme.colors.primary;
        let label = getStatusLabel(job.status, t);

        if (job.status === 'IN_PROGRESS' || job.status === 'In Progress') {
            bgColor = isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)';
            textColor = '#22c55e';
        } else if (job.status === 'COMPLETED' || job.status === 'Completed') {
            bgColor = isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.1)';
            textColor = isDark ? '#9ca3af' : '#6b7280';
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
                    width: cardWidth,
                    height: cardHeight,
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                },
                job.status === 'IN_PROGRESS' && { borderColor: theme.colors.primary + '80', borderWidth: 1.5 },
                style
            ]}
        >
            <View style={styles.topRow}>
                <Text style={[styles.jobId, { color: theme.colors.primary }]}>#{job.jobNo || '---'}</Text>
                {renderStatusBadge()}
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
                    {job.title}
                </Text>
                <View style={styles.detailItem}>
                    <MaterialIcons name="business" size={12} color={theme.colors.secondary} />
                    <Text style={[styles.companyText, { color: theme.colors.text }]} numberOfLines={1}>
                        {companyName}
                    </Text>
                </View>
                <View style={styles.detailItem}>
                    <MaterialIcons name="person" size={12} color={theme.colors.subText} />
                    <Text style={[styles.subDetailText, { color: theme.colors.subText }]} numberOfLines={1}>
                        {contactPerson}
                    </Text>
                </View>
            </View>

            <View style={styles.middleInfo}>
                <View style={styles.infoIconRow}>
                    <MaterialIcons name="groups" size={13} color={theme.colors.primary} />
                    <Text style={[styles.infoText, { color: theme.colors.text, fontWeight: '700' }]} numberOfLines={1}>
                        {teamLead}
                    </Text>
                </View>
                <View style={styles.infoIconRow}>
                    <MaterialIcons name="location-on" size={12} color={theme.colors.subText} />
                    <Text style={[styles.infoText, { color: theme.colors.subText }]} numberOfLines={1}>
                        {job.location || t('common.noData')}
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.progressHeader}>
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 9,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    jobId: {
        fontSize: 10,
        fontWeight: '900',
    },
    content: {
        gap: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 2,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    companyText: {
        fontSize: 11,
        fontWeight: '700',
    },
    subDetailText: {
        fontSize: 10,
        fontWeight: '500',
    },
    middleInfo: {
        marginVertical: 4,
        gap: 2,
        paddingTop: 4,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(156, 163, 175, 0.1)',
    },
    infoIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    infoText: {
        fontSize: 10,
        flex: 1,
    },
    footer: {
        marginTop: 4,
    },
    progressHeader: {
        alignItems: 'flex-end',
        marginBottom: 2,
    },
    percentageText: {
        fontSize: 10,
        fontWeight: '900',
    },
    progressBg: {
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
        width: '100%',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
});

export default JobGridItem;
