---
title: "Part II: Codebase Architecture"
sidebar_label: "Part II: Codebase Architecture"
sidebar_position: 2
---

Deep dive into the Structra codebase structure. 

- **Web App:** Located in 'src/', built with Next.js App Router. Key folders: 'src/app' (pages and layouts), 'src/components', 'src/lib/data' (Prisma queries). 
- **Mobile App:** Located in 'apps/mobile', built with Expo. Key folders: 'apps/mobile/src' (screens, components, services). 
- **Shared Logic:** 'prisma/' (database schema), 'src/lib/constants' (shared constants). Key files: src/app/[locale]/layout.tsx, apps/mobile/App.js, prisma/schema.prisma

