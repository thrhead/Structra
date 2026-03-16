import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GlassCard from '../ui/GlassCard';

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
        <GlassCard style={[styles.substepWrapper, isSubstepLocked && styles.lockedCard]} theme={theme}>
            <View style={styles.substepRow}>
                <TouchableOpacity
                    style={[
                        styles.checkbox, 
                        { borderColor: theme.colors.primary },
                        isCompleted && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => handleSubstepToggle(step.id, substep.id, isCompleted)}
                    disabled={isSubstepLocked || isAdmin}
                >
                    {isCompleted && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
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
                                <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
                                    <Text style={styles.badgeText}>{getStatusText()}</Text>
                                </View>
                            )}

                            {!isSubstepLocked && !isCompleted && !isAdmin && (
                                <TouchableOpacity
                                    onPress={() => pickImage(step.id, substep.id, 'camera')}
                                    style={[styles.photoButton, { backgroundColor: theme.colors.primary + '15' }]}
                                >
                                    <MaterialIcons name="add-a-photo" size={18} color={theme.colors.primary} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

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
                        <View style={[styles.rejectionContainer, { backgroundColor: theme.colors.error + '10' }]}>
                            <Text style={[styles.rejectionReasonText, { color: theme.colors.error }]}>
                                {t('worker.rejectionReason')}: {substep.rejectionReason}
                            </Text>
                        </View>
                    )}

                    {/* Manager Actions */}
                    {isManager && isCompleted && substep.approvalStatus === 'PENDING' && (
                        <View style={styles.managerActionRow}>
                            <TouchableOpacity
                                style={[styles.managerButton, { backgroundColor: theme.colors.error }]}
                                onPress={() => {
                                    setSelectedSubstepId(substep.id);
                                    setRejectionType('SUBSTEP');
                                    setRejectionModalVisible(true);
                                }}
                            >
                                <MaterialIcons name="close" size={14} color="#fff" />
                                <Text style={styles.managerButtonText}>Reddet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.managerButton, { backgroundColor: theme.colors.success }]}
                                onPress={() => handleApproveSubstep(substep.id)}
                            >
                                <MaterialIcons name="check" size={14} color="#fff" />
                                <Text style={styles.managerButtonText}>Onayla</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    substepWrapper: {
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
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
        borderRadius: 6,
        borderWidth: 2,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    substepInfo: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    substepTitle: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    completedText: {
        textDecorationLine: 'none',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: 'bold',
    },
    photoButton: {
        padding: 6,
        borderRadius: 8,
        marginLeft: 8,
    },
    photoContainer: {
        marginTop: 8,
    },
    rejectionContainer: {
        marginTop: 8,
        padding: 8,
        borderRadius: 6,
    },
    rejectionReasonText: {
        fontSize: 12,
        fontWeight: '500',
    },
    managerActionRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 10,
    },
    managerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        borderRadius: 6,
        gap: 4,
    },
    managerButtonText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
});

export default SubStepItem;
