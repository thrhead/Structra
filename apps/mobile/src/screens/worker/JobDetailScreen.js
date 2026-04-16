'use client'

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Image,
    StatusBar,
    Share
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import jobService from '../../services/job.service';
import costService from '../../services/cost.service';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getValidImageUrl } from '../../utils';
import { useSocket } from '../../context/SocketContext';
import { useTranslation } from 'react-i18next';
import { useAlert } from '../../context/AlertContext';
import { API_URL } from '../../config';
import { LoggerService } from '../../services/LoggerService';

// Components
import JobInfoCard from '../../components/job-detail/JobInfoCard';
import CostSection from '../../components/job-detail/CostSection';
import GlassCard from '../../components/ui/GlassCard';
import JobDetailHeader from '../../components/job-detail/JobDetailHeader';
import StepItem from '../../components/job-detail/StepItem';
import SubStepItem from '../../components/job-detail/SubStepItem';
import JobActionFooter from '../../components/job-detail/JobActionFooter';
import JobDetailModals from '../../components/job-detail/JobDetailModals';
import LoadingOverlay from '../../components/common/LoadingOverlay';

import CustomSpinner from '../../components/CustomSpinner';
export default function JobDetailScreen({ route, navigation }) {
    const { jobId } = route.params;
    const { user } = useAuth();
    const { theme, isDark } = useTheme();
    const { t, i18n } = useTranslation();
    const { showAlert } = useAlert();
    const { socket, joinJobRoom, leaveJobRoom } = useSocket();

    // State
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [completing, setCompleting] = useState(false);
    
    // Modals Visibility
    const [modalVisible, setModalVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [signatureModalVisible, setSignatureModalVisible] = useState(false);
    const [choiceModalVisible, setChoiceModalVisible] = useState(false);
    const [costModalVisible, setCostModalVisible] = useState(false);
    const [rejectionModalVisible, setRejectionModalVisible] = useState(false);

    // Data State
    const [selectedImage, setSelectedImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionType, setRejectionType] = useState('JOB'); // 'JOB', 'STEP', 'SUBSTEP'
    const [selectedStepId, setSelectedStepId] = useState(null);
    const [selectedSubstepId, setSelectedSubstepId] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useFocusEffect(
        React.useCallback(() => {
            loadJobDetails();

            if (!socket) return;
            joinJobRoom(jobId);

            const handleJobUpdate = (data) => {
                if (modalVisible || costModalVisible || rejectionModalVisible) {
                    loadJobDetails();
                    return;
                }
                showAlert(
                    t('common.info'),
                    "Bu iş başka bir kullanıcı tarafından güncellendi.",
                    [{ text: "Yenile", onPress: () => loadJobDetails() }],
                    'info'
                );
            };

            socket.on('job:updated', handleJobUpdate);

            return () => {
                socket.off('job:updated', handleJobUpdate);
                leaveJobRoom(jobId);
            };
        }, [jobId, socket, modalVisible, costModalVisible, rejectionModalVisible])
    );

    const loadJobDetails = async () => {
        try {
            setLoading(true);
            const data = await jobService.getJobById(jobId);
            if (data.id) {
                setJob(data);
            } else if (data.job) {
                setJob(data.job);
            } else {
                showAlert(t('common.error'), t('alerts.jobNotFound'), [], 'error');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error loading job details:', error);
            showAlert(t('common.error'), t('alerts.detailsLoadError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            const role = user?.role?.toUpperCase();
            if (role === 'ADMIN') navigation.navigate('AdminDashboard');
            else if (role === 'MANAGER') navigation.navigate('ManagerDashboard');
            else navigation.navigate('WorkerDashboard');
        }
    };

    const openImageModal = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };

    const handleDeletePhoto = (photo) => {
        if (!photo || !photo.id) return;

        showAlert(
            t('common.warning'),
            t('alerts.deletePhotoConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            if (!photo.stepId) throw new Error("Fotoğraf bilgisi eksik (Step ID)");
                            await jobService.deletePhoto(jobId, photo.stepId, photo.id);
                            setModalVisible(false);
                            loadJobDetails();
                            showAlert(t('common.success'), t('alerts.deleteSuccess'), [], 'success');
                        } catch (error) {
                            console.error('[Mobile] Delete photo error:', error);
                            showAlert(t('common.error'), t('alerts.processError'), [], 'error');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleSubstepToggle = async (stepId, substepId, currentStatus) => {
        try {
            setLoading(true);
            if (!currentStatus) {
                const step = job.steps.find(s => s.id === stepId);
                const substep = step?.subSteps.find(ss => ss.id === substepId);
                const hasPhotos = substep?.photos && Array.isArray(substep.photos) && substep.photos.length > 0;

                if (!hasPhotos) {
                    showAlert(
                        t('common.warning'),
                        "Bu iş emrini kapatabilmeniz için öncelikle en az 1 adet fotoğraf yüklemeniz gerekmektedir",
                        [],
                        'warning'
                    );
                    return;
                }
            }
            await jobService.toggleSubstep(jobId, stepId, substepId, !currentStatus, job.updatedAt);
            loadJobDetails();
            } catch (error) {
            console.error('Substep toggle error:', error);
            showAlert(t('common.error'), t('alerts.processError'), [], 'error');
            } finally {
            setLoading(false);
            }
            };


    const handleToggleStep = async (stepId, currentStatus) => {
        try {
            setLoading(true);
            await jobService.toggleStep(jobId, stepId, !currentStatus, job.updatedAt);
            loadJobDetails();
        } catch (error) {
            console.error('Step toggle error:', error);
            showAlert(t('common.error'), t('alerts.processError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };


    const optimizeImage = async (uri) => {
        try {
            const result = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1200 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );
            return result;
        } catch (error) {
            console.error("Image optimization error:", error);
            return null;
        }
    };

    const pickImage = async (stepId, substepId, source) => {
        try {
            const mediaTypes = ImagePicker.MediaTypeOptions ? ImagePicker.MediaTypeOptions.Images : 'Images';
            let result;
            if (source === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    showAlert(t('alerts.permissionRequired'), t('alerts.cameraPermissionDesc'), [], 'warning');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.3,
                    base64: true,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    showAlert(t('alerts.permissionRequired'), t('alerts.galleryPermissionDesc'), [], 'warning');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.3,
                    base64: true,
                });
            }

            if (!result.canceled) {
                setUploading(true);
                const optimized = await optimizeImage(result.assets[0].uri);
                uploadPhoto(stepId, substepId, optimized ? optimized.uri : result.assets[0].uri, optimized ? optimized.base64 : result.assets[0].base64);
            }
        } catch (error) {
            console.error("ImagePicker error:", error);
            showAlert(t('common.error'), t('alerts.photoSelectError'), [], 'error');
            setUploading(false);
        }
    };

    const uploadPhoto = async (stepId, substepId, uri, base64) => {
        try {
            setUploading(true);
            const formData = new FormData();
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image/jpeg`;
            if (type === 'image/jpg') type = 'image/jpeg';

            formData.append('photo', { uri, name: filename, type });
            await jobService.uploadPhotos(jobId, stepId, formData, substepId, base64);

            setSuccessMessage(t('alerts.photoUploadSuccess'));
            setSuccessModalVisible(true);
            await loadJobDetails();
        } catch (error) {
            console.error('Error uploading photo:', error);
            showAlert(t('common.error'), t('alerts.photoUploadError'), [], 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleApproveStep = async (stepId) => {
        try {
            setLoading(true);
            await jobService.approveStep(stepId);
            LoggerService.audit('Job step approved', { jobId, stepId });
            showAlert(t('common.success'), t('alerts.stepApproveSuccess'), [], 'success');
            loadJobDetails();
        } catch (error) {
            console.error('Error approving step:', error);
            showAlert(t('common.error'), t('alerts.stepApproveError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectStep = async () => {
        if (!rejectionReason) {
            showAlert(t('common.warning'), t('alerts.rejectionReasonRequired'), [], 'warning');
            return;
        }
        try {
            setLoading(true);
            await jobService.rejectStep(selectedStepId, rejectionReason);
            showAlert(t('common.success'), t('alerts.stepRejectSuccess'), [], 'success');
            setRejectionModalVisible(false);
            setRejectionReason('');
            setSelectedStepId(null);
            loadJobDetails();
        } catch (error) {
            console.error('Error rejecting step:', error);
            showAlert(t('common.error'), t('alerts.stepRejectError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveSubstep = async (substepId) => {
        try {
            setLoading(true);
            await jobService.approveSubstep(substepId);
            showAlert(t('common.success'), t('alerts.stepApproveSuccess'), [], 'success');
            loadJobDetails();
        } catch (error) {
            console.error('Error approving substep:', error);
            showAlert(t('common.error'), t('alerts.processError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectSubstep = async () => {
        if (!rejectionReason) {
            showAlert(t('common.warning'), t('alerts.rejectionReasonRequired'), [], 'warning');
            return;
        }
        try {
            setLoading(true);
            await jobService.rejectSubstep(selectedSubstepId, rejectionReason);
            showAlert(t('common.success'), t('alerts.stepRejectSuccess'), [], 'success');
            setRejectionModalVisible(false);
            setRejectionReason('');
            setSelectedSubstepId(null);
            loadJobDetails();
        } catch (error) {
            console.error('Error rejecting substep:', error);
            showAlert(t('common.error'), t('alerts.stepRejectError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectJob = async () => {
        if (!rejectionReason) {
            showAlert(t('common.warning'), t('alerts.rejectionReasonRequired'), [], 'warning');
            return;
        }
        try {
            setLoading(true);
            await jobService.rejectJob(jobId, rejectionReason);
            showAlert(t('common.success'), t('alerts.stepRejectSuccess'), [], 'success');
            setRejectionReason('');
            setRejectionModalVisible(false);
            loadJobDetails();
        } catch (error) {
            console.error('Error rejecting job:', error);
            showAlert(t('common.error'), t('alerts.processError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async () => {
        showAlert(
            t('common.delete'),
            t('common.confirmDelete') || "Bu işi tamamen silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await jobService.deleteJob(jobId);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting job:', error);
                            showAlert(t('common.error'), "İş silinemedi.", [], 'error');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ],
            'question'
        );
    };

    const handleStartJob = async () => {
        try {
            setLoading(true);
            await jobService.startJob(jobId, job.updatedAt || new Date().toISOString());
            LoggerService.audit('Job started', { jobId, jobTitle: job.title, workerId: user.id });
            showAlert(t('common.success'), t('alerts.jobStartSuccess'), [], 'success');
            loadJobDetails();
        } catch (error) {
            console.error('Error starting job:', error);
            showAlert(t('common.error'), error.message || t('alerts.jobStartError'), [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteJob = async () => {
        try {
            console.log('[MOBILE] handleCompleteJob triggered for job:', jobId);
            if (!job || !job.steps) {
                console.log('[MOBILE] Job or job.steps is missing');
                return;
            }
            
            const allStepsCompleted = job.steps.length > 0 && job.steps.every(step => {
                const anaAdimTamam = step.isCompleted === true || step.status === 'COMPLETED';
                const altAdimlarTamam = !step.subSteps || step.subSteps.length === 0 || step.subSteps.every(ss => ss.isCompleted === true || ss.status === 'COMPLETED');
                return anaAdimTamam && altAdimlarTamam;
            });
            
            console.log('[MOBILE] allStepsCompleted status:', allStepsCompleted);

            if (!allStepsCompleted) {
                showAlert(t('common.warning') || 'Uyarı', "Bu montajı tamamlayarak kapatmak için tüm alt iş emirlerini tamamlamanız gerekiyor", [], 'warning');
                return;
            }
            
            console.log('[MOBILE] Showing choice modal for job completion');
            setChoiceModalVisible(true);
        } catch (error) {
            console.error('[MOBILE] handleCompleteJob error:', error);
            showAlert('Hata', 'İşlem sırasında bir hata oluştu.', [], 'error');
        }
    };

    const handleConfirmComplete = async () => {
        try {
            setCompleting(true);
            setConfirmationModalVisible(false);
            await jobService.completeJob(jobId, job.signature || null, job.signatureCoords || null, job.updatedAt);
            LoggerService.audit('Job completed by worker', { jobId, jobTitle: job.title });
            setSuccessMessage("İş başarıyla bitirildi ve admin onayına gönderildi.");
            setSuccessModalVisible(true);
            loadJobDetails();
        } catch (error) {
            console.error('Error completing job:', error);
            showAlert(t('common.error'), "İş tamamlanırken bir hata oluştu.", [], 'error');
        } finally {
            setCompleting(false);
        }
    };

    const handleSaveSignature = async (signatureBase64) => {
        setSignatureModalVisible(false);
        setConfirmationModalVisible(true);
        let location = null;
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const currentPosition = await Location.getCurrentPositionAsync({});
                location = { latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude };
            }
        } catch (error) { console.error('Error getting location for signature:', error); }
        setJob(prev => ({ ...prev, signature: signatureBase64, signatureCoords: location }));
    };

    const handleAcceptJob = async () => {
        showAlert(
            t('common.confirm'),
            t('alerts.completeJobConfirm'),
            [
                { text: t('common.cancel'), style: "cancel" },
                {
                    text: t('common.confirm'),
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await jobService.acceptJob(jobId);
                            showAlert(t('common.success'), t('alerts.stepApproveSuccess'), [], 'success');
                            loadJobDetails();
                        } catch (error) {
                            console.error('Error accepting job:', error);
                            showAlert(t('common.error'), t('alerts.processError'), [], 'error');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ],
            'question'
        );
    };

    const createExpense = async (formData, receiptImage, audioUri) => {
        try {
            const data = new FormData();
            data.append('jobId', formData.jobId);
            data.append('amount', parseFloat(formData.amount).toString());
            data.append('currency', 'TRY');
            data.append('category', formData.category);
            data.append('description', formData.description ? `${formData.title} - ${formData.description}` : formData.title);
            data.append('date', formData.date.toISOString());

            if (receiptImage) {
                if (Platform.OS === 'web') {
                    const response = await fetch(receiptImage);
                    const blob = await response.blob();
                    const filename = receiptImage.split('/').pop() || 'receipt.jpg';
                    data.append('receipt', blob, filename);
                } else {
                    const filename = receiptImage.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : 'image/jpeg';
                    data.append('receipt', { uri: receiptImage, name: filename, type });
                }
            }
            if (audioUri) {
                if (Platform.OS === 'web') {
                    const response = await fetch(audioUri);
                    const blob = await response.blob();
                    const filename = audioUri.split('/').pop() || 'audio.m4a';
                    data.append('audio', blob, filename);
                } else {
                    const filename = audioUri.split('/').pop();
                    data.append('audio', { uri: audioUri, name: filename, type: 'audio/m4a' });
                }
            }
            await costService.create(data);
            setSuccessMessage(t('common.success'));
            setSuccessModalVisible(true);
            setCostModalVisible(false);
            loadJobDetails();
            return true;
        } catch (error) {
            console.error('Error creating cost:', error);
            showAlert(t('common.error'), t('alerts.processError'), [], 'error');
            return false;
        }
    };

    const handleExportProforma = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.get(`${API_URL}/api/v1/jobs/${jobId}/proforma`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = response.data;
            const itemsText = data.items.map(i => `- ${i.description}: ₺${i.price}`).join('\n');
            const total = data.items.reduce((sum, i) => sum + i.price, 0);
            const shareMessage = `PROFORMA FATURA (#${data.id.slice(-6).toUpperCase()})\n--------------------------------\nMüşteri: ${data.customer.company}\nİş: ${data.title}\nTarih: ${new Date().toLocaleDateString('tr-TR')}\n\nHİZMETLER:\n${itemsText}\n\nGENEL TOPLAM: ₺${(total * 1.2).toLocaleString('tr-TR')} (KDV Dahil)\n--------------------------------\nAssembly Tracker Ltd. Şti.`;
            await Share.share({ message: shareMessage, title: 'Proforma Fatura' });
        } catch (error) {
            console.error('Proforma export error:', error);
            showAlert(t('common.error'), 'Dosya paylaşılamadı.', [], 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderPhotoItem = ({ item }) => (
        <TouchableOpacity onPress={() => openImageModal(item)} style={styles.thumbnailWrapper}>
            <Image
                source={{ uri: getValidImageUrl(item.url || item) }}
                style={styles.thumbnail}
            />
        </TouchableOpacity>
    );

    if (loading && !job) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.centerContainer}>
                    <CustomSpinner size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
            
            <JobDetailHeader 
                theme={theme} 
                t={t} 
                handleBack={handleBack} 
                job={job} 
                user={user} 
                navigation={navigation}
                handleDeleteJob={handleDeleteJob}
                handleExportProforma={handleExportProforma}
            />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {job && (
                    <>
                        {/* Status Alert for Manager Approval */}
                        {['ADMIN', 'MANAGER'].includes(user?.role?.toUpperCase()) && job.status === 'PENDING_APPROVAL' && (
                            <GlassCard style={[styles.statusCard, { borderColor: theme.colors.warning }]} theme={theme}>
                                <View style={styles.statusHeader}>
                                    <MaterialIcons name="info-outline" size={24} color={theme.colors.warning} />
                                    <Text style={[styles.statusTitle, { color: theme.colors.text }]}>{t('common.pendingApproval')}</Text>
                                </View>
                                <Text style={[styles.statusText, { color: theme.colors.subText }]}>
                                    Bu iş tamamlandı ve yönetici onayını bekliyor.
                                </Text>
                            </GlassCard>
                        )}

                        <JobInfoCard job={job} />

                        <CostSection
                            job={job}
                            canAdd={['WORKER', 'TEAM_LEAD'].includes(user?.role?.toUpperCase())}
                            onAddPress={() => setCostModalVisible(true)}
                        />

                        {/* Job Responsible Section */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>İş Sorumlusu</Text>
                        <GlassCard style={styles.responsibleCard} theme={theme}>
                            <View style={styles.responsibleInfo}>
                                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary + '20' }]}>
                                    <MaterialIcons name="person" size={24} color={theme.colors.primary} />
                                </View>
                                <View style={styles.responsibleTextContent}>
                                    <Text style={[styles.responsibleName, { color: theme.colors.text }]}>
                                        {job.jobLead?.name || 'Atanmamış'}
                                    </Text>
                                    <Text style={[styles.responsibleRole, { color: theme.colors.subText }]}>ANA SORUMLU</Text>
                                </View>
                            </View>
                        </GlassCard>

                        {/* Teams Section */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('navigation.teams')}</Text>
                        {job.assignments && job.assignments.length > 0 ? (
                            job.assignments.map((assignment, index) => (
                                <GlassCard key={index} style={styles.assignmentCard} theme={theme}>
                                    <View style={styles.assignmentHeader}>
                                        <MaterialIcons name="groups" size={20} color={theme.colors.primary} />
                                        <Text style={[styles.teamName, { color: theme.colors.text }]}>
                                            {assignment.team ? assignment.team.name : (assignment.worker?.name || 'Ekip')}
                                        </Text>
                                    </View>
                                    {assignment.team?.members && assignment.team.members.length > 0 && (
                                        <View style={styles.memberList}>
                                            {assignment.team.members.filter(m => m.user.id !== job.jobLead?.id).map((member, mIdx) => (
                                                <View key={mIdx} style={[styles.memberBadge, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                                                    <Text style={[styles.memberName, { color: theme.colors.text }]}>{member.user.name}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </GlassCard>
                            ))
                        ) : (
                            <Text style={[styles.emptyText, { color: theme.colors.subText }]}>{t('recentJobs.noJobs')}</Text>
                        )}

                        {/* Steps Section */}
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('worker.steps')}</Text>
                        {job.steps && job.steps.map((step, index) => (
                            <StepItem
                                key={step.id}
                                step={step}
                                index={index}
                                job={job}
                                theme={theme}
                                user={user}
                                t={t}
                                formatDate={formatDate}
                                handleToggleStep={handleToggleStep}
                                openImageModal={openImageModal}
                                renderPhotoItem={renderPhotoItem}
                                handleApproveStep={handleApproveStep}
                                setRejectionType={setRejectionType}
                                setSelectedStepId={setSelectedStepId}
                                setRejectionModalVisible={setRejectionModalVisible}
                            >
                                {step.subSteps && step.subSteps.map((substep, subIndex) => (
                                    <SubStepItem
                                        key={substep.id}
                                        substep={substep}
                                        subIndex={subIndex}
                                        step={step}
                                        theme={theme}
                                        user={user}
                                        t={t}
                                        handleSubstepToggle={handleSubstepToggle}
                                        pickImage={pickImage}
                                        renderPhotoItem={renderPhotoItem}
                                        handleApproveSubstep={handleApproveSubstep}
                                        setSelectedSubstepId={setSelectedSubstepId}
                                        setRejectionType={setRejectionType}
                                        setRejectionModalVisible={setRejectionModalVisible}
                                    />
                                ))}
                            </StepItem>
                        ))}

                        {/* Signature Preview */}
                        {job.signatureUrl && (
                            <>
                                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('common.confirm')}</Text>
                                <GlassCard style={styles.signatureCard} theme={theme}>
                                    <Image 
                                        source={{ uri: job.signatureUrl }} 
                                        style={styles.signatureImage} 
                                        resizeMode="contain" 
                                    />
                                    <View style={styles.signatureFooter}>
                                        <View style={styles.metaRow}>
                                            <MaterialIcons name="schedule" size={14} color={theme.colors.subText} />
                                            <Text style={[styles.metaText, { color: theme.colors.subText }]}>
                                                {job.completedDate ? formatDate(job.completedDate) : formatDate(new Date())}
                                            </Text>
                                        </View>
                                        {job.signatureLatitude && (
                                            <View style={styles.metaRow}>
                                                <MaterialIcons name="place" size={14} color={theme.colors.subText} />
                                                <Text style={[styles.metaText, { color: theme.colors.subText }]}>
                                                    {job.signatureLatitude.toFixed(6)}, {job.signatureLongitude.toFixed(6)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </GlassCard>
                            </>
                        )}

                        <View style={styles.spacing} />
                    </>
                )}
            </ScrollView>

            <JobActionFooter 
                theme={theme} 
                user={user} 
                job={job} 
                completing={completing}
                handleStartJob={handleStartJob}
                handleCompleteJob={handleCompleteJob}
                setRejectionType={setRejectionType}
                setRejectionModalVisible={setRejectionModalVisible}
                handleAcceptJob={handleAcceptJob}
                t={t}
            />

            <JobDetailModals 
                theme={theme}
                t={t}
                jobId={jobId}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                selectedImage={selectedImage}
                handleDeletePhoto={handleDeletePhoto}
                rejectionModalVisible={rejectionModalVisible}
                setRejectionModalVisible={setRejectionModalVisible}
                rejectionType={rejectionType}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                handleRejectStep={handleRejectStep}
                handleRejectSubstep={handleRejectSubstep}
                handleRejectJob={handleRejectJob}
                successModalVisible={successModalVisible}
                setSuccessModalVisible={setSuccessModalVisible}
                successMessage={successMessage}
                choiceModalVisible={choiceModalVisible}
                setChoiceModalVisible={setChoiceModalVisible}
                setSignatureModalVisible={setSignatureModalVisible}
                setConfirmationModalVisible={setConfirmationModalVisible}
                setJob={setJob}
                confirmationModalVisible={confirmationModalVisible}
                handleConfirmComplete={handleConfirmComplete}
                costModalVisible={costModalVisible}
                setCostModalVisible={setCostModalVisible}
                createExpense={createExpense}
                signatureModalVisible={signatureModalVisible}
                handleSaveSignature={handleSaveSignature}
            />

            <LoadingOverlay 
                visible={(loading && job !== null) || uploading || completing} 
                message={uploading ? t('common.uploading') : t('common.pleaseWait')}
                theme={theme}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
    statusCard: { padding: 16, borderRadius: 16, borderLeftWidth: 4, marginBottom: 16 },
    statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    statusTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    statusText: { fontSize: 14 },
    responsibleCard: { padding: 16, borderRadius: 16, marginBottom: 8 },
    responsibleInfo: { flexDirection: 'row', alignItems: 'center' },
    avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    responsibleTextContent: { marginLeft: 12 },
    responsibleName: { fontSize: 16, fontWeight: 'bold' },
    responsibleRole: { fontSize: 11, fontWeight: '700', marginTop: 2 },
    assignmentCard: { padding: 16, borderRadius: 16, marginBottom: 8 },
    assignmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    teamName: { fontSize: 15, fontWeight: 'bold', marginLeft: 8 },
    memberList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    memberBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
    memberName: { fontSize: 12 },
    emptyText: { fontSize: 14, fontStyle: 'italic', marginLeft: 4 },
    thumbnailWrapper: { marginRight: 10, marginBottom: 5 },
    thumbnail: { width: 70, height: 70, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    signatureCard: { padding: 16, borderRadius: 20, marginBottom: 16 },
    signatureImage: { width: '100%', height: 120, backgroundColor: '#fff', borderRadius: 12 },
    signatureFooter: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: 12 },
    spacing: { height: 40 },
});
