import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

export const AnalyticsChart: React.FC = () => {
  // Mock data points
  const data = [20, 45, 28, 80, 65, 90];
  const max = 100;
  const height = 120;
  const width = 300;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / max) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Performans Özeti</Text>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Montajlar vs Tamamlanan</Text>
          <Text style={styles.subtitle}>Son 6 Ay</Text>
        </View>
        
        <View style={styles.chartContainer}>
          <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#2563EB" stopOpacity="0.2" />
                <Stop offset="1" stopColor="#2563EB" stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Path d={areaD} fill="url(#grad)" />
            <Path d={pathD} fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((val, i) => {
              const x = (i / (data.length - 1)) * width;
              const y = height - (val / max) * height;
              return <Circle key={i} cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />;
            })}
          </Svg>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    overflow: 'hidden',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -8,
  },
});
