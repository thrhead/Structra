# Plan: Notification System Audit and Fix (Issue #61)

## Overview
This plan addresses the missing notification bell icon for admin users on mobile and performs a general health check of the notification system across both web and mobile platforms.

## Success Criteria
- [ ] Notification bell icon is visible for Admin users on mobile dashboard.
- [ ] Notification badge (unread count) works correctly for Admin users on mobile.
- [ ] Notifications list screen is accessible and functional for Admins on mobile.
- [ ] Notification bell and dropdown are functional for Admins on the web application.
- [ ] Real-time notification delivery via Ably is verified for all roles (Admin, Manager, Worker).

## Tech Stack
- **Mobile**: React Native, Expo, Ably (Real-time).
- **Web**: Next.js (App Router), Ably, Prisma.
- **Backend**: Node.js/Next.js API routes, Ably Realtime Channels.

## File Structure & Impact
- `apps/mobile/src/screens/admin/AdminDashboardScreen.js`: Primary focus for mobile admin UI.
- `apps/mobile/src/context/SocketContext.js`: Ably subscription logic.
- `src/components/admin/header.tsx`: Web admin header.
- `src/app/api/notifications/route.ts`: Notification delivery backend.

## Task Breakdown

### Phase 1: Analysis (Explorer Agent)
- [x] Map notification UI components in `apps/mobile`.
- [x] Check `AdminDashboardScreen.js` for existing bell icon logic.
- [x] Check `AdminHeader.tsx` for web notification dropdown.
- [x] Identify potential gaps in role-based notification delivery.

### Phase 2: Implementation (Parallel)

#### Mobile Fixes (`mobile-developer`)
- [ ] **Task M1**: Fix/Restore bell icon in `AdminDashboardScreen.js`.
    - *Input*: `AdminDashboardScreen.js` source.
    - *Output*: Functional notification icon + badge.
    - *Verify*: Icon appears and navigates to `Notifications` screen.
- [ ] **Task M2**: Ensure notification bell is available on major admin sub-screens if necessary, or fix global header behavior.

#### Web Verification (`frontend-specialist`)
- [ ] **Task W1**: Audit `AdminHeader.tsx` and `NotificationDropdown.tsx`.
    - *Input*: Web layout components.
    - *Output*: Verified functional notification UI for Admins.
    - *Verify*: Unread count updates and dropdown opens.

#### Backend/Real-time Audit (`backend-specialist`)
- [ ] **Task B1**: Verify Ably channel names and subscription logic for Admin role.
    - *Input*: `SocketContext.js` and `api/notifications` routes.
    - *Output*: Confirmed channel security and role-agnostic delivery.
    - *Verify*: Emitting a notification to an admin user results in unread count change.

### Phase 3: Verification (Test Engineer)
- [ ] **Task T1**: Run security scan for Ably secrets/token exposure.
- [ ] **Task T2**: Verify UI consistency across roles.
- [ ] **Task T3**: Manual verification of "Mark as Read" functionality for Admins.

## Phase X: Final Checklist
- [ ] No purple/violet hex codes used.
- [ ] Socratic Gate respected.
- [ ] Build successful for both apps.
- [ ] All verification scripts passed.
