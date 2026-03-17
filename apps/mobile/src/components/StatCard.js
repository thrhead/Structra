import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import GlassCard from './ui/GlassCard';

const StatCard = ({
    label,
    value,
    icon,
    iconColor, // Can be undefined, we'll use theme default
    style
}) => {
    const { theme, isDark } = useTheme();
    const activeIconColor = iconColor || theme.colors.primary;

    return (
        <GlassCard theme={theme} style={[
            styles.container, 
            { 
                backgroundColor: '#1E293B', 
                borderColor: 'rgba(250, 204, 21, 0.1)',
                borderRadius: 4 
            }, 
            style
        ]}>
            <View style={styles.contentContainer}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(250, 204, 21, 0.05)' }]}>
                    <MaterialIcons name={icon} size={24} color="#FACC15" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.number, { color: '#FFF' }]}>
                        {value}
                    </Text>
                    <Text style={[styles.label, { color: '#FACC15' }]} numberOfLines={1}>{label}</Text>
                </View>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginBottom: 12,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    number: {
        fontSize: 24,
        fontWeight: '900',
        lineHeight: 28,
        letterSpacing: -0.5,
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    label: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
});

export default StatCard;
