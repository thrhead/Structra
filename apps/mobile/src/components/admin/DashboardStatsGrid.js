import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StatCard from '../StatCard';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const DashboardStatsGrid = ({ statsData }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const generalStats = [
        {
            title: t('admin.stats.totalJobs'),
            value: (statsData?.totalJobs || 0).toString(),
            icon: 'work',
            color: theme.colors.primary,
        },
        {
            title: t('admin.stats.activeTeams'),
            value: (statsData?.activeTeams || 0).toString(),
            icon: 'groups',
            color: '#3b82f6',
        }
    ];

    const costStats = [
        {
            title: t('admin.stats.todayCost') || 'Bugün Harcanan',
            value: `₺${(statsData?.totalCostToday || 0).toLocaleString('tr-TR')}`,
            icon: 'account-balance-wallet',
            color: '#22c55e',
        },
        {
            title: t('admin.stats.pendingCost') || 'Bekleyen',
            value: `₺${(statsData?.totalPendingCost || 0).toLocaleString('tr-TR')}`,
            icon: 'pause-circle-filled',
            color: '#f59e0b',
        },
        {
            title: t('admin.stats.approvedCost') || 'Onaylanan',
            value: `₺${(statsData?.totalApprovedCost || 0).toLocaleString('tr-TR')}`,
            icon: 'check-circle',
            color: '#10b981',
        }
    ];

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLine} />
                <Text style={[styles.sectionTitle, { color: '#FACC15' }]}>SYSTEM_METRICS.raw</Text>
            </View>
            <View style={styles.statsGrid}>
                {generalStats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        label={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        iconColor={stat.color}
                        style={styles.statCard}
                    />
                ))}
            </View>

            <View style={[styles.sectionHeader, { marginTop: 12 }]}>
                <View style={styles.sectionHeaderLine} />
                <Text style={[styles.sectionTitle, { color: '#FACC15' }]}>COST_ANALYSIS.exec</Text>
            </View>
            <View style={styles.statsGrid}>
                {costStats.map((stat, idx) => (
                    <StatCard
                        key={stat.title}
                        label={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        iconColor={stat.color}
                        style={[styles.statCard, idx === 0 && { width: '100%' }]}
                    />
                ))}
            </View>

            {/* Budget Progress Bar */}
            <View style={[styles.budgetContainer, { borderColor: theme.colors.cardBorder, backgroundColor: theme.colors.card }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: theme.colors.subText, fontSize: 12, fontWeight: '600' }}>GÜNLÜK BÜTÇE KULLANIMI</Text>
                    <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: 'bold' }}>%{statsData?.budgetPercentage || 0}</Text>
                </View>
                <View style={[styles.progressBg, { backgroundColor: theme.colors.cardBorder }]}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${statsData?.budgetPercentage || 0}%`,
                                backgroundColor: theme.colors.primary
                            }
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        padding: 16,
        paddingTop: 4,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionHeaderLine: {
        width: 4,
        height: 14,
        backgroundColor: '#FACC15',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    statCard: {
        width: '47%',
        marginBottom: 0,
    },
    budgetContainer: {
        marginTop: 16,
        padding: 16,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(250, 204, 21, 0.2)',
        backgroundColor: '#1E293B',
    },
    progressBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default DashboardStatsGrid;
