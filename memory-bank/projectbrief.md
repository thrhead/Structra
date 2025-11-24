# Assembly Tracker Project Brief

## Project Overview
Assembly Tracker is a web application for tracking field assembly and service teams. The system enables management of assembly processes, cost control, and team coordination for factory external operations.

## Core Requirements
- User authentication with role-based access (Admin, Manager, Team Lead, Worker, Customer)
- Job tracking system with step-by-step progress monitoring
- Team management and assignment capabilities
- Cost tracking and approval workflows
- Real-time notifications and status updates
- Mobile-responsive interface with Turkish language support

## Key Features
- Job creation with detailed steps and sub-steps
- Time tracking for sub-tasks with start/end times
- Automatic parent task completion when all sub-tasks are done
- Team performance metrics and visualizations
- Photo upload for work documentation
- Reporting system for job status and costs

## Technical Stack
- Next.js 16 with App Router
- TypeScript
- PostgreSQL with Prisma ORM
- NextAuth.js v4 for authentication
- TailwindCSS for styling
- Dark mode support

## Current Status
The application is in MVP state with core job creation functionality working. Focus is on completing photo upload, notifications, and reporting features.

## Next Steps
1. Examine the memory bank files to understand the project context
2. Analyze the job creation error in the debug log
3. Identify the root cause of the foreign key constraint error
4. Fix the authentication configuration to properly handle the user ID
5. Update the memory bank with the current status and next steps
