import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { DEJAVU_SANS_NORMAL, DEJAVU_SANS_BOLD } from './fonts/dejavu-fonts'

export interface ProformaData {
    id: string
    title: string
    currency: string
    customer: {
        company: string
        address: string
        taxId?: string
    }
    items: Array<{
        description: string
        quantity: number
        price: number
    }>
    completedDate: Date | null
}

export function generateProformaPDF(data: ProformaData) {
    const doc = new jsPDF()

    // Add Turkish font support
    doc.addFileToVFS('DejaVuSans.ttf', DEJAVU_SANS_NORMAL)
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal')
    doc.addFileToVFS('DejaVuSans-Bold.ttf', DEJAVU_SANS_BOLD)
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold')
    doc.setFont('DejaVuSans')

    const currencySymbol = data.currency === 'TRY' ? '₺' : '$'
    const locale = data.currency === 'TRY' ? 'tr-TR' : 'en-US'

    // Header Background
    doc.setFillColor(15, 23, 42) // Slate-900
    doc.rect(0, 0, 210, 50, 'F')

    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.setFont('DejaVuSans', 'bold')
    doc.text('PROFORMA FATURA', 20, 30)

    doc.setFontSize(10)
    doc.setFont('DejaVuSans', 'normal')
    doc.text(`Tarih: ${format(new Date(), 'dd MMMM yyyy', { locale: tr })}`, 190, 25, { align: 'right' })
    doc.text(`Fatura No: #${data.id.slice(-8).toUpperCase()}`, 190, 32, { align: 'right' })

    let yPos = 65

    // Seller & Buyer info columns
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(11)
    doc.setFont('DejaVuSans', 'bold')
    doc.text('HİZMET SAĞLAYICI', 20, yPos)
    doc.text('MÜŞTERİ (ALICI)', 120, yPos)

    doc.setDrawColor(203, 213, 225)
    doc.line(20, yPos + 2, 90, yPos + 2)
    doc.line(120, yPos + 2, 190, yPos + 2)

    doc.setFontSize(9)
    doc.setFont('DejaVuSans', 'normal')
    doc.setTextColor(71, 85, 105)
    yPos += 10

    // Seller details
    doc.setFont('DejaVuSans', 'bold')
    doc.text('Assembly Tracker Teknoloji A.Ş.', 20, yPos)
    doc.setFont('DejaVuSans', 'normal')
    doc.text('Yazılım Vadisi No:101, Kat:4', 20, yPos + 5)
    doc.text('34000 Şişli / İstanbul / Türkiye', 20, yPos + 10)
    doc.text('Vergi Dairesi: Boğaziçi V.D.', 20, yPos + 15)
    doc.text('Vergi No: 9876543210', 20, yPos + 20)

    // Buyer details
    doc.setFont('DejaVuSans', 'bold')
    doc.setTextColor(30, 41, 59)
    doc.text(data.customer.company, 120, yPos)
    doc.setFont('DejaVuSans', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.text(data.customer.address || '-', 120, yPos + 5, { maxWidth: 70 })
    if (data.customer.taxId) {
        doc.text(`Vergi/TC No: ${data.customer.taxId}`, 120, yPos + 20)
    }

    yPos += 35

    // Table
    const tableData = data.items.map((item, idx) => [
        (idx + 1).toString(),
        item.description,
        item.quantity.toString(),
        `${item.price.toLocaleString(locale, { minimumFractionDigits: 2 })} ${currencySymbol}`,
        `${(item.quantity * item.price).toLocaleString(locale, { minimumFractionDigits: 2 })} ${currencySymbol}`
    ])

    const subTotal = data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const taxRate = 0.20 // %20 KDV
    const taxAmount = subTotal * taxRate
    const grandTotal = subTotal + taxAmount

    autoTable(doc, {
        startY: yPos,
        head: [['#', 'HİZMET/ÜRÜN AÇIKLAMASI', 'ADET', 'BİRİM FİYAT', 'TOPLAM']],
        body: tableData,
        theme: 'grid',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [15, 23, 42], fontSize: 9, halign: 'center' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 35 },
            4: { halign: 'right', cellWidth: 35 }
        },
        styles: { font: 'DejaVuSans', fontSize: 8, cellPadding: 4, lineColor: [226, 232, 240] }
    })

    yPos = (doc as any).lastAutoTable.finalY + 10

    // Totals Area
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105)
    doc.text('Ara Toplam:', 150, yPos, { align: 'right' })
    doc.text(`${subTotal.toLocaleString(locale, { minimumFractionDigits: 2 })} ${currencySymbol}`, 190, yPos, { align: 'right' })

    yPos += 7
    doc.text('KDV (%20):', 150, yPos, { align: 'right' })
    doc.text(`${taxAmount.toLocaleString(locale, { minimumFractionDigits: 2 })} ${currencySymbol}`, 190, yPos, { align: 'right' })

    yPos += 10
    doc.setFillColor(248, 250, 252)
    doc.rect(130, yPos - 6, 65, 12, 'F')
    doc.setFontSize(11)
    doc.setFont('DejaVuSans', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('GENEL TOPLAM:', 155, yPos + 2, { align: 'right' })
    doc.text(`${grandTotal.toLocaleString(locale, { minimumFractionDigits: 2 })} ${currencySymbol}`, 190, yPos + 2, { align: 'right' })

    yPos += 30

    // Bank & Notes
    doc.setTextColor(30, 41, 59)
    doc.setFontSize(10)
    doc.setFont('DejaVuSans', 'bold')
    doc.text('ÖDEME VE BANKA BİLGİLERİ', 20, yPos)
    doc.setDrawColor(15, 23, 42)
    doc.line(20, yPos + 2, 80, yPos + 2)

    doc.setFont('DejaVuSans', 'normal')
    doc.setTextColor(71, 85, 105)
    doc.setFontSize(9)
    yPos += 10
    doc.text('Banka: GLOBAL TECH BANKASI A.Ş.', 20, yPos)
    doc.text('Şube: İSTANBUL TİCARİ ŞUBE (Kod: 1234)', 20, yPos + 5)
    doc.text('Hesap Adı: Assembly Tracker Teknoloji A.Ş.', 20, yPos + 10)
    doc.text('IBAN: TR56 0006 2000 1234 5678 9012 34', 20, yPos + 15)

    yPos += 25
    doc.setFont('DejaVuSans', 'italic')
    doc.setFontSize(8)
    doc.text('* Ödeme yaparken açıklama kısmına fatura numarasını yazmanız rica olunur.', 20, yPos)

    // Footer
    doc.setFont('DejaVuSans', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    const footerText = 'Bu belge dijital olarak Assembly Tracker uzerinden olusturulmustur ve imzaya gerek yoktur.'
    doc.text(footerText, 105, 285, { align: 'center' })

    doc.save(`Proforma_${data.id.slice(-8).toUpperCase()}.pdf`)
}
