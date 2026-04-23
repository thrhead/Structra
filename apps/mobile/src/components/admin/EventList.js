import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getStatusColor } from '../../utils/status-helper';

const EventList = ({ selectedDate, events, onEventPress, theme }) => {
    // Fallback if theme prop isn't passed (though it should be)
    const cardBg = theme ? theme.colors.card : '#1e293b';
    const textMain = theme ? theme.colors.text : '#e2e8f0';
    const textSub = theme ? theme.colors.subText : '#94a3b8';

    return (
        <View style={[styles.eventsContainer, { backgroundColor: theme ? theme.colors.background : '#0f172a' }]}>
            <View style={styles.headerRow}>
                <Text style={[styles.eventsTitle, { color: textMain }]}>
                    {new Date(selectedDate).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </Text>
                <Text style={[styles.eventCount, { color: theme.colors.primary }]}>
                    {events.length} İş
                </Text>
            </View>
            <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
                {events.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={[styles.noEvents, { color: textSub }]}>Bu tarihte planlanmış iş yok</Text>
                    </View>
                ) : (
                    events.map((event) => (
                        <TouchableOpacity
                            key={event.id}
                            style={[
                                styles.eventCard,
                                {
                                    backgroundColor: cardBg,
                                    borderLeftColor: event.color || theme.colors.primary
                                }
                            ]}
                            onPress={() => onEventPress(event.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.eventHeader}>
                                <Text style={[styles.eventTitle, { color: textMain }]} numberOfLines={2}>{event.title}</Text>
                                {event.status && (
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                                        <Text style={styles.statusText}>{event.status}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.eventDetails}>
                                {event.allDay ? (
                                    <Text style={[styles.eventTime, { color: textSub }]}>🕒 Tüm Gün</Text>
                                ) : (
                                    <Text style={[styles.eventTime, { color: textSub }]}>
                                        🕒 {new Date(event.start).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        {event.end && ` - ${new Date(event.end).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
                                    </Text>
                                )}

                                {event.location && (
                                    <Text style={[styles.eventDetail, { color: textSub }]} numberOfLines={1}>📍 {event.location}</Text>
                                )}
                                {event.assignments && (
                                    <Text style={[styles.eventDetail, { color: textSub }]} numberOfLines={1}>👤 {event.assignments}</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    eventsContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)'
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    eventsTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    eventCount: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        overflow: 'hidden'
    },
    eventsList: {
        flex: 1,
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noEvents: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500'
    },
    eventCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 8,
    },
    eventTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    eventDetails: {
        gap: 6,
    },
    eventTime: {
        fontSize: 13,
        fontWeight: '500',
    },
    eventDetail: {
        fontSize: 13,
    },
});

export default EventList;
