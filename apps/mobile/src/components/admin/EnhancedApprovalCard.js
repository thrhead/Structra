import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Image, 
    LayoutAnimation, 
    Platform, 
    UIManager,
    TextInput,
    Modal
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ImageLightbox from '../common/ImageLightbox';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EnhancedApprovalCard = ({ item, onApprove, onReject, theme }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingItem, setRejectingItem] = useState(null);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const handleRejectClick = (targetItem) => {
        setRejectingItem(targetItem);
        setRejectModalVisible(true);
    };

    const confirmReject = () => {
        if (!rejectReason.trim()) return;
        onReject(rejectingItem || item, rejectReason);
        setRejectModalVisible(false);
        setRejectReason('');
    };

    const renderPhotos = (photos) => {
        if (!photos || photos.length === 0) return null;
        return (
            <View style={styles.photoContainer}>
                {photos.slice(0, 3).map((photo, index) => (
                    <TouchableOpacity key={index} onPress={() => setSelectedImage(photo.url)}>
                        <Image source={{ uri: photo.url }} style={styles.thumbnail} />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // If it's a STEP or SUB_STEP, we render it slightly differently
    const isStep = item.type === 'STEP' || item.type === 'SUB_STEP';

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder }]}>
            {/* Header Area */}
            <TouchableOpacity onPress={toggleExpand} style={styles.header}>
                <View style={styles.headerInfo}>
                    <View style={[styles.iconBox, { backgroundColor: isStep ? theme.colors.primary + '20' : '#f59e0b20' }]}>
                        <MaterialIcons 
                            name={item.type === 'COST' ? 'payments' : (isStep ? 'fact_check' : 'assignment')} 
                            size={20} 
                            color={isStep ? theme.colors.primary : '#f59e0b'} 
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.subText }]}>{item.requester} • {item.date}</Text>
                    </View>
                </View>
                <MaterialIcons name={expanded ? "expand-less" : "expand-more"} size={24} color={theme.colors.subText} />
            </TouchableOpacity>

            {/* Expandable Section */}
            {expanded && (
                <View style={styles.details}>
                    {item.jobTitle && (
                        <Text style={[styles.jobLink, { color: theme.colors.primary }]}>İş: {item.jobTitle}</Text>
                    )}
                    
                    {renderPhotos(item.photos)}

                    <View style={styles.actionRow}>
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.rejectButton]} 
                            onPress={() => handleRejectClick(item)}
                        >
                            <Text style={styles.rejectText}>Reddet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]} 
                            onPress={() => onApprove(item)}
                        >
                            <Text style={styles.approveText}>Onayla</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Rejection Modal */}
            <Modal
                visible={rejectModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Red Nedeni</Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.colors.cardBorder, color: theme.colors.text }]}
                            placeholder="Lütfen red nedenini yazın..."
                            placeholderTextColor={theme.colors.subText}
                            multiline
                            numberOfLines={4}
                            value={rejectReason}
                            onChangeText={setRejectReason}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setRejectModalVisible(false)} style={styles.modalCancel}>
                                <Text style={{ color: theme.colors.subText }}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={confirmReject} 
                                style={[styles.modalConfirm, { backgroundColor: '#ef4444' }]}
                            >
                                <Text style={styles.approveText}>Reddi Onayla</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ImageLightbox 
                visible={!!selectedImage} 
                imageUrl={selectedImage} 
                onClose={() => setSelectedImage(null)} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    details: {
        padding: 16,
        paddingTop: 0,
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    jobLink: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 12,
    },
    photoContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectButton: {
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    rejectText: {
        color: '#ef4444',
        fontWeight: 'bold',
    },
    approveText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalCancel: {
        padding: 12,
    },
    modalConfirm: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
    }
});

export default EnhancedApprovalCard;
