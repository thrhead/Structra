---
title: "Design Tradeoffs"
sidebar_label: "Design Tradeoffs"
sidebar_position: 3
---

Discusses key design decisions and their implications. 

- **Monorepo vs. Separate Repos:** The current structure is a 'pseudo-monorepo' which simplifies dependency management but can lead to a more complex build process. A full monorepo with tools like Turborepo could further optimize this. 
- **Serverless vs. Dedicated Server:** Using Next.js API Routes provides a serverless backend, which is cost-effective and scalable but can have limitations with long-running processes. A dedicated Node.js server (like in server.ts) is used for Socket.IO to overcome this. 
- **PWA vs. Native Mobile:** The mobile app is a PWA built with Expo Web, which allows for fast iteration and cross-platform compatibility, but may lack the performance and native feel of a true native app. Key files: next.config.js, apps/mobile/app.json, server.ts

