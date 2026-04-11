import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type BadgeStatus = 'completed' | 'pending' | 'delayed' | 'neutral';

interface BadgeProps {
  status: BadgeStatus;
  label: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label }) => {
  const getColors = () => {
    switch (status) {
      case 'completed': return { bg: '#D1FAE5', text: '#065F46' };
      case 'pending': return { bg: '#FEF3C7', text: '#92400E' };
      case 'delayed': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
