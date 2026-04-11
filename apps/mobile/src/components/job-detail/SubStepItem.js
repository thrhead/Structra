import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SubStepItem = ({ 
    substep, 
    subIndex, 
    step, 
    theme, 
    user, 
    t, 
    handleSubstepToggle, 
    pickImage, 
    renderPhotoItem,
    handleApproveSubstep,
    setSelectedSubstepId,
    setRejectionType,
    setRejectionModalVisible
}) => {
    const isSubstepLocked = subIndex > 0 && !step.subSteps[subIndex - 1].isCompleted;
    const isCompleted = substep.isCompleted;
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    const isManager = ['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase());

    const getStatusColor = () => {
        if (substep.approvalStatus === 'APPROVED') return theme.colors.success || '#10B981';
        if (substep.approvalStatus === 'REJECTED') return theme.colors.error || '#EF4444';
        return theme.colors.warning || '#F59E0B';
    };

    const getStatusText = () => {
        if (substep.approvalStatus === 'APPROVED') return 'ONAYLI';
        if (substep.approvalStatus === 'REJECTED') return 'RED';
        return 'BEKLİYOR';
    };

    return (
        <View style={[
            styles.substepWrapper, 
            { backgroundColor: theme.colors.surface || '#F9FAFB', borderColor: theme.colors.border || '#E5E7EB' },
            isSubstepLocked && styles.lockedCard
        ]}>
            <View style={styles.substepRow}>
                <TouchableOpacity
                    style={[
                        styles.checkbox, 
                        { borderColor: theme.colors.primary },
                        isCompleted && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => handleSubstepToggle(step.id, substep.id, isCompleted)}
                    disabled={isSubstepLocked || isAdmin}
                >
                    {isCompleted && <MaterialIcons name="check" size={12} color="#FFFFFF" />}
                </TouchableOpacity>

                <View style={styles.substepInfo}>
                    <View style={styles.titleRow}>
                        <Text style={[
                            styles.substepTitle, 
                            isCompleted && styles.completedText, 
                            { color: theme.colors.text }
                        ]}>
                            {substep.title || substep.name}
                        </Text>
                        
                        <View style={styles.actionRow}>
                            {isCompleted && (
                                <View style={[styles.badge, { backgroundColor: getStatusColor() + '15' }]}>
                                    <Text style={[styles.badgeText, { color: getStatusColor() }]}>{getStatusText()}</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Camera Action Row - More user friendly */}
                    {!isSubstepLocked && !isCompleted && !isAdmin && (
                        <TouchableOpacity
                            onPress={() => pickImage(step.id, substep.id, 'camera')}
                            style={[styles.addPhotoButton, { backgroundColor: theme.colors.primary + '10' }]}
                        >
                            <MaterialIcons name="add-a-photo" size={18} color={theme.colors.primary} />
                            <Text style={[styles.addPhotoText, { color: theme.colors.primary }]}>Fotoğraf Çek</Text>
                        </TouchableOpacity>
                    )}

                    {substep.photos && substep.photos.length > 0 && (
                        <View style={styles.photoContainer}>
                            <FlatList
                                data={substep.photos}
                                renderItem={renderPhotoItem}
                                keyExtractor={(p, i) => i.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}

                    {substep.approvalStatus === 'REJECTED' && substep.rejectionReason && (
                        <View style={[styles.rejectionContainer, { backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error + '30' }]}>
                            <MaterialIcons name="error-outline" size={14} color={theme.colors.error} style={{ marginTop: 1 }} />
                            <Text style={[styles.rejectionReasonText, { color: theme.colors.error }]}>
                                {substep.rejectionReason}
                            </Text>
                        </View>
                    )}

                    {/* Manager Actions */}
                    {isManager && isCompleted && substep.approvalStatus === 'PENDING' && (
                        <View style={styles.managerActionRow}>
                            <TouchableOpacity
                                style={[styles.managerButton, { backgroundColor: theme.colors.error + '15' }]}
                                onPress={() => {
                                    setSelectedSubstepId(substep.id);
                                    setRejectionType('SUBSTEP');
                                    setRejectionModalVisible(true);
                                }}
                            >
                                <MaterialIcons name="close" size={16} color={theme.colors.error} />
                                <Text style={[styles.managerButtonText, { color: theme.colors.error }]}>Reddet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.managerButton, { backgroundColor: theme.colors.success }]}
                                onPress={() => handleApproveSubstep(substep.id)}
                            >
                                <MaterialIcons name="check" size={16} color="#fff" />
                                <Text style={[styles.managerButtonText, { color: '#fff' }]}>Onayla</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    substepWrapper: {
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
    },
    lockedCard: {
        opacity: 0.5,
    },
    substepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
    },
    substepInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    substepTitle: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    completedText: {
        opacity: 0.6,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    addPhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 6,
        gap: 6,
    },
    addPhotoText: {
        fontSize: 13,
        fontWeight: '600',
    },
    photoContainer: {
        marginTop: 10,
    },
    rejectionContainer: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 6,
    },
    rejectionReasonText: {
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
        lineHeight: 16,
    },
    managerActionRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    managerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    managerButtonText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default SubStepItem;