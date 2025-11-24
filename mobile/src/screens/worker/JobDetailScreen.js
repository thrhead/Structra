import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Platform, Modal, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function JobDetailScreen({ route, navigation }) {
    const { jobId } = route.params;
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        loadJobDetails();
    }, [jobId]);

    const loadJobDetails = async () => {
        try {
            // MOCK DATA - Gerçek API yerine
            const mockJob = {
                id: jobId,
                title: 'Klima Montajı - ABC Şirketi',
                customer: 'ABC Şirketi',
                phone: '0555 123 45 67',
                location: 'İstanbul, Kadıköy',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                scheduledDate: '2024-11-24',
                description: 'Merkez ofis 3. kat klima sistemlerinin montajı ve test edilmesi.',
                steps: [
                    {
                        id: 1,
                        name: 'Ön Hazırlık',
                        isCompleted: true,
                        order: 1,
                        substeps: [
                            { id: 101, name: 'Ekipman kontrolü', isCompleted: true, startTime: '24.11.2024 10:00', endTime: '24.11.2024 10:15', status: 'COMPLETED', photos: ['https://via.placeholder.com/150'] },
                            { id: 102, name: 'Güvenlik önlemleri', isCompleted: true, startTime: '24.11.2024 10:15', endTime: '24.11.2024 10:30', status: 'COMPLETED', photos: ['https://via.placeholder.com/150'] }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Montaj',
                        isCompleted: false,
                        order: 2,
                        substeps: [
                            { id: 201, name: 'İç ünite montajı', isCompleted: false, startTime: null, endTime: null, status: 'PENDING', photos: [] },
                            { id: 202, name: 'Dış ünite montajı', isCompleted: false, startTime: null, endTime: null, status: 'PENDING', photos: [] },
                            { id: 203, name: 'Boru tesisatı', isCompleted: false, startTime: null, endTime: null, status: 'PENDING', photos: [] }
                        ]
                    },
                    {
                        id: 3,
                        name: 'Test',
                        isCompleted: false,
                        order: 3,
                        substeps: [
                            { id: 301, name: 'Basınç testi', isCompleted: false, startTime: null, endTime: null, status: 'PENDING', photos: [] },
                            { id: 302, name: 'Performans testi', isCompleted: false, startTime: null, endTime: null, status: 'PENDING', photos: [] }
                        ]
                    },
                ],
            };

            setTimeout(() => {
                setJob(mockJob);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error loading job details:', error);
            Alert.alert('Hata', 'İş detayları yüklenemedi');
            setLoading(false);
        }
    };

    const handleSubstepAction = (stepId, substepId, action) => {
        setJob(prevJob => {
            const stepIndex = prevJob.steps.findIndex(s => s.id === stepId);
            const step = prevJob.steps[stepIndex];
            const substepIndex = step.substeps.findIndex(s => s.id === substepId);
            const substep = step.substeps[substepIndex];

            // KONTROLLER

            // 1. Önceki ana adım tamamlanmış mı?
            if (stepIndex > 0 && !prevJob.steps[stepIndex - 1].isCompleted) {
                Alert.alert('Uyarı', 'Önceki ana adımı tamamlamadan bu adıma geçemezsiniz.');
                return prevJob;
            }

            // 2. Önceki alt görev tamamlanmış mı?
            if (substepIndex > 0 && !step.substeps[substepIndex - 1].isCompleted) {
                Alert.alert('Uyarı', 'Önceki alt görevi tamamlamadan bu göreve başlayamazsınız.');
                return prevJob;
            }

            // İŞLEM
            const now = new Date();
            const day = now.getDate().toString().padStart(2, '0');
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const year = now.getFullYear();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const timeString = `${day}.${month}.${year} ${hours}:${minutes}`;

            let newSubstep = { ...substep };

            if (action === 'START') {
                newSubstep.status = 'IN_PROGRESS';
                newSubstep.startTime = timeString;
            } else if (action === 'COMPLETE') {
                // Min 1 photo check
                if (!substep.photos || substep.photos.length < 1) {
                    Alert.alert('Uyarı', 'Bu görevi tamamlamak için en az 1 fotoğraf yüklemelisiniz.');
                    return prevJob;
                }
                newSubstep.status = 'COMPLETED';
                newSubstep.isCompleted = true;
                newSubstep.endTime = timeString;
            }

            const newSubsteps = [...step.substeps];
            newSubsteps[substepIndex] = newSubstep;

            // Ana adımın tamamlanma kontrolü
            const allSubstepsCompleted = newSubsteps.every(s => s.isCompleted);
            let mainStepEndTime = step.endTime;

            if (allSubstepsCompleted && !step.isCompleted) {
                mainStepEndTime = timeString;
            }

            const newSteps = [...prevJob.steps];
            newSteps[stepIndex] = {
                ...step,
                substeps: newSubsteps,
                isCompleted: allSubstepsCompleted,
                endTime: mainStepEndTime
            };

            return { ...prevJob, steps: newSteps };
        });
    };

    const pickImage = async (stepId, substepId, source) => {
        console.log('pickImage called with source:', source);
        try {
            let result;
            if (source === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('İzin Gerekli', 'Kamera erişim izni vermeniz gerekiyor.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: 'Images',
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('İzin Gerekli', 'Galeri erişim izni vermeniz gerekiyor.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: 'Images',
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                });
            }

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                savePhoto(stepId, substepId, uri);
            }
        } catch (error) {
            console.error("ImagePicker error:", error);
            Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
        }
    };

    const savePhoto = (stepId, substepId, uri) => {
        setJob(prevJob => {
            const newSteps = prevJob.steps.map(step => {
                if (step.id === stepId) {
                    const newSubsteps = step.substeps.map(substep => {
                        if (substep.id === substepId) {
                            const currentPhotos = substep.photos || [];
                            return { ...substep, photos: [...currentPhotos, uri] };
                        }
                        return substep;
                    });
                    return { ...step, substeps: newSubsteps };
                }
                return step;
            });
            return { ...prevJob, steps: newSteps };
        });
    };

    const handleCompleteJob = () => {
        // Tüm adımların tamamlanıp tamamlanmadığını kontrol et
        const allStepsCompleted = job.steps.every(step => step.isCompleted);

        if (!allStepsCompleted) {
            Alert.alert("Uyarı", "İşi tamamlamak için tüm adımları bitirmelisiniz.");
            return;
        }

        // Web'de Alert.alert butonları sınırlı olabilir, bu yüzden basit confirm kullanıyoruz
        // veya direkt işlem yapıyoruz. Mobilde Alert iyidir.
        if (Platform.OS === 'web') {
            if (confirm("İşi tamamlamak istediğinize emin misiniz?")) {
                setJob(prev => ({ ...prev, status: 'COMPLETED' }));
                alert("İş tamamlandı ve onaya gönderildi.");
                navigation.goBack();
            }
        } else {
            Alert.alert(
                "İşi Tamamla",
                "İşi tamamlamak istediğinize emin misiniz?",
                [
                    { text: "İptal", style: "cancel" },
                    {
                        text: "Tamamla",
                        onPress: () => {
                            setJob(prev => ({ ...prev, status: 'COMPLETED' }));
                            Alert.alert("Başarılı", "İş tamamlandı ve onaya gönderildi.", [
                                { text: "Tamam", onPress: () => navigation.goBack() }
                            ]);
                        }
                    }
                ]
            );
        }
    };

    const openMap = (location) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        Linking.openURL(url);
    };

    const callPhone = (phone) => {
        Linking.openURL(`tel:${phone}`);
    };

    const openImageModal = (uri) => {
        setSelectedImage(uri);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#16A34A" />
            </View>
        );
    }

    if (!job) {
        return (
            <View style={styles.centerContainer}>
                <Text>İş bulunamadı.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container}>
                {/* Header Info */}
                <View style={styles.headerCard}>
                    <Text style={styles.title}>{job.title}</Text>

                    <View style={styles.row}>
                        <Text style={styles.label}>Müşteri:</Text>
                        <Text style={styles.value}>{job.customer}</Text>
                    </View>

                    {job.phone && (
                        <TouchableOpacity style={styles.row} onPress={() => callPhone(job.phone)}>
                            <Text style={styles.label}>Telefon:</Text>
                            <Text style={[styles.value, styles.linkText]}>{job.phone}</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.row} onPress={() => openMap(job.location)}>
                        <Text style={styles.label}>Konum:</Text>
                        <Text style={[styles.value, styles.linkText]}>{job.location}</Text>
                    </TouchableOpacity>

                    <Text style={styles.description}>{job.description}</Text>
                </View>

                {/* Steps & Checklist */}
                <Text style={styles.sectionTitle}>İş Adımları</Text>

                {job.steps.map((step, index) => {
                    const isLocked = index > 0 && !job.steps[index - 1].isCompleted;

                    return (
                        <View key={step.id} style={[styles.stepCard, isLocked && styles.lockedCard]}>
                            <View style={styles.stepHeader}>
                                <View style={[styles.checkbox, step.isCompleted && styles.checkedBox]}>
                                    {step.isCompleted && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={[styles.stepTitle, step.isCompleted && styles.completedText]}>
                                    {step.name}
                                </Text>
                                {isLocked && <Text style={styles.lockedText}>(Kilitli)</Text>}
                            </View>

                            {/* Substeps */}
                            {!isLocked && (
                                <View style={styles.substepsContainer}>
                                    {step.substeps.map((substep) => (
                                        <View key={substep.id} style={styles.substepWrapper}>
                                            <View style={styles.substepRow}>
                                                <View style={styles.substepInfo}>
                                                    <Text style={[styles.substepText, substep.isCompleted && styles.completedText]}>
                                                        {substep.name}
                                                    </Text>
                                                    {substep.startTime && (
                                                        <Text style={styles.timeText}>
                                                            {substep.startTime} - {substep.endTime || '...'}
                                                        </Text>
                                                    )}
                                                    {/* Photo Count Display */}
                                                    <Text style={styles.photoCountText}>
                                                        📷 {substep.photos ? substep.photos.length : 0}/3
                                                    </Text>
                                                </View>

                                                {/* Photo Buttons */}
                                                <View style={styles.photoButtonsContainer}>
                                                    <TouchableOpacity
                                                        style={[styles.photoIconBtn, (substep.photos?.length >= 3 || substep.status === 'COMPLETED') && styles.disabledBtn]}
                                                        onPress={() => pickImage(step.id, substep.id, 'camera')}
                                                        disabled={substep.photos?.length >= 3 || substep.status === 'COMPLETED'}
                                                    >
                                                        <Text style={styles.photoIconText}>📷</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.photoIconBtn, (substep.photos?.length >= 3 || substep.status === 'COMPLETED') && styles.disabledBtn]}
                                                        onPress={() => pickImage(step.id, substep.id, 'gallery')}
                                                        disabled={substep.photos?.length >= 3 || substep.status === 'COMPLETED'}
                                                    >
                                                        <Text style={styles.photoIconText}>🖼️</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Action Buttons */}
                                                <View style={styles.actionButtons}>
                                                    {substep.status === 'PENDING' && (
                                                        <TouchableOpacity
                                                            style={styles.startButton}
                                                            onPress={() => handleSubstepAction(step.id, substep.id, 'START')}
                                                        >
                                                            <Text style={styles.btnText}>Başla</Text>
                                                        </TouchableOpacity>
                                                    )}

                                                    {substep.status === 'IN_PROGRESS' && (
                                                        <TouchableOpacity
                                                            style={styles.completeButton}
                                                            onPress={() => handleSubstepAction(step.id, substep.id, 'COMPLETE')}
                                                        >
                                                            <Text style={styles.btnText}>Bitir</Text>
                                                        </TouchableOpacity>
                                                    )}

                                                    {substep.status === 'COMPLETED' && (
                                                        <View style={styles.completedBadge}>
                                                            <Text style={styles.completedBadgeText}>Tamam</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>

                                            {/* Uploaded Photos Thumbnails */}
                                            {substep.photos && substep.photos.length > 0 && (
                                                <ScrollView horizontal style={styles.thumbnailsContainer} showsHorizontalScrollIndicator={false}>
                                                    {substep.photos.map((photoUri, pIndex) => (
                                                        <TouchableOpacity key={pIndex} onPress={() => openImageModal(photoUri)}>
                                                            <Image source={{ uri: photoUri }} style={styles.thumbnail} />
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.mainCompleteButton, job.status === 'COMPLETED' && styles.disabledButton]}
                        onPress={handleCompleteJob}
                        disabled={job.status === 'COMPLETED'}
                    >
                        <Text style={styles.mainCompleteButtonText}>
                            {job.status === 'COMPLETED' ? "İş Tamamlandı" : "İşi Tamamla"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Image Viewer Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Kapat</Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#111827',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 80,
        fontWeight: '600',
        color: '#4B5563',
    },
    value: {
        flex: 1,
        color: '#111827',
    },
    description: {
        marginTop: 8,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
        marginBottom: 12,
        color: '#374151',
    },
    stepCard: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        // Shadow fix for Web/RN
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            }
        })
    },
    lockedCard: {
        opacity: 0.6,
        backgroundColor: '#F9FAFB',
    },
    stepHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 12,
        flex: 1,
    },
    lockedText: {
        fontSize: 12,
        color: '#EF4444',
        fontStyle: 'italic',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedBox: {
        backgroundColor: '#16A34A',
        borderColor: '#16A34A',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    substepsContainer: {
        marginLeft: 10,
        marginBottom: 12,
        borderLeftWidth: 2,
        borderLeftColor: '#E5E7EB',
        paddingLeft: 10,
    },
    substepWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 12,
    },
    substepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    substepInfo: {
        flex: 1,
        marginRight: 10,
    },
    substepText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '500',
    },
    timeText: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
    },
    completedText: {
        color: '#9CA3AF',
        textDecorationLine: 'line-through',
    },
    actionButtons: {
        width: 80,
        alignItems: 'flex-end',
    },
    startButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    completeButton: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    completedBadge: {
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    completedBadgeText: {
        color: '#059669',
        fontSize: 12,
        fontWeight: 'bold',
    },
    btnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    photoButtonsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    photoIconBtn: {
        padding: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        marginLeft: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: {
        opacity: 0.5,
    },
    photoIconText: {
        fontSize: 16,
    },
    photoCountText: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
        fontWeight: '500',
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    thumbnail: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 8,
        backgroundColor: '#E5E7EB',
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
    },
    mainCompleteButton: {
        backgroundColor: '#16A34A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    mainCompleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
    },
    linkText: {
        color: '#2563EB',
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: '90%',
        height: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        padding: 10,
        zIndex: 1,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
