# PLAN - Issue #14: Cost & Duration Estimation Display

## Goal
Enable the visualization of "Estimated Budget" and "Estimated Duration" fields in the Admin Job List and Job Details pages. These fields are already supported in the database and the create/edit forms but are missing from the view layer.

## Context
- **Issue:** #14 (Maliyet & Süre Tahmini)
- **Current State:**
    - DB has `budget` (Float) and `estimatedDuration` (Int, minutes).
    - `JobDialog` (Create/Edit) already allows inputting these values.
    - `JobsListClient` (Table) does not show them.
    - `JobDetailsView` does not show them.

## Implementation Plan

### 1. Update Job List Table
**File:** `src/components/jobs-list-client.tsx`
- [ ] Add "Bütçe" (Budget) column to the table.
- [ ] Add "Süre" (Duration) column to the table.
- [ ] Format `budget` as Turkish Lira (TRY).
- [ ] Format `estimatedDuration` (minutes) into a readable string (e.g., "2sa 30dk").

### 2. Update Job Details View
**File:** `src/components/job-details-view.tsx`
- [ ] Add "Tahmini Bütçe" and "Tahmini Süre" fields to the "İş Bilgileri" (Job Info) card.
- [ ] Display next to the "Durum" or "Açıklama" sections for quick visibility.
- [ ] (Optional) Add a visual comparison if the job is completed (Actual vs Estimated).

## Verification
- [ ] Create a job with Budget and Duration.
- [ ] Verify columns appear in the Job List.
- [ ] Verify fields appear in the Job Details page.
