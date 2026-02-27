# 🛠️ Plan: Move "New Job" Button for Better Accessibility (Issue #23)

## Problem Description
The "New Job" creation button in the mobile application is currently perceived as being "at the bottom", making it difficult for users (Admins/Managers) to find or access quickly without scrolling. 

## Root Cause Analysis
- In `WorkerJobsScreen.js`, the buttons (Upload Excel and New Job) are inside a `fabContainer` styled with `position: 'absolute', bottom: 24, right: 24`.
- While technically a Floating Action Button (FAB), its interaction with the `FlatList` padding and overall prominence might be causing usability issues.
- The user specifically mentioned it is at the "very bottom", suggesting it should be moved to a more standard "Top" or "Header" position for immediate visibility.

## Proposed Changes

### Phase 1: UI Relocation (Mobile Developer / Frontend Specialist)
- **Primary Change:** Add a "New Job" button to the header of the `WorkerJobsScreen`.
- **Secondary Change (Optional):** Retain or optimize the FAB for secondary access, or remove it to avoid redundancy if the header button is sufficient.
- **Styling:** Use `MaterialIcons` ("add") and `ThemeContext` colors to match the existing design.

### Phase 2: Implementation Details
- Update `WorkerJobsScreen.js` to use `navigation.setOptions` or update the `JobSearchHeader.js` to include the action button.
- Ensure only `isAdmin` users see this button, maintaining the current permission logic.

### Phase 3: Verification (Test Engineer)
- Verify the button is visible at the top of the screen upon entry.
- Verify the button triggers the `CreateJobModal` correctly.
- Verify that non-admin users do **not** see the button.

## Implementation Steps
1. **mobile-developer**: Add "New Job" button to the Header Right section of `WorkerJobsScreen`.
2. **frontend-specialist**: Ensure styling is consistent with `ThemeContext`.
3. **test-engineer**: Verify visibility and functionality across roles.

---
**Approval Required:** Do you approve this plan? (Y/N)
