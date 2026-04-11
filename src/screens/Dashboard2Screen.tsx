import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { SyncStatus } from '../components/dashboard/SyncStatus';
import { KPICards } from '../components/dashboard/KPICards';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentJobsList } from '../components/dashboard/RecentJobsList';
import { useSyncManager } from '../offline/SyncManager';

export const Dashboard2Screen: React.FC = () => {
  // Init offline sync manager
  useSyncManager();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F4F5" />
      <View style={styles.container}>
        <SyncStatus />
        <ScrollView 
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <KPICards />
          <QuickActions />
          <AnalyticsChart />
          <RecentJobsList />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F5',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
});
