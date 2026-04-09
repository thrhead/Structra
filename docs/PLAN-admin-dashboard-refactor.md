# Plan: Admin Dashboard Refactor (Stitch v2 Implementation)

## Overview
Refactor the main admin dashboard (/admin) to match the new UI design from `screen_ae61e797.html`. The mock data in the HTML will be replaced with real data from the system, and specific header elements will be removed to integrate seamlessly into the existing application layout.

## Domain Analysis
- **Target File:** `src/components/admin/admin-dashboard-client.tsx`
- **Data Source:** `src/lib/data/admin-dashboard.ts` (via props)
- **Design Source:** `screen_ae61e797.html` (Stitch v2)

## Mapping Real Data
The following mappings will be applied:
- **AKTİF GÖREV:** `activeJobs` (Current active job count)
- **TOPLAM BÜTÇE:** `totalCostToday` (or cumulative budget from stats)
- **SAHA PERSONELİ:** `totalWorkers`
- **ONAY BEKLEYEN:** `pendingApprovalsCount`
- **SİSTEM NABZI (Chart):** `strategicTrend` or `weeklyStats`
- **TOPLAM GÖRÜŞMELER:** Will be replaced with "İş Akış Özeti" (Workflow Summary) or similar relevant admin metric.
- **MÜŞTERİLER:** Will fetch real customer list or use existing latest logs if customers are not available in dashboard data.

## Phase 1: Planning
- [x] Create docs/PLAN-admin-dashboard-refactor.md
- [ ] Identify all necessary Lucide icons to match the design.

## Phase 2: Implementation (Parallel)

### Group 1: Foundation & Data (backend-specialist)
- Ensure `getAdminDashboardData` in `src/lib/data/admin-dashboard.ts` provides all necessary fields for the new UI (completion percentages, status distribution, etc.).
- Add real customer data fetching if missing.

### Group 2: UI Implementation (frontend-specialist)
- Update `AdminDashboardClient` with the new layout structure.
- **Header Cleanup:** Remove "SystemPulse", search bar, and navigation links (Dashboard, Analizler, Raporlar) from the HTML as they are handled by the global layout.
- Integrate Recharts into the "Sistem Nabzı" section using real data trends.
- Implement the 4 KPI cards with dynamic values.
- Build the "Müşteriler" table with real data.

### Group 3: Polish & Verification (test-engineer)
- Run hydration checks to ensure no SSR mismatches.
- Verify responsive behavior on mobile and desktop.
- Execute linting and security scans.

## Verification Scripts
- `python scripts/checklist.py .`
- `npm run lint`

