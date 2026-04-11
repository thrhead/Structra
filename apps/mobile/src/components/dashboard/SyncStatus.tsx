import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppStore } from '../../services/store';

export const SyncStatus: React.FC = () => {
  const { isOnline, syncQueue, isSyncing } = useAppStore();
  const pendingCount = syncQueue.length;

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return (
      <View style={[styles.container, styles.success]}>
        <View style={styles.dotSuccess} />
        <Text style={styles.textSuccess}>Tüm veriler senkronize</Text>
      </View>
    );
  }

  if (!isOnline) {
    return (
      <View style={[styles.container, styles.offline]}>
        <View style={styles.dotOffline} />
        <Text style={styles.textOffline}>Çevrimdışı: {pendingCount} işlem bekliyor</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.syncing]}>
      <ActivityIndicator size="small" color="#2563EB" style={styles.spinner} />
      <Text style={styles.textSyncing}>Senkronize ediliyor... ({pendingCount})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  success: {
    backgroundColor: '#F8FAFC',
    borderBottomColor: '#E2E8F0',
  },
  offline: {
    backgroundColor: '#FEF2F2',
    borderBottomColor: '#FECACA',
  },
  syncing: {
    backgroundColor: '#EFF6FF',
    borderBottomColor: '#BFDBFE',
  },
  dotSuccess: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981', marginRight: 8,
  },
  dotOffline: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginRight: 8,
  },
  spinner: {
    marginRight: 8,
  },
  textSuccess: { color: '#64748B', fontSize: 13, fontWeight: '500' },
  textOffline: { color: '#B91C1C', fontSize: 13, fontWeight: '600' },
  textSyncing: { color: '#1D4ED8', fontSize: 13, fontWeight: '600' },
});
