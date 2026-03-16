import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import GlassCard from '../ui/GlassCard';
import { getValidImageUrl } from '../../utils';

const StepItem = ({ 
    step, 
    index, 
    job, 
    theme, 
    user, 
    t, 
    formatDate, 
    handleToggleStep, 
    openImageModal, 
    renderPhotoItem,
    handleApproveStep,
    setRejectionType,
    setSelectedStepId,
    setRejectionModalVisible,
    children 
}) => {
    const isLocked = index > 0 && !job.steps[index - 1].isCompleted;
    const isCompleted = step.isCompleted;
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
    const isManager = ['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase());

    const getStatusColor = () => {
        if (step.approvalStatus === 'APPROVED') return theme.colors.success || '#10B981';
        if (step.approvalStatus === 'REJECTED') return theme.colors.error || '#EF4444';
        return theme.colors.warning || '#F59E0B';
    };

    const getStatusText = () => {
        if (step.approvalStatus === 'APPROVED') return t('common.approved') || 'ONAYLANDI';
        if (step.approvalStatus === 'REJECTED') return t('common.rejected') || 'REDDEDİLDİ';
        return t('common.pendingApproval') || 'ONAY BEKLİYOR';
    };

    return (
        <GlassCard style={[styles.stepCard, isLocked && styles.lockedCard]} theme={theme}>
            <View style={styles.stepHeader}>
                <TouchableOpacity
                    style={[
                        styles.checkbox, 
                        { borderColor: theme.colors.primary },
                        isCompleted && { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={() => handleToggleStep(step.id, isCompleted)}
                    disabled={isLocked || isAdmin}
                >
                    {isCompleted && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
                
                <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            {step.stepNo && (
                                <Text style={[styles.stepNo, { color: theme.colors.primary }]}>
                                    {step.stepNo}
                                </Text>
                            )}
                            <Text style={[
                                styles.stepTitle, 
                                isCompleted && styles.completedText, 
                                { color: theme.colors.text }
                            ]}>
                                {step.title || step.name}
                            </Text>
                        </View>
                        
                        {isCompleted && (
                            <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
                                <Text style={styles.badgeText}>{getStatusText()}</Text>
                            </View>
                        )}
                    </View>

                    {step.startedAt && (
                        <Text style={[styles.dateText, { color: theme.colors.subText }]}>
                            {t('worker.started')}: {formatDate(step.startedAt)}
                        </Text>
                    )}
                    
                    {step.completedAt && (
                        <View>
                            <Text style={[styles.dateText, { color: theme.colors.subText }]}>
                                {t('worker.finished')}: {formatDate(step.completedAt)}
                            </Text>
                            {(step.latitude && step.longitude) && (
                                <View style={styles.metadataTag}>
                                    <MaterialIcons name="location-pin" size={12} color={theme.colors.subText} />
                                    <Text style={[styles.metadataText, { color: theme.colors.subText }]}>
                                        {step.latitude.toFixed(4)}, {step.longitude.toFixed(4)}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {/* Photos rendered below the header to prevent overlap */}
            {step.photos && step.photos.length > 0 && (
                <View style={styles.photoContainer}>
                    <FlatList
                        data={step.photos}
                        renderItem={renderPhotoItem}
                        keyExtractor={(p, i) => i.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            )}

            {step.approvalStatus === 'REJECTED' && step.rejectionReason && (
                <View style={[styles.rejectionContainer, { backgroundColor: theme.colors.error + '10' }]}>
                    <Text style={[styles.rejectionReasonText, { color: theme.colors.error }]}>
                        {t('worker.rejectionReason')}: {step.rejectionReason}
                    </Text>
                </View>
            )}

            {/* Manager Actions */}
            {isManager && isCompleted && step.approvalStatus === 'PENDING' && (
                <View style={styles.managerActionRow}>
                    <TouchableOpacity
                        style={[styles.managerButton, { backgroundColor: theme.colors.error }]}
                        onPress={() => {
                            setSelectedStepId(step.id);
                            setRejectionType('STEP');
                            setRejectionModalVisible(true);
                        }}
                    >
                        <MaterialIcons name="close" size={16} color="#fff" />
                        <Text style={styles.managerButtonText}>{t('common.reject') || 'Reddet'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.managerButton, { backgroundColor: theme.colors.success }]}
                        onPress={() => handleApproveStep(step.id)}
                    >
                        <MaterialIcons name="check" size={16} color="#fff" />
                        <Text style={styles.managerButtonText}>{t('common.approve') || 'Onayla'}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!isLocked && step.subSteps && (
                <View style={[styles.substepsContainer, { borderLeftColor: theme.colors.border }]}>
                    {children}
                </View>
            )}
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    stepCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    lockedCard: {
        opacity: 0.6,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    stepNo: {
        fontSize: 10,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginBottom: 2,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    completedText: {
        textDecorationLine: 'none',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 8,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 12,
        marginTop: 2,
    },
    metadataTag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    metadataText: {
        fontSize: 11,
        marginLeft: 4,
    },
    photoContainer: {
        marginTop: 12,
        marginBottom: 4,
    },
    rejectionContainer: {
        marginTop: 12,
        padding: 10,
        borderRadius: 8,
    },
    rejectionReasonText: {
        fontSize: 13,
        fontWeight: '500',
    },
    managerActionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
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
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    substepsContainer: {
        marginTop: 16,
        paddingLeft: 12,
        borderLeftWidth: 1,
    },
});

export default StepItem;
