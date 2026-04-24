import { useJobFiltering } from '../useJobFiltering';
import { renderHook, act } from '@testing-library/react-native';

const mockJobs = [
    { 
        id: '1', 
        jobNo: 'WO-001', 
        title: 'Repair A', 
        status: 'PENDING', 
        priority: 'HIGH',
        scheduledDate: new Date().toISOString(), // Today
        customer: { company: 'Company A' }
    },
    { 
        id: '2', 
        jobNo: 'WO-002', 
        title: 'Install B', 
        status: 'IN_PROGRESS', 
        priority: 'URGENT',
        scheduledDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        customer: { company: 'Company B' }
    },
    { 
        id: '3', 
        jobNo: 'WO-003', 
        title: 'Check C', 
        status: 'COMPLETED', 
        priority: 'LOW',
        scheduledDate: '2020-01-01T00:00:00.000Z', // Past
        customer: { company: 'Company C' }
    }
];

describe('useJobFiltering Hook (Mobile)', () => {
    it('should return all jobs by default', () => {
        const { result } = renderHook(() => useJobFiltering(mockJobs));
        expect(result.current.filteredJobs).toHaveLength(3);
    });

    it('should filter by status', () => {
        const { result } = renderHook(() => useJobFiltering(mockJobs));
        
        act(() => {
            result.current.setSelectedFilter('Devam Eden'); // Maps to IN_PROGRESS
        });
        expect(result.current.filteredJobs).toHaveLength(1);
        expect(result.current.filteredJobs[0].status).toBe('IN_PROGRESS');
    });

    it('should filter by date (Today)', () => {
        const { result } = renderHook(() => useJobFiltering(mockJobs));
        
        act(() => {
            result.current.setDateFilter('Bugün');
        });
        expect(result.current.filteredJobs).toHaveLength(1);
        expect(result.current.filteredJobs[0].jobNo).toBe('WO-001');
    });

    it('should search by title or jobNo', () => {
        const { result } = renderHook(() => useJobFiltering(mockJobs));
        
        act(() => {
            result.current.setSearchQuery('Install');
        });
        expect(result.current.filteredJobs).toHaveLength(1);
        expect(result.current.filteredJobs[0].title).toBe('Install B');
    });

    it('should sort by priority (URGENT > HIGH > LOW)', () => {
        const { result } = renderHook(() => useJobFiltering(mockJobs));
        
        // Default sort check
        const first = result.current.filteredJobs[0];
        const second = result.current.filteredJobs[1];
        
        expect(first.priority).toBe('URGENT');
        expect(second.priority).toBe('HIGH');
    });
});
