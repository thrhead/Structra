import React from 'react';
import { FlatList, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from '../ui/Card';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

const DATA = [
  { id: '1', title: 'Aktif Görev', value: '42', change: '+12%', positive: true },
  { id: '2', title: 'Toplam Maliyet', value: '₺145K', change: '-5%', positive: true },
  { id: '3', title: 'Saha Personeli', value: '18', change: 'Sabit', positive: null },
  { id: '4', title: 'Onay Bekleyen', value: '7', change: '+2', positive: false },
];

export const KPICards: React.FC = () => {
  const renderItem = ({ item }: { item: typeof DATA[0] }) => (
    <Card style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.value}>{item.value}</Text>
      <View style={styles.changeRow}>
        <Text
          style={[
            styles.changeText,
            item.positive === true && styles.textPositive,
            item.positive === false && styles.textNegative,
            item.positive === null && styles.textNeutral,
          ]}
        >
          {item.change}
        </Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    padding: 16,
  },
  title: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textPositive: { color: '#10B981' },
  textNegative: { color: '#EF4444' },
  textNeutral: { color: '#9CA3AF' },
});
