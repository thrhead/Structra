# Plan - Modernize Confirmation Dialogs

The user wants to replace the current job deletion confirmation (which they say opens from the top) with a more modern, centered dialog, similar to the one used for expenses.
Surprisingly, both seem to use `ConfirmDialog` which is already centered in the code.
However, I will improve `ConfirmDialog` to be more "modern" (matching `rounded-3xl` style of other dialogs) and ensure it's used everywhere.

## Research Findings
- `ConfirmDialog` uses `@/components/ui/dialog` which is centered via `fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`.
- Both "işler" (jobs) and "masraflar" (expenses) deletion currently use `ConfirmDialog`.
- Some other dialogs (like `JobDialog`, `CustomerDialog`, `UserDialog`) use `rounded-3xl` and `p-6` for a more "modern" feel.

## Proposed Changes
1.  **Refactor `ConfirmDialog`**:
    -   Update `DialogContent` className to include `rounded-3xl` and `p-6` (matching the modern style).
    -   Improve the layout with better spacing and possibly a more prominent icon.
2.  **Verify Usage**:
    -   Check all `ConfirmDialog` usages to ensure they match the new style.
    -   Check if any other places use native `confirm()` or top-aligned sheets/drawers (though none were found in research).
3.  **Modernize Toasts (Optional but potentially related)**:
    -   Since the user mentioned "yukardan açılan" and `toast` from `sonner` is often top-aligned, I'll check if we should move toasts to bottom-right or center. But the user specifically said "ekranın ortasına çıkan başka bir uyarı penceresi", which sounds like a Dialog.

## Strategy
1.  Update `src/components/ui/confirm-dialog.tsx` to have a more "modern" UI (rounded corners, better layout).
2.  Verify the look in both "işler" and "masraflar" sections.
3.  Apply this to all confirmation dialogs.

## Task Breakdown
- [ ] Update `ConfirmDialog` UI.
- [ ] Check if `DeleteJobButton` is the only place for job deletion.
- [ ] Verify other `ConfirmDialog` usages.
- [ ] (Optional) Adjust `sonner` toast position if the user still feels things are "top-aligned".
