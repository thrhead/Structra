'use client'

import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { generateJobPDF, JobReportData } from '@/lib/pdf-generator'

interface PDFDownloadButtonProps {
    jobId: string
    variant?: 'default' | 'outline' | 'ghost'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function PDFDownloadButton({ jobId, variant = 'outline', size = 'default' }: PDFDownloadButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        try {
            setIsGenerating(true)

            // Fetch job data
            const response = await fetch(`/api/reports/job/${jobId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch job data')
            }

            const jobData: JobReportData = await response.json()

            // Generate PDF
            generateJobPDF(jobData)

            toast.success('PDF raporu oluşturuldu', {
                description: 'Rapor başarıyla indirildi.'
            })
        } catch (error) {
            console.error('PDF generation error:', error)
            toast.error('PDF oluşturulamadı', {
                description: 'Bir hata oluştu. Lütfen tekrar deneyin.'
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleDownload}
            disabled={isGenerating}
        >
            <FileDown className="h-4 w-4 mr-2" />
            {isGenerating ? 'Oluşturuluyor...' : 'PDF İndir'}
        </Button>
    )
}
