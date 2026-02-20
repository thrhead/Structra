# PLAN - Issue #2: Web Notification Display Improvements

## Problem Statement
The current notification system in the web application has several issues:
1. **Lack of Real-time Updates:** Notifications in the `NotificationDropdown` only update every 30 seconds via polling.
2. **Missing Socket Emissions:** The `notification-helper.ts` creates database records but does not emit Socket.io events for the web client.
3. **Inconsistent Synchronization:** Toasts appear via `NotificationListener` (if triggered elsewhere), but the notification list does not refresh simultaneously.

## Proposed Solution
1. **Backend:** Update `src/lib/notification-helper.ts` to emit `notification:new` events via Socket.io when a notification is created.
2. **Frontend (Listener):** Update `NotificationListener` to trigger a global state update or event that `NotificationDropdown` can listen to.
3. **Frontend (Dropdown):** Replace or supplement polling with real-time updates triggered by socket events.
4. **Cleanup:** Ensure consistent naming and structure for notification payloads.

## Task Breakdown
### Phase 1: Backend Integration
- [ ] Task 1.1: Integrate Socket.io client or server emission in `src/lib/notification-helper.ts`.
- [ ] Task 1.2: Ensure `NotificationPayload` is consistent with `src/lib/socket-events.ts`.

### Phase 2: Frontend Synchronization
- [ ] Task 2.1: Implement `useNotifications` hook or similar to centralize fetching and state.
- [ ] Task 2.2: Update `NotificationListener.tsx` to invalidate the notifications query or refresh state.
- [ ] Task 2.3: Update `NotificationDropdown.tsx` to use the centralized state/hook.

### Phase 3: Verification
- [ ] Task 3.1: Create a test script to trigger a notification and verify socket emission.
- [ ] Task 3.2: Verify UI updates in real-time.

## Verification Plan
- **Automated Tests:** Add/update tests for `notification-helper.ts` to verify socket emission.
- **Manual Test:** Open two browser tabs, perform an action in one that triggers a notification, and verify it appears instantly in the other.
