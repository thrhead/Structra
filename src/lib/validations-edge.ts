import { z } from 'zod'

// Auth Schemas (Edge Safe)
export const loginSchema = z.object({
    email: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).email('Geçerli bir e-posta adresi giriniz'),
    password: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(6, 'Şifre en az 6 karakter olmalıdır').optional().nullable(),
})

export const registerSchema = z.object({
    name: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(2, 'İsim en az 2 karakter olmalıdır'),
    email: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).email('Geçerli bir e-posta adresi giriniz'),
    password: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(6, 'Şifre en az 6 karakter olmalıdır').optional().nullable(),
    phone: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().nullable(),
    role: z.enum(['ADMIN', 'MANAGER', 'TEAM_LEAD', 'WORKER', 'CUSTOMER']),
})

export const createUserAdminSchema = z.object({
    name: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(2, 'İsim en az 2 karakter olmalıdır'),
    email: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).email('Geçerli bir e-posta adresi giriniz'),
    role: z.enum(['ADMIN', 'MANAGER', 'TEAM_LEAD', 'WORKER', 'CUSTOMER']),
    password: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().transform(val => val || undefined),
})

// User Schemas
export const updateUserSchema = z.object({
    name: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(2).optional(),
    phone: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().nullable(),
    isActive: z.boolean().optional(),
})

// Team Schemas
export const createTeamSchema = z.object({
    name: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(2, 'Takım adı en az 2 karakter olmalıdır'),
    leadId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid('Geçerli bir takım lideri seçiniz').optional().nullable(),
    description: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().nullable(),
    isActive: z.boolean().optional(),
    memberIds: z.array(z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' })).optional()
})

// Customer Schemas
export const createCustomerSchema = z.object({
    companyName: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(2, 'Şirket adı en az 2 karakter olmalıdır'),
    contactPerson: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(2, 'Kişi adı en az 2 karakter olmalıdır'),
    email: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).email('Geçerli bir e-posta adresi giriniz'),
    phone: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional().nullable(),
    address: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
})

// Job Creation Schema (Edge Safe)
export const jobCreationSchema = z.object({
    title: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1, 'Title is required'),
    description: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
    customerId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1, 'Customer is required'),
    teamId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
    workerId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    location: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
    scheduledDate: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1, 'Scheduled date is required'),
    budget: z.number().optional().nullable(),
    estimatedDuration: z.number().optional().nullable(), // Dakika cinsinden
    steps: z.array(z.object({
        title: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1, 'Step title is required'),
        description: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
        order: z.number().optional(),
        subSteps: z.array(z.object({
            title: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1, 'Sub-step title is required'),
            description: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
            order: z.number().optional()
        })).optional()
    })).optional().nullable()
})

// Notification Schema
export const createNotificationSchema = z.object({
    userId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid(),
    jobId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid().optional(),
    title: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1),
    message: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).min(1),
})

// Approval Schema
export const createApprovalSchema = z.object({
    jobId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid(),
    requesterId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid(),
    approverId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid(),
    notes: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
})

export const updateApprovalSchema = z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
    notes: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
})

// Cost Tracking Schema
export const createCostTrackingSchema = z.object({
    jobId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid(),
    teamId: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).cuid(),
    hoursWorked: z.number().positive(),
    cost: z.number().positive(),
    notes: z.string({ required_error: 'Bu alan zorunludur', invalid_type_error: 'Geçersiz metin formatı' }).optional(),
})

// Shared Types
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type CreateTeamInput = z.infer<typeof createTeamSchema>
export type CreateUserAdminInput = z.infer<typeof createUserAdminSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
