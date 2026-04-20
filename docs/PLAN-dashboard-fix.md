# Web Dashboard Consistency & UI Improvement Plan

**Task**: Fix data inconsistency in "Weekly Completed Steps" chart and add date info to labels.

## Phase 1: Research (Immediate)
- [ ] Locate the Dashboard component and the specific chart component.
- [ ] Identify the data fetching logic (API or Server Action).
- [ ] Check how jobs are deleted and if orphaned steps remain in the DB.

## Phase 2: Backend Fix
- [ ] Update the aggregation query to ensure only steps from EXISTING jobs are counted.
- [ ] Verify that deleted jobs are correctly filtered out from all analytics.

## Phase 3: Frontend Improvement
- [ ] Update the chart data formatting logic to include dates under day names.
- [ ] Format: "Salı 14.05" or similar.

## Socratic Gate
1. **Delete Strategy**: İşler tamamen mi siliniyor (`hard delete`) yoksa bir flag ile mi işaretleniyor (`soft delete`)?
2. **Chart Library**: Web uygulamasında hangi grafik kütüphanesi kullanılıyor? (Recharts, Chart.js vb.)
