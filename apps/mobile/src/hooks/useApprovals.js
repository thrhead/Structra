import { useEffect, useState } from "react";
import { useAlert } from "../context/AlertContext";
import approvalService from "../services/approval.service";
import costService from "../services/cost.service";

export const useApprovals = () => {
	const { showAlert } = useAlert();
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [approvals, setApprovals] = useState([]);
	const [filter, setFilter] = useState("ALL");

	useEffect(() => {
		loadApprovals();
	}, [loadApprovals]);

	const loadApprovals = async () => {
		try {
			setLoading(true);
			const [pendingCosts, approvalData] = await Promise.all([
				costService.getAll({ status: "PENDING" }),
				approvalService.getAll("PENDING"),
			]);

			const pApprovals = approvalData?.approvals || [];
			const pSteps = approvalData?.pendingSteps || [];
			const pSubSteps = approvalData?.pendingSubSteps || [];

			const formattedCosts = (pendingCosts || []).map((c) => ({
				id: c.id,
				type: "COST",
				title: `${c.amount} ${c.currency} - ${c.category}`,
				requester: c.createdBy?.name || c.createdBy?.email || "Bilinmiyor",
				date: new Date(c.date).toLocaleDateString(),
				status: c.status,
				jobId: c.jobId,
				raw: c,
			}));

			const formattedJobs = pApprovals.map((a) => ({
				id: a.id,
				type: "JOB",
				title: a.job?.title || "Bilinmeyen İş",
				requester: a.requester?.name || a.requester?.email || "Bilinmiyor",
				date: a.createdAt
					? new Date(a.createdAt).toLocaleDateString()
					: "Tarih Yok",
				status: a.status,
				jobId: a.job?.id,
				raw: a,
			}));

			const formattedSteps = pSteps.map((s) => ({
				id: s.id,
				type: "STEP",
				title: s.title,
				jobTitle: s.job?.title,
				requester: s.completedBy?.name || "Bilinmiyor",
				date: s.completedAt
					? new Date(s.completedAt).toLocaleDateString()
					: "Tarih Yok",
				status: s.approvalStatus,
				jobId: s.jobId,
				photos: s.photos || [],
				raw: s,
			}));

			const formattedSubSteps = pSubSteps.map((ss) => ({
				id: ss.id,
				type: "SUB_STEP",
				title: ss.title,
				jobTitle: ss.step?.job?.title,
				requester: "Saha Personeli",
				date: ss.completedAt
					? new Date(ss.completedAt).toLocaleDateString()
					: "Tarih Yok",
				status: ss.approvalStatus,
				jobId: ss.step?.jobId,
				photos: ss.photos || [],
				raw: ss,
			}));

			setApprovals([
				...formattedJobs,
				...formattedCosts,
				...formattedSteps,
				...formattedSubSteps,
			]);
		} catch (error) {
			console.error("Error loading approvals:", error);
			showAlert("Hata", "Onay listesi yüklenemedi.", [], "error");
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
			if (item.type === "COST") {
				await costService.updateStatus(item.id, "APPROVED");
			} else if (item.type === "JOB") {
				await approvalService.updateStatus(item.id, "APPROVED");
			}
			showAlert("Başarılı", "Onaylandı.", [], "success");
			loadApprovals();
		} catch (error) {
			console.error("Approve error:", error);
			showAlert("Hata", "İşlem başarısız.", [], "error");
		}
	};

	const handleReject = async (item) => {
		try {
			if (item.type === "COST") {
				await costService.updateStatus(
					item.id,
					"REJECTED",
					"Yönetici tarafından reddedildi.",
				);
			} else if (item.type === "JOB") {
				await approvalService.updateStatus(
					item.id,
					"REJECTED",
					"Yönetici tarafından reddedildi.",
				);
			}
			showAlert("Başarılı", "Reddedildi.", [], "success");
			loadApprovals();
		} catch (error) {
			console.error("Reject error:", error);
			showAlert("Hata", "İşlem başarısız.", [], "error");
		}
	};

	const filteredApprovals = approvals.filter(
		(item) => filter === "ALL" || item.type === filter,
	);

	return {
		approvals,
		filteredApprovals,
		filter,
		setFilter,
		loading,
		refreshing,
		onRefresh,
		handleApprove,
		handleReject,
	};
};
