import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions, Platform, FlatList } from 'react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { BarChart3, TrendingUp, DollarSign, Briefcase, Users, CheckCircle2, Calendar, ArrowRight, FileIcon, ShieldCheck, Zap, Award, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { API_URL } from '../../config';
import GlassCard from '../../components/ui/GlassCard';

import CustomSpinner from '../../components/CustomSpinner';
const { width } = Dimensions.get('window');

const ReportsScreen = () => {
    const { theme, isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [strategicData, setStrategicData] = useState(null);
    const [tacticalData, setTacticalData] = useState(null);
    const [operationalData, setOperationalData] = useState(null);
    const [exportsData, setExportsData] = useState([]);
    const [activeTab, setActiveTab] = useState('strategic'); // 'strategic', 'tactical', 'operational', 'exports'
    const [selectedTemplate, setSelectedTemplate] = useState('strategic');
    const [selectedDay, setSelectedDay] = useState(null);

    const templates = [
        { id: 'strategic', title: 'Stratejik', icon: BarChart3, tab: 'strategic' },
        { id: 'tactical', title: 'Taktiksel', icon: TrendingUp, tab: 'tactical' },
        { id: 'operational', title: 'Operasyonel', icon: Zap, tab: 'operational' },
    ];

    useEffect(() => {
        let isMounted = true;
        fetchReports(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);

    const fetchReports = async (isMounted = true) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            const headers = { Authorization: `Bearer ${token}` };

            const [dashboardRes, exportsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/reports/dashboard`, { headers }),
                axios.get(`${API_URL}/api/admin/reports/list`, { headers }).catch(() => ({ data: [] }))
            ]);

            if (!isMounted) return;

            setStrategicData(dashboardRes.data.strategic);
            setTacticalData(dashboardRes.data.tactical);
            setOperationalData(dashboardRes.data.operational);
            setExportsData(exportsRes.data);

            if (perfRes.data.weeklySteps?.currentWeek?.length > 0) {
                setSelectedDay(perfRes.data.weeklySteps.currentWeek[perfRes.data.weeklySteps.currentWeek.length - 1]);
            }
        } catch (error) {
            console.error('Fetch reports error:', error);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    const handleTemplateSelect = (temp) => {
        setSelectedTemplate(temp.id);
        setActiveTab(temp.tab);
    };

    const downloadReport = async (report) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            const fileUri = FileSystem.documentDirectory + report.filename;

            const downloadRes = await FileSystem.downloadAsync(
                `${API_URL}/api/admin/reports/export/${report.id}`,
                fileUri,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (downloadRes.status !== 200) {
                alert('Rapor indirilemedi.');
                return;
            }

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(downloadRes.uri);
            } else {
                alert(`Dosya kaydedildi: ${downloadRes.uri}`);
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('İndirme sırasında bir sorun oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <CustomSpinner size="large" color={theme.colors.primary} />
            </View>
        );
    }

    // Chart Data Preparation
    const getFilteredStackData = () => {
        if (!perfData?.weeklySteps?.currentWeek) return [];

        return perfData.weeklySteps.currentWeek.map((day) => {
            const date = new Date(day.date);
            const label = date.toLocaleDateString('tr-TR', { weekday: 'short' });
            let categories = perfData.weeklySteps.categories;
            const colors = [
                '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6',
                '#6366f1', '#fbbf24'
            ];

            // Template based filtering for the chart
            if (selectedTemplate === 'audit') {
                // Focus on specific steps if needed
            }

            return {
                stacks: categories.map((cat, cIdx) => ({
                    value: day[cat] || 0,
                    color: colors[cIdx % colors.length],
                    marginBottom: 2
                })),
                label: label,
                onPress: () => setSelectedDay(day)
            };
        });
    };

    const renderTeamItem = ({ item }) => (
        <GlassCard style={styles.teamCard} theme={theme}>
            <View style={styles.teamHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.teamName, { color: theme.colors.text }]}>{item.name}</Text>
                    <Text style={{ color: theme.colors.subText, fontSize: 12 }}>Lider: {item.leadName}</Text>
                </View>
                <View style={[styles.efficiencyBadge, { backgroundColor: item.stats.efficiencyScore > 80 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)' }]}>
                    <Zap size={14} color={item.stats.efficiencyScore > 80 ? '#22c55e' : theme.colors.primary} />
                    <Text style={[styles.efficiencyText, { color: item.stats.efficiencyScore > 80 ? '#22c55e' : theme.colors.primary }]}>
                        %{item.stats.efficiencyScore}
                    </Text>
                </View>
            </View>

            <View style={styles.teamStatsRow}>
                <View style={styles.teamStat}>
                    <Text style={styles.teamStatLabel}>İŞLER</Text>
                    <Text style={[styles.teamStatVal, { color: theme.colors.text }]}>{item.stats.completedJobs}/{item.stats.totalJobs}</Text>
                </View>
                <View style={styles.teamStat}>
                    <Text style={styles.teamStatLabel}>GİDER</Text>
                    <Text style={[styles.teamStatVal, { color: theme.colors.text }]}>₺{item.stats.totalExpenses.toLocaleString('tr-TR')}</Text>
                </View>
                <View style={styles.teamStat}>
                    <Text style={styles.teamStatLabel}>SÜRE</Text>
                    <Text style={[styles.teamStatVal, { color: theme.colors.text }]}>{item.stats.totalWorkingHours}s</Text>
                </View>
            </View>

            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${item.stats.efficiencyScore}%`, backgroundColor: theme.colors.primary }]} />
            </View>
        </GlassCard>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Analiz & Raporlar</Text>
                <Text style={{ color: theme.colors.subText, fontSize: 14 }}>{selectedTemplate.toUpperCase()} Görünümü Aktif</Text>
            </View>

            {/* Rapor Taslağı (Şablonlar) */}
            <View style={{ marginBottom: 24 }}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text, marginLeft: 20, marginBottom: 12 }]}>Rapor Taslağı</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                >
                    {templates.map((temp) => (
                        <TouchableOpacity
                            key={temp.id}
                            onPress={() => handleTemplateSelect(temp)}
                            style={[
                                styles.templateChip,
                                {
                                    backgroundColor: selectedTemplate === temp.id ? theme.colors.primary : theme.colors.card,
                                    borderColor: selectedTemplate === temp.id ? theme.colors.primary : theme.colors.cardBorder
                                }
                            ]}
                        >
                            <temp.icon size={16} color={selectedTemplate === temp.id ? '#fff' : theme.colors.primary} />
                            <Text style={[
                                styles.templateText,
                                { color: selectedTemplate === temp.id ? '#fff' : theme.colors.text }
                            ]}>
                                {temp.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Sekme Seçimi */}
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 24, paddingRight: 40 }}>
                    {[
                        { id: 'strategic', label: 'Stratejik', icon: BarChart3 },
                        { id: 'tactical', label: 'Taktiksel', icon: TrendingUp },
                        { id: 'operational', label: 'Operasyonel', icon: Zap },
                        { id: 'exports', label: 'İndirmeler', icon: FileIcon }
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.id}
                            style={[styles.tab, activeTab === tab.id && { borderBottomColor: theme.colors.primary, borderBottomWidth: 3, marginRight: 0 }]}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <Text style={[styles.tabText, { color: activeTab === tab.id ? theme.colors.primary : theme.colors.subText }]}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.content}>
                {activeTab === 'strategic' && (
                    <View style={styles.animateContent}>
                        <View style={styles.statsGrid}>
                            <GlassCard style={styles.statCard} theme={theme}>
                                <TrendingUp size={20} color={theme.colors.primary} />
                                <Text style={[styles.statVal, { color: theme.colors.text }]}>%{strategicData?.overallProfitMargin?.toFixed(1)}</Text>
                                <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Genel Kâr</Text>
                            </GlassCard>
                            <GlassCard style={styles.statCard} theme={theme}>
                                <DollarSign size={20} color={theme.colors.success} />
                                <Text style={[styles.statVal, { color: theme.colors.text }]}>₺{strategicData?.trends?.costs?.reduce((s, c) => s + c.amount, 0)?.toLocaleString()}</Text>
                                <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Top. Değer</Text>
                            </GlassCard>
                        </View>

                        <GlassCard style={styles.chartCard} theme={theme}>
                            <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 16 }]}>En Kârlı Müşteriler</Text>
                            {strategicData?.topCustomersByProfit?.map((c, i) => (
                                <View key={i} style={styles.costRow}>
                                    <Text style={{ color: theme.colors.text }}>{c.customer}</Text>
                                    <Text style={{ fontWeight: 'bold', color: theme.colors.success }}>%{c.profitMargin.toFixed(0)}</Text>
                                </View>
                            ))}
                        </GlassCard>
                    </View>
                )}

                {activeTab === 'tactical' && (
                    <View style={styles.animateContent}>
                        <View style={styles.globalStatsRow}>
                            <View style={styles.globalStatItem}>
                                <Text style={[styles.globalStatVal, { color: theme.colors.primary }]}>%{tacticalData?.avgTeamLoad?.toFixed(0)}</Text>
                                <Text style={styles.globalStatLabel}>ORT. YÜK</Text>
                            </View>
                            <View style={[styles.verticalDivider, { backgroundColor: theme.colors.cardBorder }]} />
                            <View style={styles.globalStatItem}>
                                <Text style={[styles.globalStatVal, { color: theme.colors.success }]}>{tacticalData?.teamCapacity?.length}</Text>
                                <Text style={styles.globalStatLabel}>EKİP</Text>
                            </View>
                        </View>

                        <GlassCard style={styles.chartCard} theme={theme}>
                            <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 16 }]}>Bütçe Sapması</Text>
                            {tacticalData?.varianceData?.slice(0, 5).map((v, i) => (
                                <View key={i} style={styles.costRow}>
                                    <Text style={{ color: theme.colors.text, flex: 1 }}>{v.title}</Text>
                                    <Text style={{ fontWeight: 'bold', color: v.variance >= 0 ? theme.colors.success : theme.colors.error }}>
                                        {v.variance >= 0 ? '+' : ''}₺{v.variance.toLocaleString()}
                                    </Text>
                                </View>
                            ))}
                        </GlassCard>
                    </View>
                )}

                {activeTab === 'operational' && (
                    <View style={styles.animateContent}>
                        <View style={styles.statsGrid}>
                            <GlassCard style={styles.statCard} theme={theme}>
                                <AlertTriangle size={20} color={theme.colors.warning} />
                                <Text style={[styles.statVal, { color: theme.colors.text }]}>{operationalData?.pendingApprovals?.costs + operationalData?.pendingApprovals?.steps}</Text>
                                <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Onay Bekleyen</Text>
                            </GlassCard>
                            <GlassCard style={styles.statCard} theme={theme}>
                                <Zap size={20} color={theme.colors.primary} />
                                <Text style={[styles.statVal, { color: theme.colors.text }]}>%{operationalData?.bottleneckScore?.toFixed(0)}</Text>
                                <Text style={[styles.statLabel, { color: theme.colors.subText }]}>Darboğaz Skoru</Text>
                            </GlassCard>
                        </View>

                        <GlassCard style={styles.chartCard} theme={theme}>
                            <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 16 }]}>Kritik Gecikmeler</Text>
                            {operationalData?.topBottlenecks?.map((b, i) => (
                                <View key={i} style={styles.costRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ color: theme.colors.text }}>{b.jobNo}</Text>
                                        <Text style={{ color: theme.colors.subText, fontSize: 10 }}>{b.title}</Text>
                                    </View>
                                    <Text style={{ fontWeight: 'bold', color: theme.colors.error }}>+{b.delay.toFixed(0)}dk</Text>
                                </View>
                            ))}
                        </GlassCard>
                    </View>
                )}

                {activeTab === 'exports' && (
                    <View style={styles.animateContent}>
                        {exportsData && exportsData.length > 0 ? (
                            exportsData.map((report) => (
                                <GlassCard key={report.id} style={[styles.teamCard, { flexDirection: 'row', alignItems: 'center' }]} theme={theme}>
                                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                        <FileIcon size={20} color="#ef4444" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text }}>{report.title}</Text>
                                        <Text style={{ fontSize: 12, color: theme.colors.subText }}>{report.customer} • {new Date(report.createdAt).toLocaleDateString('tr-TR')}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{ padding: 10, borderRadius: 12, backgroundColor: theme.colors.primary }}
                                        onPress={() => downloadReport(report)}
                                    >
                                        <ArrowRight size={18} color="#fff" />
                                    </TouchableOpacity>
                                </GlassCard>
                            ))
                        ) : (
                            <View style={{ padding: 40, alignItems: 'center' }}>
                                <FileIcon size={48} color={theme.colors.subText} style={{ opacity: 0.5, marginBottom: 16 }} />
                                <Text style={{ color: theme.colors.subText, fontSize: 16 }}>İndirilebilir rapor bulunamadı.</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 24, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
    title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
    tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 },
    tab: { paddingVertical: 12, marginRight: 24 },
    tabText: { fontSize: 16, fontWeight: '700' },
    content: { padding: 20 },
    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    statCard: { flex: 1, padding: 20, alignItems: 'center', borderRadius: 24 },
    statVal: { fontSize: 24, fontWeight: '800', marginVertical: 6 },
    statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
    chartCard: { padding: 24, marginBottom: 20, borderRadius: 28 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    cardTitle: { fontSize: 18, fontWeight: '700' },
    templateChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        gap: 8,
    },
    templateText: { fontSize: 14, fontWeight: '600' },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    costRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    teamCard: { padding: 20, marginBottom: 16, borderRadius: 20 },
    teamHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    teamName: { fontSize: 18, fontWeight: 'bold' },
    efficiencyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
    efficiencyText: { fontSize: 12, fontWeight: 'bold' },
    teamStatsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    teamStat: { alignItems: 'flex-start' },
    teamStatLabel: { fontSize: 9, fontWeight: '800', color: '#94a3b8', marginBottom: 4 },
    teamStatVal: { fontSize: 14, fontWeight: 'bold' },
    progressBarBg: { height: 6, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    globalStatsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 24, paddingVertical: 16, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 16 },
    globalStatItem: { alignItems: 'center' },
    globalStatVal: { fontSize: 20, fontWeight: '800' },
    globalStatLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginTop: 2 },
    verticalDivider: { width: 1, height: 30 },
    animateContent: { opacity: 1 },
});

export default ReportsScreen;
