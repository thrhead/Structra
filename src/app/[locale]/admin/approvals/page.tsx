import { getPendingCosts, getPendingJobSteps } from '@/lib/data/approvals';
import ApprovalsClient from '@/components/admin/approvals/approvals-client';

export const dynamic = 'force-dynamic';

export default async function ApprovalsPage() {
  const pendingCosts = await getPendingCosts();
  const { steps, subSteps } = await getPendingJobSteps();

  const now = new Date();
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const formattedCosts = pendingCosts.map(c => ({
    ...c,
    isDelayed: new Date(c.createdAt).getTime() < fortyEightHoursAgo.getTime()
  }));

  // Combine steps and substeps into a unified array for the UI
  const formattedSteps = [
    ...steps.map(s => ({
      ...s,
      type: 'STEP' as const,
      jobNo: s.job?.jobNo || `JOB-${s.job?.id?.substring(0,4)}`,
      jobTitle: s.job?.title,
      customerName: s.job?.customer?.company,
      isDelayed: s.completedAt ? new Date(s.completedAt).getTime() < fortyEightHoursAgo.getTime() : false
    })),
    ...subSteps.map(ss => ({
      ...ss,
      type: 'SUB_STEP' as const,
      jobNo: ss.step?.job?.jobNo || `JOB-${ss.step?.job?.id?.substring(0,4)}`,
      jobTitle: ss.step?.job?.title,
      customerName: ss.step?.job?.customer?.company,
      isDelayed: ss.completedAt ? new Date(ss.completedAt).getTime() < fortyEightHoursAgo.getTime() : false
    }))
  ].sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-indigo-600">Onay Merkezi</h2>
          <p className="text-muted-foreground">
            Mali işlemler, montaj iş emirleri ve alt iş emirleri onay süreçlerini yönetin.
          </p>
        </div>
      </div>

      <ApprovalsClient initialCosts={formattedCosts} initialSteps={formattedSteps} />
    </div>
  );
}
