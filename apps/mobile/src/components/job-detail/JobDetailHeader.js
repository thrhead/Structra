import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const JobDetailHeader = ({ 
    theme, 
    t, 
    handleBack, 
    job, 
    user, 
    navigation, 
    handleDeleteJob, 
    handleExportProforma 
}) => {
    const isManager = ['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase());
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    return (
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            
            <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
                {t('worker.jobDetails')}
            </Text>
            
            <View style={styles.rightActions}>
                {job && isManager && (
                    <>
                        {isAdmin && (
                            <TouchableOpacity onPress={handleDeleteJob} style={styles.actionButton}>
                                <MaterialIcons name="delete" size={24} color={theme.colors.error} />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('EditJob', { job })}
                            style={styles.actionButton}
                        >
                            <MaterialIcons name="edit" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleExportProforma} style={styles.actionButton}>
                            <MaterialIcons name="description" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </>
                )}
                
                {job && (
                    <>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Assembly3D', { steps: job.steps || [], jobTitle: job.title })}
                            style={styles.actionButton}
                        >
                            <MaterialIcons name="view-in-ar" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Chat', { jobId: job.id, jobTitle: job.title })}
                            style={styles.actionButton}
                        >
                            <MaterialIcons name="chat" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        flex: 1,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionButton: {
        padding: 4,
    },
});

export default JobDetailHeader;
