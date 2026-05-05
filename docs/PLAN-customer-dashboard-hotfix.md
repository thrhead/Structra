# PLAN: Mobile Customer Dashboard Hotfixes

## Objective
Address UX and API bugs reported on the `CustomerDashboardScreen.js` within the React Native mobile application. The issues reported include translation keys displaying raw text instead of localized values, an incorrect 401 unauthorized loop on the dashboard, and a layout issue where job cards are stacking vertically rather than side-by-side in a 2-column grid.

## Issues to Fix
1.  **Translation Missing Context:** Keys like `common.welcome` and `jobs.status.pending` are showing up raw.
2.  **Layout Issue:** The "Active Jobs" list should display items in a 2-column grid layout, not a single column list.
3.  **Authentication/API Error:** The app is still making a `GET https://structra.qzz.io/api/worker/jobs` request which fails with a 401 Unauthorized for customers, leading to a logout loop or an error state ("görevler yüklenirken bir hata oluştu").

## Implementation Steps
### 1. Translation Fixes
-   **Target:** `apps/mobile/src/locales/tr.json` (and `en.json` if necessary)
-   **Action:** Add the missing translation keys (`common.welcome`, `jobs.status.pending`, `jobs.status.in_progress`, `jobs.status.completed`, `jobs.total`) if they are missing, or verify that the `useTranslation()` hook is being initialized with the correct namespaces if required.

### 2. Layout Fixes
-   **Target:** `apps/mobile/src/screens/customer/CustomerDashboardScreen.js`
-   **Action:** Change the rendering of `activeJobs` from a simple mapped array inside a `View` to a grid structure. Given that it's within a `ScrollView`, we can wrap the mapped `JobGridItem` components in a `View` with `flexDirection: 'row'` and `flexWrap: 'wrap'`, ensuring each item takes up ~48% width.

### 3. API Error Fix (401 Unauthorized)
-   **Target:** `apps/mobile/src/services/job.service.js` or `CustomerDashboardScreen.js`
-   **Action:** Find out why `/api/worker/jobs` is still being called. The plan is to verify that `getCustomerJobs()` in `job.service.js` uses the correct URL. The logs suggest `getMyJobs` (which explicitly points to `/api/worker/jobs`) is being called *somewhere*, perhaps in a shared hook or context, or there was a regression. We will find the rogue call and ensure the customer dashboard only calls `getCustomerJobs`. 
-   *Update based on logs:* The error stack trace says `getMyJobs @ index-7e2f7c0bce52b4a23ff4c40a5f9e69c9.js:12843`. I need to ensure `CustomerDashboardScreen.js` is NOT calling `getMyJobs` or that `SocketContext`/`AblyContext` isn't inadvertently triggering a worker fetch upon login.

## Required Agents (Simulated)
-   `frontend-specialist`: To fix the React Native grid layout and translations.
-   `debugger`: To find the source of the rogue `/api/worker/jobs` network request for a customer user.