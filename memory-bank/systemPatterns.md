# Sistem Desenleri

## Mimari Genel Bakış

### Genel Mimari

```
┌─────────────────────────────────────────────────┐
│              Frontend (Next.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Admin   │  │ Manager  │  │   Team   │      │
│  │Dashboard │  │Dashboard │  │Dashboard │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                  │
│  ┌──────────────────────────────────────┐      │
│  │      Shared Components & UI          │      │
│  └──────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│             API Layer (Next.js)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │   Jobs   │  │  Reports │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│         Database (PostgreSQL/Prisma)             │
└─────────────────────────────────────────────────┘
```

## Katman Yapısı

### 1. Presentation Layer (UI)

- **Sorumluluk**: Kullanıcı arayüzü ve etkileşim
- **Teknoloji**: React Components, TailwindCSS, shadcn/ui
- **Desenler**:
  - Component composition
  - Props drilling önleme (Context veya Zustand)
  - Separation of concerns (smart vs dumb components)

### 2. Application Layer (Business Logic)

- **Sorumluluk**: İş mantığı ve veri akışı
- **Teknoloji**: Custom hooks, utilities
- **Desenler**:
  - Custom hooks for reusable logic
  - Service pattern for API calls
  - Form validation with Zod

### 3. API Layer

- **Sorumluluk**: Backend endpoints
- **Teknoloji**: Next.js API Routes
- **Desenler**:
  - RESTful API design
  - Middleware pattern (auth, logging)
  - Error handling consistency

### 4. Data Layer

- **Sorumluluk**: Veritabanı işlemleri
- **Teknoloji**: Prisma ORM
- **Desenler**:
  - Repository pattern (Prisma ile)
  - Query optimization
  - Transaction management

## Temel Tasarım Desenleri

### 1. Authentication Flow

```
User Input → Form Validation → API Call → NextAuth
                                              ↓
                        JWT Token ← Session Creation
                              ↓
                    Store in Cookie/LocalStorage
                              ↓
                    Protected Route Access
```

### 2. Job Management Flow

```
Manager Creates Job → API validates → Save to DB
                                          ↓
                              Assign to Team/User
                                          ↓
                              Send Notification
                                          ↓
                    Worker receives → Updates checklist
                                          ↓
                            Real-time status update
                                          ↓
                        Manager/Customer see update
```

### 3. Notification System

```
Event Trigger (Job Update/Assignment)
              ↓
      Create Notification Record
              ↓
      Push to User's Notification Queue
              ↓
      Real-time Update (WebSocket/Polling)
              ↓
      User Views Notification
              ↓
      Mark as Read
```

### 4. Role-Based Access Control (RBAC)

```
User Login → Get User Role → Store in Session
                                    ↓
              Route Access Check ← Middleware
                                    ↓
                              Allowed/Denied
```

## Component Yapısı

### Reusable Components

```
components/
├── ui/                    # Base UI components (shadcn)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── forms/                 # Form components
│   ├── LoginForm.tsx
│   ├── JobForm.tsx
│   └── ChecklistForm.tsx
├── layout/                # Layout components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── charts/                # Chart components
│   ├── JobStatusChart.tsx
│   └── CostChart.tsx
└── features/              # Feature-specific components
    ├── job-card/
    ├── notification-list/
    └── user-profile/
```

### Page Structure Pattern

```tsx
// Ornek: Admin Dashboard
app / dashboard / admin / page.tsx;

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { JobsList } from "@/components/features/jobs-list";

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  // Server component - fetch data here
  const jobs = await getJobs();

  return (
    <DashboardLayout>
      <h1>Admin Dashboard</h1>
      <JobsList jobs={jobs} />
    </DashboardLayout>
  );
}
```

## Data Flow Patterns

### Server Components (Default)

- Veri çekme server-side
- SEO friendly
- Daha az JavaScript
- Önerilen: Liste sayfaları, statik içerik

### Client Components

- Interaktif özellikler
- State management gerekli
- Event handlers
- Önerilen: Formlar, modals, real-time updates

### Data Fetching Strategy

```tsx
// Server Component
async function JobsPage() {
  const jobs = await prisma.job.findMany(); // Direkt DB çağrısı
  return <JobsList jobs={jobs} />;
}

// Client Component
("use client");
function JobForm() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs") // API çağrısı
      .then((res) => res.json())
      .then(setJobs);
  }, []);

  return <form>...</form>;
}
```

## State Management Pattern

### Local State (useState)

- Component-specific state
- Form inputs
- UI state (modals, dropdowns)

### Global State (Zustand/Context)

- User session
- Notifications
- App-wide settings

### Server State (React Query - ileride)

- API data caching
- Background refetching
- Optimistic updates

## API Design Patterns

### Endpoint Structure

```
/api/auth/[...nextauth]    # Authentication
/api/jobs                  # GET all, POST new
/api/jobs/[id]             # GET, PUT, DELETE job
/api/jobs/[id]/steps       # GET, POST steps
/api/notifications         # GET, POST notifications
/api/users                 # User management
/api/reports               # Report generation
```

### Response Format

```typescript
// Success
{
  success: true,
  data: {...},
  message: "İşlem başarılı"
}

// Error
{
  success: false,
  error: "Hata mesajı",
  code: "ERROR_CODE"
}
```

## Database Patterns

### Prisma Relations

```prisma
model Job {
  id          String      @id @default(cuid())
  steps       JobStep[]
  team        Team        @relation(...)
  customer    Customer    @relation(...)
  approvals   Approval[]
}
```

### Query Optimization

- Use `include` for relations
- Use `select` for specific fields
- Indexing for frequently queried fields
- Pagination for large datasets

## Security Patterns

### Input Validation

```typescript
// Zod schema
const jobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  customerId: z.string().cuid(),
});

// Usage
const validated = jobSchema.parse(input);
```

### Authorization Middleware

```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token");
  if (!token) {
    return NextResponse.redirect("/login");
  }
  // Verify and continue
}
```

## Error Handling Pattern

### API Error Handling

```typescript
try {
  const result = await prisma.job.create({...})
  return Response.json({ success: true, data: result })
} catch (error) {
  console.error(error)
  return Response.json(
    { success: false, error: 'Bir hata oluştu' },
    { status: 500 }
  )
}
```

### Client Error Handling

```tsx
try {
  const res = await fetch('/api/jobs', {...})
  const data = await res.json()

  if (!data.success) {
    toast.error(data.error)
    return
  }

  toast.success(data.message)
} catch (error) {
  toast.error('Beklenmeyen bir hata oluştu')
}
```

## Critical Implementation Paths

### 1. User Registration & Login

1. Form submission
2. Input validation (client + server)
3. Password hashing
4. Create user record
5. Create session
6. Redirect to dashboard

### 2. Create & Assign Job

1. Manager fills job form
2. Validate input
3. Create job record
4. Create job steps
5. Assign to team
6. Create notification
7. Update UI

### 3. Update Job Progress

1. Worker opens job
2. View checklist
3. Mark step complete
4. Add notes
5. Save to database
6. Notify manager
7. Update customer view

### 4. Manager Approval

1. Manager receives notification
2. Views completed work
3. Reviews details
4. Approves/Rejects
5. Update job status
6. Notify worker
7. Update costs if needed
