import { useState, useMemo } from 'react';
import { isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns';

export const useJobFiltering = (jobs) => {
    const [selectedFilter, setSelectedFilter] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('Tümü'); // Tümü, Bugün, Yarın, Bu Hafta

    const filteredJobs = useMemo(() => {
        let result = [...(jobs || [])];

        // Status Filter
        if (selectedFilter === 'Devam Eden') {
            result = result.filter(j => j.status === 'IN_PROGRESS');
        } else if (selectedFilter === 'Bekleyen') {
            result = result.filter(j => j.status === 'PENDING');
        } else if (selectedFilter === 'Onay Bekleyen') {
            result = result.filter(j => j.status === 'PENDING_APPROVAL');
        } else if (selectedFilter === 'Tamamlanan') {
            result = result.filter(j => j.status === 'COMPLETED');
        }

        // Date Filter
        if (dateFilter !== 'Tümü') {
            result = result.filter(j => {
                if (!j.scheduledDate) return false;
                const date = parseISO(j.scheduledDate);
                if (dateFilter === 'Bugün') return isToday(date);
                if (dateFilter === 'Yarın') return isTomorrow(date);
                if (dateFilter === 'Bu Hafta') return isThisWeek(date, { weekStartsOn: 1 });
                return true;
            });
        }

        // Search Filter
        if (searchQuery) {
            const lower = searchQuery.toLowerCase();
            result = result.filter(j =>
                (j.id && j.id.toLowerCase().includes(lower)) ||
                (j.jobNo && j.jobNo.toLowerCase().includes(lower)) ||
                (j.projectNo && j.projectNo.toLowerCase().includes(lower)) ||
                (j.title && j.title.toLowerCase().includes(lower)) ||
                (j.customer?.company && j.customer.company.toLowerCase().includes(lower))
            );
        }

        // Sort: High priority first, then date
        result.sort((a, b) => {
            const priorityOrder = { URGENT: 3, HIGH: 2, MEDIUM: 1, LOW: 0 };
            const priorityA = priorityOrder[a.priority] || 0;
            const priorityB = priorityOrder[b.priority] || 0;
            const pDiff = priorityB - priorityA;
            if (pDiff !== 0) return pDiff;

            const dateA = a.scheduledDate ? new Date(a.scheduledDate) : new Date(0);
            const dateB = b.scheduledDate ? new Date(b.scheduledDate) : new Date(0);
            return dateA - dateB;
        });

        return result;
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
