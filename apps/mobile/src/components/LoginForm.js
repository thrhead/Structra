import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { API_BASE_URL } from '../services/api';

const LoginForm = ({ onBack, onLoginSuccess }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { theme, isDark } = useTheme();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(t('common.error'), t('auth.enterCredentials'));
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            if (onLoginSuccess) onLoginSuccess();
        } else {
            console.error('Login Failed:', result);
            Alert.alert(
                t('auth.errorTitle'),
                `${result.error || t('common.error')}`
            );
        }
    };

    return (
        <View style={styles.loginFormContainer}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color="#FACC15" />
                <Text style={{ color: "#FACC15", marginLeft: 8, fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12 }}>{t('common.back')}</Text>
            </TouchableOpacity>

            <Text style={[styles.loginTitle, { color: isDark ? theme.colors.text : theme.colors.primary }]}>{t('auth.login')}</Text>
            {__DEV__ && (
                <Text style={styles.debugText}>API: {API_BASE_URL}</Text>
            )}

            <CustomInput
                placeholder={t('auth.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
            />

            <CustomInput
                placeholder={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? 'visibility' : 'visibility-off'}
                onRightIconPress={() => setShowPassword(!showPassword)}
                editable={!loading}
            />

            <CustomButton
                title={t('auth.login')}
                onPress={handleLogin}
                loading={loading}
                style={{ marginTop: 10 }}
            />

            {__DEV__ && (
                <View style={styles.hintContainer}>
                    <Text style={[styles.hint, { color: theme.colors.subText }]}>{t('auth.adminHint')}</Text>
                    <Text style={[styles.hint, { color: theme.colors.subText }]}>{t('auth.workerHint')}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loginFormContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#0F172A',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,
        padding: 8,
    },
    loginTitle: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 40,
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: '#F8FAFC',
        borderLeftWidth: 4,
        borderLeftColor: '#FACC15',
        paddingLeft: 16,
    },
    debugText: {
        color: '#475569',
        textAlign: 'center',
        fontSize: 10,
        marginBottom: 20,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    hintContainer: {
        marginTop: 32,
        padding: 16,
        backgroundColor: '#1E293B',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#334155',
    },
    hint: {
        textAlign: 'left',
        fontSize: 11,
        marginBottom: 4,
        color: '#94A3B8',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});

export default LoginForm;
