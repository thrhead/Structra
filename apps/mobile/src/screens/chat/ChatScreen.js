import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
    Image
} from 'react-native';
import { Send, Lock, CheckCheck, ChevronLeft, User as UserIcon } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAbly } from '../../context/AblyContext';
import { CryptoService } from '../../services/crypto-service';

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { jobId, jobTitle } = route.params || {};
    const { getChannel, isConnected } = useAbly();

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isTyping, setIsTyping] = useState([]);
    const [onlineCount, setOnlineCount] = useState(0);

    const channelRef = useRef(null);
    const flatListRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        const channel = getChannel(`job:${jobId}`);
        if (channel) {
            channelRef.current = channel;

            // Subscribe to messages
            channel.subscribe('message', async (msg) => {
                const newMessage = msg.data;
                if (newMessage.isEncrypted) {
                    newMessage.content = await CryptoService.decrypt(newMessage.content);
                }
                setMessages(prev => {
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });

                if (newMessage.senderId !== currentUser?.id) {
                    markAsRead(newMessage.id);
                }
            });

            // Presence
            channel.presence.enter();
            channel.presence.subscribe('enter', () => updateOnlineCount());
            channel.presence.subscribe('leave', () => updateOnlineCount());
            updateOnlineCount();

            // Typing
            channel.subscribe('typing:start', (msg) => {
                if (msg.clientId !== currentUser?.id) {
                    const name = msg.data.userName || 'Biri';
                    setIsTyping(prev => [...new Set([...prev, name])]);
                }
            });
            channel.subscribe('typing:stop', (msg) => {
                const name = msg.data.userName || 'Biri';
                setIsTyping(prev => prev.filter(n => n !== name));
            });

            // Read Status
            channel.subscribe('message:read', (msg) => {
                const { messageId, readAt } = msg.data;
                setMessages(prev => prev.map(m =>
                    m.id === messageId ? { ...m, readAt } : m
                ));
            });
        }

        return () => {
            if (channelRef.current) {
                channelRef.current.presence.leave();
                channelRef.current.unsubscribe();
            }
        };
    }, [jobId, isConnected, currentUser]);

    const updateOnlineCount = () => {
        channelRef.current?.presence.get((err, members) => {
            if (!err && members) setOnlineCount(members.length);
        });
    };

    const loadInitialData = async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
            }

            const response = await fetch(`https://compilation-scripts-root-guitars.trycloudflare.com/webhook-test/get-messages?jobId=${jobId}`);
            if (response.ok) {
                const data = await response.json();
                const processed = await Promise.all(data.map(async (msg) => {
                    if (msg.isEncrypted) {
                        msg.content = await CryptoService.decrypt(msg.content);
                    }
                    return msg;
                }));
                setMessages(processed);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to load chat data:', error);
            setLoading(false);
        }
    };

    const handleTyping = (text) => {
        setInputText(text);
        if (channelRef.current && currentUser) {
            channelRef.current.publish('typing:start', { userName: currentUser.name });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                channelRef.current.publish('typing:stop', { userName: currentUser.name });
            }, 3000);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !currentUser) return;

        const content = inputText.trim();
        setInputText('');

        try {
            const encryptedContent = await CryptoService.encrypt(content);
            const messageData = {
                id: Math.random().toString(36).substr(2, 9),
                content: encryptedContent,
                jobId,
                senderId: currentUser.id,
                sentAt: new Date().toISOString(),
                isEncrypted: true,
                sender: {
                    id: currentUser.id,
                    name: currentUser.name,
                    avatarUrl: currentUser.avatarUrl
                }
            };

            await fetch('https://compilation-scripts-root-guitars.trycloudflare.com/webhook-test/ably-receiver', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });

            setMessages(prev => [...prev, { ...messageData, content }]);
            channelRef.current?.publish('typing:stop', { userName: currentUser.name });
            setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const markAsRead = (messageId) => {
        const readAt = new Date().toISOString();
        channelRef.current?.publish('message:read', { messageId, readAt });
        fetch('https://compilation-scripts-root-guitars.trycloudflare.com/webhook-test/ably-receiver', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messageId, readAt, type: 'READ_UPDATE' })
        }).catch(console.error);
    };

    const renderMessage = ({ item, index }) => {
        const isMine = item.senderId === currentUser?.id;
        const prevMsg = messages[index - 1];
        const showAvatar = !isMine && (!prevMsg || prevMsg.senderId !== item.senderId);

        return (
            <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.theirMessage]}>
                {!isMine && (
                    <View style={styles.avatarSpace}>
                        {showAvatar && (
                            item.sender?.avatarUrl ? (
                                <Image source={{ uri: item.sender.avatarUrl }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <UserIcon size={12} color="#666" />
                                </View>
                            )
                        )}
                    </View>
                )}
                <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    {!isMine && showAvatar && (
                        <Text style={styles.senderName}>{item.sender?.name}</Text>
                    )}
                    <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
                        {item.content}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text style={[styles.messageTime, isMine ? styles.myTime : styles.theirTime]}>
                            {new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        {isMine && (
                            item.readAt ? (
                                <CheckCheck size={12} color="#fff" style={{ marginLeft: 4 }} />
                            ) : (
                                <CheckCheck size={12} color="rgba(255,255,255,0.4)" style={{ marginLeft: 4 }} />
                            )
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft color="#333" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{jobTitle || 'İş Sohbeti'}</Text>
                    <Text style={styles.headerSubtitle}>
                        {onlineCount} kişi çevrimiçi
                    </Text>
                </View>
                <View style={styles.encryptionBadge}>
                    <Lock size={12} color="#4CAF50" />
                    <Text style={styles.encryptionText}>Şifreli</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                    />

                    {isTyping.length > 0 && (
                        <View style={styles.typingContainer}>
                            <Text style={styles.typingText}>{isTyping.join(', ')} yazıyor...</Text>
                        </View>
                    )}

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    >
                        <View style={styles.inputArea}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    value={inputText}
                                    onChangeText={handleTyping}
                                    placeholder="Mesaj yazın..."
                                    placeholderTextColor="#999"
                                    multiline
                                />
                            </View>
                            <TouchableOpacity
                                style={[styles.sendButton, !inputText.trim() && styles.sendDisabled]}
                                onPress={handleSend}
                                disabled={!inputText.trim()}
                            >
                                <Send size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: { padding: 4 },
    headerInfo: { flex: 1, marginLeft: 12 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    headerSubtitle: { fontSize: 11, color: '#22c55e', marginTop: 2 },
    encryptionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    encryptionText: { fontSize: 10, color: '#166534', fontWeight: '600' },
    listContent: { padding: 16 },
    messageContainer: { marginBottom: 16, flexDirection: 'row', alignItems: 'flex-end' },
    myMessage: { justifyContent: 'flex-end' },
    theirMessage: { justifyContent: 'flex-start' },
    avatarSpace: { width: 28, marginRight: 8 },
    avatar: { width: 28, height: 28, borderRadius: 14 },
    avatarPlaceholder: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 20 },
    myBubble: { backgroundColor: '#6366f1', borderBottomRightRadius: 4 },
    theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    senderName: { fontSize: 10, fontWeight: '700', color: '#64748b', marginBottom: 4 },
    messageText: { fontSize: 14, lineHeight: 20 },
    myText: { color: '#fff' },
    theirText: { color: '#334155' },
    messageFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 4 },
    messageTime: { fontSize: 9 },
    myTime: { color: 'rgba(255,255,255,0.7)' },
    theirTime: { color: '#94a3b8' },
    typingContainer: { paddingHorizontal: 16, paddingBottom: 8 },
    typingText: { fontSize: 11, color: '#64748b', fontStyle: 'italic' },
    inputArea: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', alignItems: 'center', gap: 12 },
    inputWrapper: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 24, paddingHorizontal: 16 },
    input: { paddingVertical: 10, fontSize: 14, color: '#1e293b', maxHeight: 100 },
    sendButton: { backgroundColor: '#6366f1', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 2 },
    sendDisabled: { backgroundColor: '#cbd5e1', elevation: 0 }
});

export default ChatScreen;
