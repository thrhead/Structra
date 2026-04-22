import React from 'react';
import { Modal, View, Text, StyleSheet, Platform } from 'react-native';
import CustomSpinner from '../CustomSpinner';

const LoadingOverlay = ({ visible, message, theme }) => {
    if (!visible) return null;

    const overlayContent = (
        <View style={styles.overlay}>
            <View style={[styles.container, { backgroundColor: theme.isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)', borderColor: theme.colors.border }]}>
                <CustomSpinner size="large" color={theme.colors.primary} />
                {message && (
                    <Text style={[styles.message, { color: theme.colors.text }]}>
                        {message}
                    </Text>
                )}
            </View>
        </View>
    );

    if (Platform.OS === 'web') {
        return (
            <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}>
                {overlayContent}
            </View>
        );
    }

    return (
        <Modal transparent visible={visible} animationType="fade">
            {overlayContent}
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 13,
        elevation: 20,
        minWidth: 160,
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default LoadingOverlay;
