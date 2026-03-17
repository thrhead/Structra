import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { LogOut } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useTheme } from '../../context/ThemeContext';

const CustomDrawer = ({ visible, onClose, user, navItems, onNavigate, onLogout }) => {
    const { theme } = useTheme();

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.drawerContainer, { backgroundColor: '#1E293B', borderRightColor: 'rgba(250, 204, 21, 0.2)' }]}>
                    <View style={[styles.drawerHeader, { borderBottomColor: 'rgba(250, 204, 21, 0.1)' }]}>
                        <View style={styles.drawerAvatarContainer}>
                            <Text style={styles.drawerAvatarText}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </Text>
                        </View>
                        <Text style={[styles.drawerName, { color: '#FFF' }]}>{user?.name?.toUpperCase() || 'OPERATOR'}</Text>
                        <Text style={[styles.drawerRole, { color: '#FACC15' }]}>SYSTEM_ADMIN</Text>
                    </View>
                    <View style={styles.drawerItems}>
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.drawerItem}
                                    onPress={() => onNavigate(item.route)}
                                >
                                    <IconComponent size={24} color={item.color || '#FACC15'} />
                                    <Text style={[styles.drawerItemText, { color: '#FFF' }]}>{item.title.toUpperCase()}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                        <LogOut size={24} color={COLORS.red500} />
                        <Text style={styles.logoutText}>Çıkış Yap</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    drawerContainer: {
        width: '70%',
        height: '100%',
        padding: 20,
        paddingTop: 50,
        borderRightWidth: 1,
    },
    drawerHeader: {
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 1,
        paddingBottom: 20,
    },
    drawerAvatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 4,
        backgroundColor: '#FACC15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(250, 204, 21, 0.5)',
    },
    drawerAvatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    drawerName: {
        fontSize: 16,
        fontWeight: '900',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        marginTop: 8,
    },
    drawerRole: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    drawerItems: {
        gap: 8,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 16,
    },
    drawerItemText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginTop: 'auto',
        gap: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.slate800,
        paddingTop: 20,
    },
    logoutText: {
        color: COLORS.red500,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CustomDrawer;
