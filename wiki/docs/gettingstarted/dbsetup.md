---
title: "Database & Environment Setup"
sidebar_label: "Database & Environment Setup"
sidebar_position: 2
---

Set up your environment variables and prepare the database. Create a '.env' file in the root directory with the necessary variables. 

```env
DATABASE_URL='postgresql://...'
NEXTAUTH_SECRET='your-secret'
NEXTAUTH_URL='http://localhost:3000'
``` 

Then run the database commands: 

```bash
npx prisma db push
npx prisma db seed
``` 
Key files: .env.example, prisma/schema.prisma, prisma/seed.ts

