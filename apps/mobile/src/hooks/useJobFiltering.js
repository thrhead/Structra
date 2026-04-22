import { useState, useMemo } from 'react';
import { isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';

/**
 * Hook for managing job filtering logic in the mobile app.
 * Extracts logic from UI components for better maintainability.
 */
export const useJobFiltering = (jobs) => {
    const [selectedFilter, setSelectedFilter] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('Tümü');

    const filteredJobs = useMemo(() => {
        if (!jobs) return [];
        
        let result = [...jobs];

        // 1. Status Filtering logic
        const statusMap = {
            'Devam Eden': 'IN_PROGRESS',
            'Bekleyen': 'PENDING',
            'Onay Bekleyen': 'PENDING_APPROVAL',
            'Tamamlanan': 'COMPLETED'
        };

        if (selectedFilter !== 'Tümü' && statusMap[selectedFilter]) {
            result = result.filter(j => j.status === statusMap[selectedFilter]);
        }

        // 2. Date Filtering logic
        if (dateFilter !== 'Tümü') {
            result = result.filter(j => {
                if (!j.scheduledDate) return false;
                const date = parseISO(j.scheduledDate);
                switch (dateFilter) {
                    case 'Bugün': return isToday(date);
                    case 'Yarın': return isTomorrow(date);
                    case 'Bu Hafta': return isThisWeek(date, { weekStartsOn: 1 });
                    default: return true;
                }
            });
        }

        // 3. Search logic
        if (searchQuery) {
            const term = searchQuery.toLowerCase();
            result = result.filter(j =>
                j.id?.toLowerCase().includes(term) ||
                j.jobNo?.toLowerCase().includes(term) ||
                j.title?.toLowerCase().includes(term) ||
                j.customer?.company?.toLowerCase().includes(term)
            );
        }

        // 4. Sorting logic (Priority then Date)
        return result.sort((a, b) => {
            const priorityOrder = { URGENT: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
            const pDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
            if (pDiff !== 0) return pDiff;

            const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : 0;
            const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : 0;
            return dateA - dateB;
        });
    }, [jobs, selectedFilter, searchQuery, dateFilter]);

    return {
        filteredJobs,
        selectedFilter,
        setSelectedFilter,
        searchQuery,
        setSearchQuery,
        dateFilter,
        setDateFilter
    };
};
