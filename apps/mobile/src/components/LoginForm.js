import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ onLoginSuccess }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();

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
            Alert.alert(
                t('auth.errorTitle'),
                `${result.error || t('common.error')}`
            );
        }
    };

    return (
        <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="mail" size={20} color="rgba(255,255,255,0.5)" />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder={t('auth.email') || "Email"}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                />
            </View>

            <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="lock" size={20} color="rgba(255,255,255,0.5)" />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder={t('auth.password') || "Password"}
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                />
                <TouchableOpacity 
                    style={styles.eyeIconContainer} 
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <MaterialIcons 
                        name={showPassword ? "visibility-off" : "visibility"} 
                        size={20} 
                        color="rgba(255,255,255,0.4)" 
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
                <TouchableOpacity 
                    style={styles.rememberMeContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                >
                    <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                        {rememberMe && <MaterialIcons name="check" size={12} color="#fff" />}
                    </View>
                    <Text style={styles.rememberMeText}>Beni Hatırla</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>Parolanızı mı Unuttunuz?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.loginButtonText}>{t('auth.login') || "Oturum aç"}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        gap: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 12,
        height: 52,
    },
    iconContainer: {
        paddingLeft: 16,
        paddingRight: 12,
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        height: '100%',
        paddingRight: 16,
        ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {})
    },
    eyeIconContainer: {
        paddingHorizontal: 16,
        justifyContent: 'center',
        height: '100%',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: -4, 
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 14,
        height: 14,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    rememberMeText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    forgotPasswordText: {
        color: '#bfdbfe', 
        fontSize: 12,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#2563eb', 
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default LoginForm;