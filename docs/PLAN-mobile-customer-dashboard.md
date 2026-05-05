# PLAN: Mobile Customer Dashboard Redesign

## Objective
The mobile application currently routes customers to a rudimentary dashboard `CustomerDashboardScreen.js` which only displays 3 basic statistics. The goal is to design a more modern, helpful, and feature-rich dashboard for customers.

## Current State Analysis
- **Framework:** React Native / Expo
- **Target File:** `apps/mobile/src/screens/customer/CustomerDashboardScreen.js`
- **Current Layout:** Basic ScrollView with a greeting and 3 `StatCard` components (Total Jobs, In Progress, Completed).

## Proposed Enhancements
1.  **Modern UI/UX:**
    -   Use `GlassCard` or `LinearGradient` for a premium feel, matching the rest of the application's modern aesthetics (e.g., `WorkerDashboardScreen`).
    -   Improved greeting section with customer-specific context.
2.  **Recent Activity / Jobs:**
    -   Display a list of recent or active jobs (e.g., "Devam Eden İşlerim" - My Ongoing Jobs).
    -   Use a specialized component like `JobGridItem` or create a `CustomerJobCard` to show job status, progress bar, and scheduled dates.
3.  **Quick Actions (If applicable):**
    -   Buttons to quickly navigate to job history, reports, or support.
4.  **Charts/Visuals:**
    -   Implement a simple pie chart showing job status distribution or a progress ring for the overall completion rate.

## Implementation Steps
1.  **Phase 1: Update API/Service (If needed)**
    -   Ensure `getCustomerJobs` returns the full list of jobs, not just statistics. (It currently returns `{ jobs, stats }` based on previous fixes, so this should be ready).
2.  **Phase 2: Redesign Component**
    -   Import necessary UI components (`LinearGradient`, `PieChart`, etc.).
    -   Restructure the layout:
        -   Header (Greeting + Avatar/Initials)
        -   Hero Section (Overall Progress / Stats Summary)
        -   Active Jobs List (Horizontal or vertical scroll of current jobs)
        -   Recent Completed Jobs (Optional, below active)
3.  **Phase 3: Translation & Styling**
    -   Ensure all strings use the `t()` translation function.
    -   Apply the `theme.colors` system consistently.
4.  **Phase 4: Validation**
    -   Verify the screen renders correctly without crashing.

## Required Agents (Simulated)
-   `frontend-specialist`: To handle the React Native component redesign, animations, and styling.