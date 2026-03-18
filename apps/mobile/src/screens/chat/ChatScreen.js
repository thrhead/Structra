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
    SafeAreaView
} from 'react-native';
import { Send, Lock, WifiOff, ChevronLeft } from 'lucide-react-native';
import { MessageService } from '../../services/message.service';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ably from 'ably';
import { API_BASE_URL } from '../../services/api';

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { jobId, jobTitle } = route.params || {};

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    const channelRef = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        loadInitialData();
        setupAbly();

        return () => {
            if (channelRef.current) {
                channelRef.current.unsubscribe();
            }
        };
    }, []);

    const loadInitialData = async () => {
        try {
            // Load current user
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) setCurrentUser(JSON.parse(userStr));

            // Load messages
            const data = await MessageService.getMessages({ jobId });
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load chat data:', error);
            setLoading(false);
        }
    };

    const setupAbly = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            
            if (!user) return;

            // Initialize Ably client with auth callback
            const ably = new Ably.Realtime({
                authCallback: async (callback) => {
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/ably/auth`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (response.ok) {
                            const tokenRequestData = await response.json();
                            callback(null, tokenRequestData);
                        } else {
                            const error = await response.text();
                            callback(new Error(error), null);
                        }
                    } catch (error) {
                        console.error('[Chat] Auth callback error:', error);
                        callback(error, null);
                    }
                },
                clientId: user.id,
            });

            // Subscribe to job channel for chat
            const channel = ably.channels.get(`job:${jobId}`);
            channelRef.current = channel;

            channel.subscribe('receive:message', (message) => {
                setMessages(prev => [...prev, message.data]);
            });

            channel.subscribe('typing:start', (data) => {
                setIsTyping(true);
            });

            channel.subscribe('typing:stop', (data) => {
                setIsTyping(false);
            });

            console.log('[Chat] Ably channel subscribed:', `job:${jobId}`);
        } catch (error) {
            console.error('[Chat] Failed to setup Ably:', error);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const messageText = inputText.trim();
        setInputText('');

        try {
            // Send message via API
            await MessageService.sendMessage({
                jobId,
                content: messageText,
            });

            // Message will be received via Ably channel
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleTyping = async () => {
        // Could implement typing indicator via Ably here
    };

    const renderMessage = ({ item }) => {
        const isOwnMessage = item.senderId === currentUser?.id;

        return (
            <View style={[
                styles.messageContainer,
                isOwnMessage ? styles.myMessage : styles.otherMessage
            ]}>
                <View style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.myBubble : styles.otherBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isOwnMessage ? styles.myText : styles.otherText
                    ]}>
                        {item.content}
                    </Text>
                    <Text style={[
                        styles.messageTime,
                        isOwnMessage ? styles.myTime : styles.otherTime
                    ]}>
                        {new Date(item.createdAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>{jobTitle || 'Sohbet'}</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            {isTyping && (
                <View style={styles.typingIndicator}>
                    <Text style={styles.typingText}>Yazıyor...</Text>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={90}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mesaj yazın..."
                        placeholderTextColor="#9CA3AF"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                    >
                        <Send size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F2937',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#374151',
        borderBottomWidth: 1,
        borderBottomColor: '#4B5563',
    },
    backButton: {
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    messageList: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
    },
    myMessage: {
        alignItems: 'flex-end',
    },
    otherMessage: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: '#6366f1',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#374151',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
    },
    myText: {
        color: '#fff',
    },
    otherText: {
        color: '#E5E7EB',
    },
    messageTime: {
        fontSize: 11,
        marginTop: 4,
    },
    myTime: {
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'right',
    },
    otherTime: {
        color: 'rgba(255,255,255,0.5)',
    },
    typingIndicator: {
        padding: 8,
        paddingLeft: 16,
    },
    typingText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#374151',
        borderTopWidth: 1,
        borderTopColor: '#4B5563',
    },
    input: {
        flex: 1,
        backgroundColor: '#1F2937',
        color: '#fff',
        padding: 12,
        borderRadius: 24,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#6366f1',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#4B5563',
    },
});

export default ChatScreen;
