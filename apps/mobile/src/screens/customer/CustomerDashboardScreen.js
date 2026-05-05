import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import jobService from '../../services/job.service';
import StatCard from '../../components/StatCard';
import CustomSpinner from '../../components/CustomSpinner';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function CustomerDashboardScreen({ navigation }) {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { t } = useTranslation();

    const [stats, setStats] = useState({
        totalJobs: 0,
        pendingJobs: 0,
        inProgressJobs: 0,
        completedJobs: 0,
        completionRate: 0
    });
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await jobService.getCustomerJobs();
            
            if (response && response.stats) {
                setStats(response.stats);
            }
        } catch (error) {
            console.error('[CustomerDashboard] Error fetching jobs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadDashboardData();
        }, [loadDashboardData])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <CustomSpinner size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        tintColor={theme.colors.primary}
                        colors={[theme.colors.primary]}
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={[styles.greeting, { color: theme.colors.subText }]}>
                        {t('common.welcome')}
                    </Text>
                    <Text style={[styles.name, { color: theme.colors.text }]}>
                        {user?.name || t('customer.title')}
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <StatCard
                        title={t('jobs.total')}
                        value={stats.totalJobs.toString()}
                        icon="list-alt"
                        color={theme.colors.primary}
                    />
                    <StatCard
                        title={t('jobs.status.IN_PROGRESS')}
                        value={stats.inProgressJobs.toString()}
                        icon="sync"
                        color={theme.colors.warning}
                    />
                    <StatCard
                        title={t('jobs.status.COMPLETED')}
                        value={stats.completedJobs.toString()}
                        icon="check-circle"
                        color={theme.colors.success}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
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
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 16,
        marginBottom: 4,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
    }
});
