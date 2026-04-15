# Plan: Fix Strategic Report React Error #306

## 1. Issue Overview
When clicking the "Stratejik" (Strategic) tab in the Web App's Reports section, a React Minified Error #306 occurs.
- **Root Cause:** `src/components/admin/reports/StrategicView.tsx` incorrectly imports `StrategicPulseChart` from `@/components/charts/strategic-pulse-chart`.
- This global component has a named export (`export function StrategicPulseChart`), but Next.js's `dynamic()` method expects a default export, resulting in a `Module` object being passed to React instead of a valid component.
- Furthermore, the data passed to it (`combinedTrendData`) is formatted specifically for the local reports charts, not the global dashboard pulse chart.

## 2. Proposed Changes

### A. Update `src/components/admin/reports/StrategicView.tsx`
- Change the import path of `StrategicPulseChart` from the global components folder to the local reports charts folder:
  - From: `const StrategicPulseChart = dynamic(() => import("@/components/charts/strategic-pulse-chart"), { ssr: false })`
  - To: `const StrategicPulseChart = dynamic(() => import("./charts/StrategicPulseChart"), { ssr: false })`

### B. Refactor `src/components/admin/reports/charts/StrategicPulseChart.tsx`
- Ensure the local chart accepts the `combinedTrendData` array format (`[{ date, Gelir, Maliyet, Kâr }]`) which is passed down from `StrategicView.tsx`.
- Update the `Area` and `Bar` data keys in the Recharts setup to correctly map to `Gelir` (Revenue) and `Maliyet` (Cost).
- Fix the X-Axis configuration to use the `date` key instead of the `name` key.

## 3. Verification
- Use `test-engineer` or `frontend-specialist` to ensure no TypeScript compilation errors exist.
- Ensure `lint_runner.py` is executed before the orchestration completes.
