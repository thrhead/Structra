# Mobile Job Order UI Modernization Plan (#33)

**Objective**: Refactor job order lists from full-width rows to a modern card-based grid layout (2x2) for a more efficient and aesthetic UI.

## Phase 1: Research & Component Design
- [ ] Analyze `WorkerJobsScreen.js` to see how the main list is rendered.
- [ ] Design a new `JobGridItem` component that fits a 2-column layout.
- [ ] Elements to include in the card:
    - Status badge (top right)
    - Job ID and Title
    - Customer/Location (with icons)
    - Progress bar (at bottom)
    - Priority indicator

## Phase 2: Implementation (The Grid)
- [ ] Modify `WorkerDashboardScreen.js` (Active Tasks) to support a 2x2 grid if needed, or keep as a horizontal section but with improved card design.
- [ ] Refactor `WorkerJobsScreen.js` to use `FlatList` with `numColumns={2}`.
- [ ] Implement responsive sizing using `Dimensions.get('window').width / 2`.

## Phase 3: Styling & Polish
- [ ] Apply "Bento" style aesthetics:
    - Soft rounded corners (16-24px)
    - Subtle shadows for light mode / Glassmorphism for dark mode.
    - Minimalist icons (Lucide-react or MaterialIcons).
- [ ] Add interaction feedback (activeOpacity).

## Socratic Gate
1. **Grid vs. Row**: 4'lü grid (2 sütun) yapısı dikey alandan tasarruf sağlar ancak başlıklar uzunsa metinler kesilebilir. Uzun başlıklar için "truncate" (üç nokta) kullanımına okey miyiz?
2. **Dashboard Style**: Dashboard'daki yatay kaydırmalı (horizontal) yapıyı koruyup sadece içindeki kartları mı güzelleştirelim, yoksa dashboard'u da dikey bir grid listesine mi çevirelim?
3. **Information Density**: Kart üzerinde her şeyi görmek mi istersiniz (tarih, kişi, konum, aşama), yoksa sadece en kritik 2-3 bilgiyi gösterip geri kalanını detay sayfasında mı tutalım?
