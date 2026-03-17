import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../context/AlertContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import LoginForm from '../components/LoginForm';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  const renderLanding = () => (
    <View style={[styles.container, { backgroundColor: '#0F172A' }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Hero Section with Industrial Grid */}
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          {/* Technical Decorations */}
          <View style={{ position: 'absolute', top: 50, right: 20, zIndex: 100 }}>
            <LanguageSwitcher compact />
          </View>
          
          <View style={styles.decorationContainer}>
            {/* Grid Lines */}
            {[...Array(6)].map((_, i) => (
              <View key={`v-${i}`} style={[styles.line, { width: 1, height: height, left: (width / 6) * i, opacity: 0.05, backgroundColor: '#FACC15' }]} />
            ))}
            {[...Array(10)].map((_, i) => (
              <View key={`h-${i}`} style={[styles.line, { height: 1, width: width, top: (height / 10) * i, opacity: 0.05, backgroundColor: '#FACC15' }]} />
            ))}

            <View style={[styles.circleOutline, { width: 400, height: 400, borderRadius: 200, opacity: 0.03, borderColor: '#FACC15' }]} />
          </View>

          {/* Industrial Panel */}
          <View style={styles.glassPanelContainer}>
            <View style={[styles.glassPanel, { backgroundColor: 'rgba(30, 41, 59, 0.7)', borderColor: 'rgba(250, 204, 21, 0.2)' }]}>
              {/* Corner Accents */}
              <View style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#FACC15' }} />
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#FACC15' }} />

              {/* Center Content */}
              <View style={styles.glassCenterContent}>
                <View style={styles.appIconSquare}>
                  <MaterialIcons name="settings_input_component" size={48} color="#FACC15" />
                </View>
                <Text style={styles.appName}>Structra</Text>
                <Text style={styles.appTagline}>Industrial OS // v4.0</Text>
              </View>
            </View>
          </View>

          <LinearGradient
            colors={['transparent', '#0F172A']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80 }}
          />
        </LinearGradient>
      </View>

      {/* Bottom Content Section */}
      <View style={styles.bottomSection}>
        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>
            {t('auth.adminAccess')}
          </Text>
          <Text style={styles.subTitle}>
            Industrial-grade management system. Secure auth required.
          </Text>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#FACC15' }]}
            onPress={() => setShowLoginForm(true)}
          >
            <Text style={[styles.primaryButtonText, { color: '#0F172A' }]}>AUTH PROTOCOL</Text>
            <MaterialIcons name="security" size={24} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: 'transparent', borderColor: '#334155' }]}
            onPress={() => showAlert(t('common.info'), "Worker terminal not active.")}
          >
            <Text style={[styles.googleButtonText, { color: '#94A3B8' }]}>WORKER TERMINAL</Text>
          </TouchableOpacity>

          <View style={styles.footerFeatures}>
            <View style={styles.featureItem}>
              <MaterialIcons name="shield" size={16} color="#475569" />
              <Text style={[styles.featureText, { color: '#475569' }]}>SECURE</Text>
            </View>
            <View style={{ width: 1, height: 12, backgroundColor: '#334155' }} />
            <View style={styles.featureItem}>
              <MaterialIcons name="memory" size={16} color="#475569" />
              <Text style={[styles.featureText, { color: '#475569' }]}>OPTIMIZED</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.background }, Platform.OS === 'web' && { height: '100%', minHeight: '100vh' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        enabled={Platform.OS !== 'web'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 20 }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          {showLoginForm ? (
            <LoginForm
              onBack={() => setShowLoginForm(false)}
              onLoginSuccess={() => { /* Navigation handled by AuthContext */ }}
            />
          ) : renderLanding()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: height * 0.45,
    width: '100%',
    overflow: 'hidden',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorationContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleOutline: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  glassPanelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  glassPanel: {
    width: 260,
    height: 260,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for glass
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  floatingIconRight: {
    position: 'absolute',
    top: -24,
    right: -24,
    width: 70,
    height: 70,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingIconLeft: {
    position: 'absolute',
    bottom: 40,
    left: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  glassCenterContent: {
    alignItems: 'center',
  },
  appIconSquare: {
    width: 80,
    height: 80,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FACC15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 0 10px rgba(250, 204, 21, 0.3)'
    } : {
      shadowColor: "#FACC15",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    }),
    elevation: 10,
  },
  appName: {
    color: '#fff',
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  appTagline: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
    backgroundColor: '#0F172A',
  },
  textSection: {
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#FACC15',
    paddingLeft: 16,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F8FAFC',
    lineHeight: 38,
    textTransform: 'uppercase',
  },
  subTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
    lineHeight: 20,
  },
  buttonSection: {
    gap: 16,
    marginTop: 'auto',
    paddingBottom: 24,
  },
  primaryButton: {
    height: 64,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FACC15',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 10px rgba(250, 204, 21, 0.4)'
    } : {
      shadowColor: "#FACC15",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
    }),
    elevation: 12,
  },
  primaryButtonText: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '900',
    marginRight: 12,
    letterSpacing: 2,
  },
  googleButton: {
    height: 56,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  googleButtonText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontWeight: '700',
    letterSpacing: 2,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  signInText: {
    fontWeight: '500',
  },
  signInLink: {
    fontWeight: 'bold',
  },
  footerFeatures: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
    opacity: 0.6,
  },
  featureItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 20,
  }
});