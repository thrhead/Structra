import { describe, it, expect, vi } from 'vitest'
import { generateCostReportPDF } from './pdf-generator'

// We need to define these so they are available in the test scope for expectations
const mockSave = vi.fn()
const mockAddFileToVFS = vi.fn()
const mockAddFont = vi.fn()

vi.mock('jspdf', () => {
    return {
        jsPDF: class {
            setFont = vi.fn()
            setFontSize = vi.fn()
            setTextColor = vi.fn()
            text = vi.fn()
            save = mockSave
            addFileToVFS = mockAddFileToVFS
            addFont = mockAddFont
            internal = {
                pageSize: { height: 297 },
                getNumberOfPages: vi.fn().mockReturnValue(1)
            }
            setPage = vi.fn()
            addPage = vi.fn()
        }
    }
})

// Mock jspdf-autotable
vi.mock('jspdf-autotable', () => ({
    default: vi.fn()
}))

describe('generateCostReportPDF', () => {
    it('should generate pdf file with correct data', () => {
        const mockCosts = [
            {
                date: new Date('2025-01-01'),
                jobTitle: 'Job 1',
                category: 'Material',
                description: 'Desc',
                amount: 100,
                status: 'APPROVED',
                createdBy: 'User 1',
                currency: 'TL'
            }
        ]

        generateCostReportPDF(mockCosts)

        expect(mockSave).toHaveBeenCalledWith(expect.stringContaining('Maliyet_Raporu_'))
    })
})
