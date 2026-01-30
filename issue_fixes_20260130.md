# Issue Fixes - 2026-01-30

## Completed Tasks

### 1. Web Notification Integration
- **Context:** Duplicate notification bells were appearing on the Admin Dashboard.
- **Action:** Removed the redundant `NotificationsBell` link from `apps/web/app/[locale]/admin/page.tsx` as the `AdminHeader` already contains the `NotificationDropdown`.
- **Status:** Resolved.

### 2. Admin & Manager Parity (Mobile)
- **Approvals Navigation:** Added a navigation link to the "Approvals" screen from the Manager Dashboard (`apps/mobile/src/screens/manager/ManagerDashboardScreen.js`) to allow managers to access approvals easily.
- **Approval Attachments:** Updated `ApprovalCard.js` (`apps/mobile/src/components/admin/ApprovalCard.js`) to display attachment images for Cost approvals, with a modal for full-screen viewing.
- **Job Editing:** Verified `projectNo` is available in `EditJobScreen.js`.

### 3. Alert System Refactoring (Mobile)
- **Action:** Replaced native `Alert.alert()` usages with the custom `useAlert()` hook in the following files for consistent UI/UX:
  - `apps/mobile/src/hooks/useUserManagement.js`
  - `apps/mobile/src/components/admin/UserFormModal.js`
  - `apps/mobile/src/hooks/useApprovals.js`
  - `apps/mobile/src/hooks/useWorkerExpenses.js`
  - `apps/mobile/src/components/common/VoiceRecorder.js`
- **Status:** Completed. Native alerts replaced with themed custom modals.

### 4. Testing (Jest)
- **Action:** Updated `jest.setup.js` and `jest.config.js` to include mocks for `AlertContext`, `ThemeContext`, `Navigation`, and Expo libraries.
- **Status:** `npm test` still fails with babel/environment issues ("don't use this - v1"). This requires a deeper environment fix (e.g., dependency realignment), but the code changes for mocks are in place.

## Next Steps
- Verify the mobile approval flow with actual data.
- Address the persistent Jest environment issues if automated testing is critical.
