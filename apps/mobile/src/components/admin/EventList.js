import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { getStatusColor } from '../../utils/status-helper';
import { useTranslation } from 'react-i18next';

const EventList = ({ selectedDate, events, onEventPress, theme }) => {
    const { t, i18n } = useTranslation();
    // Fallback if theme prop isn't passed (though it should be)
    const cardBg = theme ? theme.colors.card : '#1e293b';
    const textMain = theme ? theme.colors.text : '#e2e8f0';
    const textSub = theme ? theme.colors.subText : '#94a3b8';

    return (
        <View style={[styles.eventsContainer, { backgroundColor: theme ? theme.colors.background : '#0f172a' }]}>
            <Text style={[styles.eventsTitle, { color: textMain }]}>
                {new Date(selectedDate).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}
            </Text>
            <ScrollView style={styles.eventsList}>
                {events.length === 0 ? (
                    <Text style={[styles.noEvents, { color: textSub }]}>{t('manager.noPlanningData')}</Text>
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
                        >
                            <Text style={[styles.eventTitle, { color: textMain }]}>{event.title}</Text>
                            {event.status && (
                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
                                    <Text style={styles.statusText}>{t(`status.${event.status}`)}</Text>
                                </View>
                            )}
                            {event.location && (
                                <Text style={[styles.eventDetail, { color: textSub }]}>📍 {event.location}</Text>
                            )}
                            {event.assignments && (
                                <Text style={[styles.eventDetail, { color: textSub }]}>👤 {event.assignments}</Text>
                            )}
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
        padding: 16,
    },
    eventsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    eventsList: {
        flex: 1,
    },
    noEvents: {
        textAlign: 'center',
        marginTop: 24,
    },
    eventCard: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    eventDetail: {
        fontSize: 14,
        marginTop: 4,
    },
});

export default EventList;
