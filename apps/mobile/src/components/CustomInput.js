import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CustomInput = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    icon,
    rightIcon,
    onRightIconPress,
    label,
    error,
    keyboardType,
    autoCapitalize,
    editable = true,
    style,
    theme: propTheme
}) => {
    const { theme: contextTheme } = useTheme();
    const theme = propTheme || contextTheme;
    const colors = theme ? theme.colors : COLORS;
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={[styles.label, { color: colors.subText || colors.slate400 }]}>{label}</Text>}
            <View style={[
                styles.inputContainer, 
                { 
                    backgroundColor: theme ? colors.card : 'rgba(255,255,255,0.05)', 
                    borderColor: error ? (colors.error || colors.red500) : (isFocused ? (colors.primary || COLORS.primary) : (theme ? colors.border : colors.slate700)),
                    borderWidth: isFocused || error ? 2 : 1
                }
            ]}>
                {icon && (
                    <MaterialIcons
                        name={icon}
                        size={20}
                        color={isFocused ? (colors.primary || COLORS.primary) : (colors.subText || colors.slate500)}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    style={[styles.input, { color: colors.text || colors.white }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.subText || colors.slate500}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    editable={editable}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    accessibilityLabel={label || placeholder}
                />
                {rightIcon && (
                    <TouchableOpacity 
                        onPress={onRightIconPress} 
                        style={styles.rightIcon}
                        accessibilityRole="button"
                        accessibilityLabel={rightIcon}
                    >
                        <MaterialIcons
                            name={rightIcon}
                            size={20}
                            color={colors.subText || colors.slate500}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={[styles.errorText, { color: colors.error || colors.red500 }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 6,
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderWidth: 1.5,
        borderColor: '#334155',
        borderRadius: 4,
        height: 56,
    },
    errorBorder: {
        borderColor: '#EF4444',
    },
    icon: {
        marginLeft: 16,
    },
    rightIcon: {
        marginRight: 16,
    },
    input: {
        flex: 1,
        color: '#F8FAFC',
        paddingHorizontal: 16,
        height: '100%',
        fontSize: 16,
        fontWeight: '500',
    },
    errorText: {
        fontSize: 11,
        marginTop: 6,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default CustomInput;
