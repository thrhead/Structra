import { useState, useEffect } from 'react';
import approvalService from '../services/approval.service';
import costService from '../services/cost.service';
import { useAlert } from '../context/AlertContext';

export const useApprovals = () => {
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [approvals, setApprovals] = useState([]);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadApprovals();
    }, []);

    const loadApprovals = async () => {
        try {
            setLoading(true);
            const [pendingCosts, approvalData] = await Promise.all([
                costService.getAll({ status: 'PENDING' }),
                approvalService.getAll('PENDING')
            ]);

            const pApprovals = approvalData?.approvals || [];

            const formattedCosts = (pendingCosts || []).map(c => ({
                id: c.id,
                type: 'COST',
                title: `${c.amount} ${c.currency} - ${c.category}`,
                requester: c.createdBy?.name || c.createdBy?.email || 'Bilinmiyor',
                date: new Date(c.date).toLocaleDateString(),
                status: c.status,
                raw: c
            }));

            // Formatting proper approval records from the Approval table
            const formattedJobs = pApprovals.map(a => ({
                id: a.id,
                type: 'JOB', // Can use a.type like JOB_COMPLETION also, but UI uses JOB
                title: a.job?.title || 'Bilinmeyen İş',
                requester: a.requester?.name || a.requester?.email || 'Bilinmiyor',
                date: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Tarih Yok',
                status: a.status,
                jobId: a.job?.id, // Useful to link to job details
                raw: a
            }));

            setApprovals([...formattedJobs, ...formattedCosts]);
        } catch (error) {
            console.error('Error loading approvals:', error);
            showAlert('Hata', 'Onay listesi yüklenemedi.', [], 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadApprovals();
    };

    const handleApprove = async (item) => {
        try {
            if (item.type === 'COST') {
                await costService.updateStatus(item.id, 'APPROVED');
            } else if (item.type === 'JOB') {
                await approvalService.updateStatus(item.id, 'APPROVED');
            }
            showAlert('Başarılı', 'Onaylandı.', [], 'success');
            loadApprovals();
        } catch (error) {
            console.error('Approve error:', error);
            showAlert('Hata', 'İşlem başarısız.', [], 'error');
        }
    };

    const handleReject = async (item) => {
        try {
            if (item.type === 'COST') {
                await costService.updateStatus(item.id, 'REJECTED', 'Yönetici tarafından reddedildi.');
            } else if (item.type === 'JOB') {
                await approvalService.updateStatus(item.id, 'REJECTED', 'Yönetici tarafından reddedildi.');
            }
            showAlert('Başarılı', 'Reddedildi.', [], 'success');
            loadApprovals();
        } catch (error) {
            console.error('Reject error:', error);
            showAlert('Hata', 'İşlem başarısız.', [], 'error');
        }
    };

    const filteredApprovals = approvals.filter(item => filter === 'ALL' || item.type === filter);

    return {
        approvals,
        filteredApprovals,
        filter,
        setFilter,
        loading,
        refreshing,
        onRefresh,
        handleApprove,
        handleReject
    };
};
