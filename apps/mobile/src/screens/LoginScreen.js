import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import LoginForm from '../components/LoginForm';

export default function LoginScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVInzIwDED1gTH9D3W1O6NqagVGfssjm3ZRW7RaOulQmtYk1UIxFYz3w9kVHGmzyAIH7se_Nm6gSn_pArouOOVN28xv_N0XJTDTvLXS63jOHiHwTnsUdLkX5vspvyaMuruw51YncusrQCWcyAQUgGOTnSFKpw2rp7ceHi2QpnuNwrnIeQNneTUqPzaWOQJOsUcGiXc2BxvolYWIx9bSgb1KypVxiGTU-A7_MvH5JYHGLOEmFSzfxfGdF7HKCYKxnNvh1ZC0-UBdNqo' }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.glassCard}>
            <View style={styles.header}>
              <View style={styles.iconWrapper}>
                <MaterialIcons name="precision-manufacturing" size={32} color="#fff" />
              </View>
              <Text style={styles.title}>Structra</Text>
              <Text style={styles.subtitle}>Proje Verilerine Erişmek İçin Giriş Yapın</Text>
            </View>

            <LoginForm />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Erişime mi ihtiyacınız var?{' '}
                <Text style={styles.footerLink}>Hesap Talebi</Text>
              </Text>
            </View>
          </View>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>V1.0 • Montaj Takip Sistemi</Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footerLink: {
    fontWeight: '600',
    color: '#fff',
  },
  versionContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});