import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
        <View style={[
            styles.stepCard, 
            { backgroundColor: theme.colors.card || '#FFFFFF', borderColor: theme.colors.border || '#E5E7EB' },
            isLocked && styles.lockedCard
        ]}>
            <View style={styles.stepHeader}>
                <TouchableOpacity
                    style={[
                        styles.checkbox, 
                        { borderColor: theme.colors.primary },
                        isCompleted && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
                    ]}
                    onPress={() => handleToggleStep(step.id, isCompleted)}
                    disabled={isLocked || isAdmin}
                >
                    {isCompleted && <MaterialIcons name="check" size={18} color="#FFFFFF" />}
                </TouchableOpacity>
                
                <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            {step.stepNo && (
                                <View style={[styles.stepNoBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                                    <Text style={[styles.stepNoText, { color: theme.colors.primary }]}>
                                        {step.stepNo}
                                    </Text>
                                </View>
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
                            <View style={[styles.badge, { backgroundColor: getStatusColor() + '15' }]}>
                                <Text style={[styles.badgeText, { color: getStatusColor() }]}>{getStatusText()}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.datesContainer}>
                        {step.startedAt && (
                            <Text style={[styles.dateText, { color: theme.colors.subText }]}>
                                <MaterialIcons name="play-circle-outline" size={12} /> {t('worker.started')}: {formatDate(step.startedAt)}
                            </Text>
                        )}
                        
                        {step.completedAt && (
                            <View>
                                <Text style={[styles.dateText, { color: theme.colors.subText, marginTop: 4 }]}>
                                    <MaterialIcons name="check-circle-outline" size={12} /> {t('worker.finished')}: {formatDate(step.completedAt)}
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
            </View>

            {/* Photos */}
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

            {/* Rejection */}
            {step.approvalStatus === 'REJECTED' && step.rejectionReason && (
                <View style={[styles.rejectionContainer, { backgroundColor: theme.colors.error + '10', borderColor: theme.colors.error + '30' }]}>
                    <MaterialIcons name="error-outline" size={16} color={theme.colors.error} style={{ marginTop: 2 }} />
                    <Text style={[styles.rejectionReasonText, { color: theme.colors.error }]}>
                        {step.rejectionReason}
                    </Text>
                </View>
            )}

            {/* Manager Actions */}
            {isManager && isCompleted && step.approvalStatus === 'PENDING' && (
                <View style={styles.managerActionRow}>
                    <TouchableOpacity
                        style={[styles.managerButton, { backgroundColor: theme.colors.error + '15' }]}
                        onPress={() => {
                            setSelectedStepId(step.id);
                            setRejectionType('STEP');
                            setRejectionModalVisible(true);
                        }}
                    >
                        <MaterialIcons name="close" size={18} color={theme.colors.error} />
                        <Text style={[styles.managerButtonText, { color: theme.colors.error }]}>{t('common.reject') || 'Reddet'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.managerButton, { backgroundColor: theme.colors.success }]}
                        onPress={() => handleApproveStep(step.id)}
                    >
                        <MaterialIcons name="check" size={18} color="#fff" />
                        <Text style={[styles.managerButtonText, { color: '#fff' }]}>{t('common.approve') || 'Onayla'}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Substeps Area (Timeline style) */}
            {!isLocked && step.subSteps && step.subSteps.length > 0 && (
                <View style={styles.substepsWrapper}>
                    {/* Vertical line connecting substeps */}
                    <View style={[styles.timelineLine, { backgroundColor: theme.colors.border }]} />
                    <View style={styles.substepsContainer}>
                        {children}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    stepCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    lockedCard: {
        opacity: 0.5,
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        marginRight: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepNoBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 8,
    },
    stepNoText: {
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        flexShrink: 1,
    },
    completedText: {
        opacity: 0.6,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    datesContainer: {
        marginTop: 2,
    },
    dateText: {
        fontSize: 13,
        fontWeight: '500',
    },
    metadataTag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    metadataText: {
        fontSize: 12,
        marginLeft: 4,
    },
    photoContainer: {
        marginTop: 16,
        marginBottom: 4,
        paddingLeft: 42, // align with text
    },
    rejectionContainer: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: 42, // align with text
        gap: 8,
    },
    rejectionReasonText: {
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
        lineHeight: 18,
    },
    managerActionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        paddingLeft: 42, // align with text
    },
    managerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
    },
    managerButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    substepsWrapper: {
        marginTop: 16,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 13, // center of checkbox
        top: 0,
        bottom: 16,
        width: 2,
        borderRadius: 1,
    },
    substepsContainer: {
        paddingLeft: 42,
    },
});

export default StepItem;