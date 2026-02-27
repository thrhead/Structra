---
title: "System Architecture Diagram"
sidebar_label: "System Architecture Diagram"
sidebar_position: 2
---

Visualize the system architecture with this Mermaid diagram. It shows the flow of data from the Next.js Web App and React Native Mobile App through the Next.js API layer to the PostgreSQL database, and the real-time communication via Socket.IO. 

```mermaid
graph TD
    A[Next.js Web App] --> B{Next.js API Routes}
    C[React Native Mobile App] --> B
    B --> D[Prisma ORM]
    D --> E[(PostgreSQL DB)]
    B --> F[Socket.IO Server]
    F --> A
    F --> C
```

