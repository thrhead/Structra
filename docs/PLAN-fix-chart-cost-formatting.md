@# Plan: Fix Chart Cost Formatting Error

## 1. Issue Overview
In the "Strategic Analysis" chart, operational costs are being divided by 1000 before rendering. This causes lower values like "250 TL" to be displayed incorrectly as "0.25" (or "025" depending on string formatting).

- **Affected File:** `src/components/chart-area-interactive.tsx`
- **Root Cause:** Hardcoded division `/ 1000` in `formattedData` memo.

## 2. Proposed Changes

### A. Update Data Mapping
Remove the division by 1000 in the `formattedData` calculation to keep raw TL values.
```typescript
// From
cost: (item.cost ?? 0) / 1000
// To
cost: item.cost ?? 0
```

### B. Update Chart Configuration
Update the label in `chartConfig` to reflect the change from "k TL" to "TL".
```typescript
// From
label: "Maliyet (k TL)"
// To
label: "Maliyet (TL)"
```

### C. Improve Tooltip Formatting
Update the tooltip to format numbers as currency (TRY) for better readability.

## 3. Verification
- Verify that 250 TL is displayed as "250" or formatted currency.
- Ensure large numbers are still readable.
- Check for regression in chart scaling.
