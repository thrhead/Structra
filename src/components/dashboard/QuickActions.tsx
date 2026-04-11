import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { useAppStore } from '../../services/store';

export const QuickActions: React.FC = () => {
  const { addToQueue } = useAppStore();

  const handleNewJob = () => {
    addToQueue({ type: 'CREATE_JOB', payload: { title: 'Yeni İş' } });
  };

  const handleNewUser = () => {
    addToQueue({ type: 'CREATE_USER', payload: { role: 'worker' } });
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Yeni İş Oluştur" 
        variant="primary" 
        style={styles.button} 
        onPress={handleNewJob}
      />
      <View style={styles.spacer} />
      <Button 
        title="Yeni Kullanıcı" 
        variant="secondary" 
        style={styles.button} 
        onPress={handleNewUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
  },
  spacer: {
    width: 12,
  },
});
