---
title: "Core Architectural Insight"
sidebar_label: "Core Architectural Insight"
sidebar_position: 1
---

Structra operates as a pseudo-monorepo with two primary frontends (Next.js Web App and React Native/Expo Mobile App) sharing a single backend and database schema. The core insight is the data layer abstraction via Prisma, allowing both frontends to consume a consistent API surface. The backend is built using Next.js API Routes, providing serverless functions for data access. Real-time communication is handled by Socket.IO, integrated with the Next.js server. The mobile app is a PWA, built with Expo Web, which allows for a single codebase for web, iOS, and Android. Key files: server.ts, src/lib/data/jobs.ts, apps/mobile/src/services/job.service.js

