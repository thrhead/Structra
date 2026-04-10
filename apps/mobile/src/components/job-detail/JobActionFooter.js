import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';

import CustomSpinner from '../../components/CustomSpinner';
const JobActionFooter = ({ 
    theme, 
    user, 
    job, 
    completing, 
    handleStartJob, 
    handleCompleteJob, 
    setRejectionType, 
    setRejectionModalVisible, 
    handleAcceptJob, 
    t 
}) => {
    const isWorker = !['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase());
    const isAdminOrManager = ['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase());

    if (!job) return null;

    return (
        <View style={[styles.footerContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
            {isWorker ? (
                job.status === 'PENDING' ? (
                    <TouchableOpacity
                        style={[styles.mainCompleteButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleStartJob}
                    >
                        <Text style={[styles.mainCompleteButtonText, { color: theme.colors.textInverse }]}>{t('worker.startJob')}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.mainCompleteButton,
                            (job.status === 'COMPLETED' || job.status === 'PENDING_APPROVAL' || completing) && styles.disabledButton,
                            { backgroundColor: (job.status === 'COMPLETED' || job.status === 'PENDING_APPROVAL' || completing) ? theme.colors.border : theme.colors.primary }
                        ]}
                        onPress={handleCompleteJob}
                        disabled={job.status === 'COMPLETED' || job.status === 'PENDING_APPROVAL' || completing}
                    >
                        {completing ? (
                            <CustomSpinner color={theme.colors.textInverse} />
                        ) : (
                            <Text style={[styles.mainCompleteButtonText, { color: theme.colors.textInverse }]}>
                                {job.status === 'COMPLETED' ? t('common.success') :
                                    job.status === 'PENDING_APPROVAL' ? "Onay Bekliyor" :
                                        t('worker.completeJob')}
                            </Text>
                        )}
                    </TouchableOpacity>
                )
            ) : (
                <View style={{ width: '100%' }}>
                    <View style={[styles.acceptanceStatusContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                        <Text style={[styles.acceptanceStatusLabel, { color: theme.colors.text }]}>Montaj Onay Durumu:</Text>
                        <Text style={[
                            styles.acceptanceStatusValue,
                            job.acceptanceStatus === 'ACCEPTED' ? { color: theme.colors.success } :
                                (job.status === 'PENDING_APPROVAL') ? { color: theme.colors.warning } :
                                    job.acceptanceStatus === 'REJECTED' ? { color: theme.colors.error } : { color: theme.colors.subText }
                        ]}>
                            {job.acceptanceStatus === 'ACCEPTED' ? 'ONAYLANMIŞ' :
                                job.acceptanceStatus === 'REJECTED' ? 'REDDEDİLMİŞ' :
                                    job.status === 'PENDING_APPROVAL' ? 'ONAY BEKLİYOR' : 'MONTAJ DEVAM EDİYOR'}
                        </Text>
                    </View>
                    {job.acceptanceStatus === 'PENDING' && (job.status === 'COMPLETED' || job.status === 'PENDING_APPROVAL') && (
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <TouchableOpacity
                                style={[styles.mainCompleteButton, styles.rejectButton, { flex: 1, backgroundColor: theme.colors.error }]}
                                onPress={() => {
                                    setRejectionType('JOB');
                                    setRejectionModalVisible(true);
                                }}
                            >
                                <Text style={[styles.mainCompleteButtonText, { color: theme.colors.textInverse }]}>Reddet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.mainCompleteButton, styles.acceptJobButton, { flex: 1, backgroundColor: theme.colors.success }]}
                                onPress={handleAcceptJob}
                            >
                                <Text style={[styles.mainCompleteButtonText, { color: theme.colors.textInverse }]}>Kabul Et</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
    },
    mainCompleteButton: {
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mainCompleteButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.8,
    },
    acceptanceStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    acceptanceStatusLabel: {
        fontWeight: '600',
        fontSize: 14,
    },
    acceptanceStatusValue: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    rejectButton: {
        padding: 12,
    },
    acceptJobButton: {
        padding: 12,
    },
});

export default JobActionFooter;
