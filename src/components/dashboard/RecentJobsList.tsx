import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../ui/Card';
import { Badge, BadgeStatus } from '../ui/Badge';
import { useAppStore, Job } from '../../services/store';

const getBadgeLabel = (status: BadgeStatus) => {
  switch (status) {
    case 'completed': return 'Tamamlandı';
    case 'pending': return 'Bekliyor';
    case 'delayed': return 'Gecikti';
    default: return status;
  }
};

const JobItem = React.memo(({ item }: { item: Job }) => (
  <Card style={styles.jobCard}>
    <View style={styles.jobHeader}>
      <Text style={styles.jobName} numberOfLines={1}>{item.name}</Text>
      <Badge status={item.status} label={getBadgeLabel(item.status)} />
    </View>
    <View style={styles.jobDetails}>
      <Text style={styles.workerText}>👨‍🔧 {item.assignedWorker}</Text>
      <Text style={styles.dateText}>📅 {item.date}</Text>
    </View>
  </Card>
));

export const RecentJobsList: React.FC = () => {
  const jobs = useAppStore((state) => state.jobs);

  const renderItem = useCallback(({ item }: { item: Job }) => {
    return <JobItem item={item} />;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Son İşlemler</Text>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  listContent: {
    gap: 12,
  },
  jobCard: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  workerText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 13,
    color: '#6B7280',
  },
});
