# Plan - Fix Mobile Translation Issues

The user reported that "common.pendingapproval" is displayed in the mobile app instead of the translated text. Research shows that several translation keys are missing from the locale files.

## Root Cause
- Missing translation keys in `apps/mobile/src/locales/tr.json` and `apps/mobile/src/locales/en.json`.
- Specific keys missing: `pendingApproval`, `approved`, `rejected`, `approve`, `reject`.
- `StepItem.js` uses these keys but they don't exist in the JSON files, causing i18next to return the key itself.

## Proposed Changes

### 1. Update Translation Files
Add the missing keys to the `common` section in both `tr.json` and `en.json`.

**Turkish (tr.json):**
- `pendingApproval`: "Onay Bekliyor"
- `approved`: "Onaylandı"
- `rejected`: "Reddedildi"
- `approve`: "Onayla"
- `reject`: "Reddet"

**English (en.json):**
- `pendingApproval`: "Pending Approval"
- `approved`: "Approved"
- `rejected`: "Rejected"
- `approve`: "Approve"
- `reject`: "Reject"

### 2. Verification
- Verify that `StepItem.js` and other components correctly use these keys.
- Check if any other components use lowercase variants and unify them if necessary.

## Task Breakdown
- [ ] Add missing keys to `apps/mobile/src/locales/tr.json`
- [ ] Add missing keys to `apps/mobile/src/locales/en.json`
- [ ] Verify `StepItem.js` usage.
