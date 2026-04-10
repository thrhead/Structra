# Plan: Sidebar Migration to shadcn/ui Template

## Overview
Migrate the current admin layout to use the new `shadcn/ui` sidebar pattern (`SidebarProvider`, `SidebarInset`, `AppSidebar`) while restoring actual menu items from the previous version.

## Phase 1: Planning
- [x] Analyze current `AdminLayout`.
- [x] Analyze current `AdminSidebar` and extract `sidebarItems`.
- [ ] Define the structure for `AppSidebar`.
- [ ] Map the breadcrumb logic for admin pages.

## Phase 2: Implementation

### 1. Component Creation (`frontend-specialist`)
- Create `src/components/app-sidebar.tsx` using the `sidebarItems` found in `sidebar-modern.tsx`.
- Implement user profile footer and "Montaj Takip" header within `AppSidebar`.
- Ensure icons from `lucide-react` are correctly mapped.

### 2. Layout Refactoring (`frontend-specialist`)
- Update `src/app/[locale]/admin/layout.tsx`:
    - Integrate `SidebarProvider`.
    - Replace `AdminSidebar` with `AppSidebar`.
    - Integrate `SidebarInset`.
    - Implement the dynamic Header with `SidebarTrigger`, `Separator`, and `Breadcrumb`.
    - Maintain existing child content wrapping.

### 3. Cleanup (`explorer-agent`)
- Remove or mark as deprecated:
    - `src/components/admin/sidebar.tsx`
    - `src/components/admin/sidebar-modern.tsx`
    - `src/components/admin/sidebar-classic.tsx`
    - `src/components/admin/header.tsx` (if replaced by the inset header)

## Phase 3: Verification (`test-engineer`)
- Verify all menu links are working.
- Check responsive behavior (collapsible sidebar).
- Ensure Breadcrumbs reflect the current page correctly.
- Run `lint_runner.py` to ensure no regressions.

---
**Status:** Waiting for User Approval.
