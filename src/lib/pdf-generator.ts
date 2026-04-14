import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { DEJAVU_SANS_NORMAL, DEJAVU_SANS_BOLD } from './fonts/dejavu-fonts'

export interface JobReportData {
    id: string
    title: string
    status: string
    priority: string
    location: string
    scheduledDate: Date | null
    completedDate: Date | null
    signatureUrl?: string | null
    customer: {
        company: string
        address: string
        user: {
            name: string
            phone: string
            email: string
        }
    }
    steps: Array<{
        title: string
        isCompleted: boolean
        completedAt?: Date | null
        completedBy?: { name: string | null } | null
        order: number
        subSteps?: Array<{
            title: string
            isCompleted: boolean
            completedAt?: Date | null
        }>
    }>
    costs: Array<{
        amount: number
        category: string
        description: string
        status: string
        date: Date
    }>
    team?: {
        name: string
        members: Array<{
            user: {
                name: string
                role: string
            }
        }>
    }
}

export function generateJobPDF(data: JobReportData) {
    const doc = new jsPDF()

    // Add Turkish font support
    doc.addFileToVFS('DejaVuSans.ttf', DEJAVU_SANS_NORMAL)
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal')
    doc.addFileToVFS('DejaVuSans-Bold.ttf', DEJAVU_SANS_BOLD)
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold')
    doc.setFont('DejaVuSans')

    // Professional branding tokens
    const BRAND_COLOR = [15, 23, 42] // Slate-900 for enterprise feel
    const ACCENT_COLOR = [22, 163, 74] // Green-600 for status
    const companyName = "ASSEMBLY TRACKER"
    const companySlogan = "Kurumsal Saha Operasyon Yonetim Sistemi"

    let yPos = 20

    // Header Branding
    doc.setFillColor(248, 250, 252)
    doc.rect(0, 0, 210, 45, 'F')

    doc.setFont('DejaVuSans', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2])
    doc.text(companyName, 20, 25)

    doc.setFont('DejaVuSans', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(companySlogan, 20, 32)
    doc.text('Vergi Dairesi: Bogazici | Vergi No: 1234567890', 20, 38)

    doc.setFontSize(10)
    doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2])
    doc.text(`EVRAK NO: #${data.id.substring(0, 12).toUpperCase()}`, 190, 25, { align: 'right' })
    doc.text(`DUZENLEME TARIHI: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, 190, 32, { align: 'right' })

    yPos = 60

    // Job Title Section
    doc.setFontSize(18)
    doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2])
    doc.text(data.title.toUpperCase(), 20, yPos)

    yPos += 10
    doc.setDrawColor(ACCENT_COLOR[0], ACCENT_COLOR[1], ACCENT_COLOR[2])
    doc.setLineWidth(1)
    doc.line(20, yPos, 190, yPos)

    yPos += 15

    // Summary Section with nested tables for alignment
    const summaryData: any[][] = [
        [{ content: 'MÜŞTERİ BİLGİLERİ', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: 'İŞ DETAYLARI', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold', fillColor: [241, 245, 249] } }],
        ['Şirket', data.customer.company, 'Durum', data.status === 'COMPLETED' ? 'TAMAMLANDI' : 'İŞLEMDE'],
        ['İlgili', data.customer.user.name, 'Öncelik', data.priority],
        ['Konum', data.location || '-', 'Tamamlanma', data.completedDate ? format(new Date(data.completedDate), 'dd.MM.yyyy') : '-']
    ]

    autoTable(doc, {
        startY: yPos,
        body: summaryData,
        theme: 'grid',
        styles: { font: 'DejaVuSans', fontSize: 8, cellPadding: 3, lineColor: [226, 232, 240] },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 30 },
            1: { cellWidth: 60 },
            2: { fontStyle: 'bold', cellWidth: 30 },
            3: { fontStyle: 'bold' }
        }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Steps Section
    doc.setFontSize(12)
    doc.setTextColor(BRAND_COLOR[0], BRAND_COLOR[1], BRAND_COLOR[2])
    doc.text('TEKNİK İŞLEM ADIMLARI', 20, yPos)
    yPos += 6

    const stepsData = data.steps.map(step => [
        step.order.toString(),
        {
            content: `${step.title}${step.isCompleted ? `\nTamamlayan: ${step.completedBy?.name || 'Belirtilmemiş'}\nZaman: ${step.completedAt ? format(new Date(step.completedAt), 'dd.MM.yyyy HH:mm') : '-'}` : ''}`,
            styles: { halign: 'left' }
        },
        step.isCompleted ? '✓ TAMAM' : '○ BEKLİYOR'
    ])

    autoTable(doc, {
        startY: yPos,
        head: [['SIRA', 'AÇIKLAMA VE AYRINTILAR', 'DURUM']],
        body: stepsData as any,
        theme: 'striped',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: BRAND_COLOR as [number, number, number], fontSize: 9, halign: 'center' },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            2: { halign: 'center', cellWidth: 35 }
        },
        styles: { font: 'DejaVuSans', fontSize: 8, cellPadding: 3 }
    })

    yPos = (doc as any).lastAutoTable.finalY + 15

    // Costs Section
    if (data.costs && data.costs.length > 0) {
        doc.setFontSize(12)
        doc.text('MALİYET VE EKLEME DETAYLARI', 20, yPos)
        yPos += 6

        const costsData = data.costs.map(c => [
            format(new Date(c.date), 'dd.MM.yyyy'),
            c.description,
            c.category,
            `₺${c.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
        ])

        autoTable(doc, {
            startY: yPos,
            head: [['TARİH', 'AÇIKLAMA', 'KATEGORİ', 'TUTAR']],
            body: costsData,
            theme: 'grid',
            headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [71, 85, 105], fontSize: 9 },
            styles: { font: 'DejaVuSans', fontSize: 8 },
            columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } }
        })

        yPos = (doc as any).lastAutoTable.finalY + 15
    }

    // Signature Area
    if (yPos > 240) { doc.addPage(); yPos = 30 }

    doc.setDrawColor(226, 232, 240)
    doc.line(20, yPos, 190, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('DİJİTAL ONAY VE İMZA', 20, yPos)

    yPos += 10
    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Müşteri Yetkilisi:', 20, yPos)
    doc.text('Saha Personeli:', 110, yPos)

    yPos += 5
    if (data.signatureUrl) {
        try {
            doc.addImage(data.signatureUrl, 'PNG', 20, yPos, 45, 20)
        } catch (e) {
            doc.text('[Imza Kayitli]', 20, yPos + 10)
        }
    } else {
        doc.text('____________________', 20, yPos + 10)
    }
    doc.text('____________________', 110, yPos + 10)

    yPos += 30
    doc.setFont('DejaVuSans', 'bold')
    doc.text(data.customer.user.name, 20, yPos)
    doc.text(data.team?.name || 'Yetkili Personel', 110, yPos)

    // Legal Footer & Page Numbers
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(7)
        doc.setTextColor(150, 150, 150)

        // Horizontal Line above footer
        doc.setDrawColor(241, 245, 249)
        doc.line(20, 280, 190, 280)

        doc.text(`Bu rapor Assembly Tracker tarafından güvenli bir şekilde oluşturulmuştur. Tüm hakları saklıdır.`, 20, 285)
        doc.text(`SAYFA ${i} / ${pageCount}`, 190, 285, { align: 'right' })
    }

    return doc
}

export function generateCostReportPDF(costs: Array<{
    date: Date,
    jobTitle: string,
    category: string | null,
    description: string,
    amount: number,
    status: string,
    createdBy: string
}>) {
    const doc = new jsPDF()

    // Add Turkish font support
    doc.addFileToVFS('DejaVuSans.ttf', DEJAVU_SANS_NORMAL)
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal')
    doc.addFileToVFS('DejaVuSans-Bold.ttf', DEJAVU_SANS_BOLD)
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold')
    doc.setFont('DejaVuSans')

    let yPos = 20

    // Header
    doc.setFontSize(20)
    doc.setTextColor(22, 163, 74) // Green-600
    doc.text('Maliyet Raporu', 105, yPos, { align: 'center' })

    yPos += 15
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Oluşturulma Tarihi: ${format(new Date(), 'dd MMMM yyyy, HH:mm', { locale: tr })}`, 105, yPos, { align: 'center' })

    yPos += 15

    const costsData = costs.map(cost => [
        format(new Date(cost.date), 'dd/MM/yyyy', { locale: tr }),
        cost.jobTitle,
        cost.category || '-',
        cost.description,
        `₺${cost.amount.toFixed(2)}`,
        cost.status,
        cost.createdBy
    ])

    const totalCost = costs
        .filter(c => c.status === 'APPROVED')
        .reduce((sum, c) => sum + c.amount, 0)

    autoTable(doc, {
        startY: yPos,
        head: [['Tarih', 'İş', 'Kategori', 'Açıklama', 'Tutar', 'Durum', 'Oluşturan']],
        body: costsData,
        foot: [['', '', '', 'Toplam Onaylı:', `₺${totalCost.toFixed(2)}`, '', '']],
        theme: 'striped',
        styles: { font: 'DejaVuSans', fontSize: 8, cellPadding: 2 },
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [22, 163, 74] },
        footStyles: { font: 'DejaVuSans', fillColor: [248, 250, 252], fontStyle: 'bold' }
    })

    // Footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
            `Sayfa ${i} / ${pageCount}`,
            105,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
        )
    }

    const filename = `Maliyet_Raporu_${format(new Date(), 'yyyyMMdd')}.pdf`
    doc.save(filename)
}

// 1. Kârlılık Raporu PDF
export function generateProfitabilityPDF(data: any[]) {
    const doc = new jsPDF();
    setupPDF(doc);
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('KÂRLILIK RAPORU', 105, yPos, { align: 'center' });
    yPos += 10;
    doc.setFontSize(10);
    doc.text(`Tarih: ${format(new Date(), 'dd.MM.yyyy')}`, 105, yPos, { align: 'center' });
    yPos += 10;

    const tableData = data.map(item => [
        item.jobNo,
        item.title,
        item.customer,
        `₺${item.budget.toLocaleString('tr-TR')}`,
        `₺${item.totalCost.toLocaleString('tr-TR')}`,
        `₺${item.profit.toLocaleString('tr-TR')}`,
        `%${item.profitMargin.toFixed(1)}`
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['İş No', 'Başlık', 'Müşteri', 'Bütçe', 'Maliyet', 'Kâr', 'Marj']],
        body: tableData,
        theme: 'grid',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [15, 23, 42] },
        styles: { font: 'DejaVuSans', fontSize: 8 }
    });

    return doc;
}

// 4. Gecikme Analizi PDF
export function generateDelayPDF(data: any[]) {
    const doc = new jsPDF();
    setupPDF(doc);
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('GECİKME VE DARBOĞAZ ANALİZİ', 105, yPos, { align: 'center' });
    yPos += 15;

    const tableData = data.map(item => [
        item.jobNo,
        item.title,
        Math.round(item.estimatedDuration).toString(),
        Math.round(item.actualDuration).toString(),
        Math.round(item.delay).toString(),
        item.blockedStepsCount.toString()
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['İş No', 'Başlık', 'Tahmini (dk)', 'Gerçek (dk)', 'Gecikme (dk)', 'Blokajlar']],
        body: tableData,
        theme: 'grid',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [15, 23, 42] },
        styles: { font: 'DejaVuSans', fontSize: 8 }
    });

    return doc;
}

// 5. Ekip Kapasite PDF
export function generateCapacityPDF(data: any[]) {
    const doc = new jsPDF();
    setupPDF(doc);
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('EKİP KAPASİTE VE İŞ YÜKÜ RAPORU', 105, yPos, { align: 'center' });
    yPos += 15;

    const tableData = data.map(item => [
        item.teamName,
        item.activeJobsCount.toString(),
        item.memberCount.toString(),
        `%${item.loadFactor.toFixed(1)}`
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Ekip Adı', 'Aktif İşler', 'Üye Sayısı', 'Doluluk Oranı']],
        body: tableData,
        theme: 'grid',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [71, 85, 105] },
        styles: { font: 'DejaVuSans', fontSize: 9 }
    });

    return doc;
}

// 2. Personel Performans PDF
export function generatePersonnelPDF(data: any[]) {
    const doc = new jsPDF();
    setupPDF(doc);
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('PERSONEL PERFORMANS RAPORU', 105, yPos, { align: 'center' });
    yPos += 10;

    const tableData = data.map(item => [
        item.name,
        item.teamName,
        item.completedStepsCount.toString()
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Personel', 'Ekip', 'Tamamlanan Adım']],
        body: tableData,
        theme: 'striped',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [22, 163, 74] },
        styles: { font: 'DejaVuSans', fontSize: 9 }
    });

    return doc;
}

// 3. Finansal Özet PDF
export function generateFinancialPDF(summary: any) {
    const doc = new jsPDF();
    setupPDF(doc);
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('FİNANSAL ÖZET RAPORU', 105, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(12);
    doc.text(`Toplam Onaylı Harcama: ₺${summary.totalApproved.toLocaleString('tr-TR')}`, 20, yPos);
    yPos += 15;

    const tableData = summary.recentCosts.map((c: any) => [
        format(new Date(c.date), 'dd.MM.yyyy'),
        c.jobTitle,
        c.description,
        `₺${c.amount.toLocaleString('tr-TR')}`
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Tarih', 'İş', 'Açıklama', 'Tutar']],
        body: tableData,
        theme: 'grid',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [71, 85, 105] },
        styles: { font: 'DejaVuSans', fontSize: 8 }
    });

    return doc;
}

// Helper to setup PDF fonts
function setupPDF(doc: jsPDF) {
    doc.addFileToVFS('DejaVuSans.ttf', DEJAVU_SANS_NORMAL);
    doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    doc.addFileToVFS('DejaVuSans-Bold.ttf', DEJAVU_SANS_BOLD);
    doc.addFont('DejaVuSans-Bold.ttf', 'DejaVuSans', 'bold');
    doc.setFont('DejaVuSans');
}
// 6. �� Ak��� Denetimi PDF
export function generateWorkflowAuditPDF(data: any[]) {
    const doc = new jsPDF();
    setupPDF(doc);
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('�� AKI�I DENET�M RAPORU', 105, yPos, { align: 'center' });
    yPos += 15;

    data.forEach((job, index) => {
        if (yPos > 240) { doc.addPage(); yPos = 20; }
        
        doc.setFontSize(10);
        doc.setFont('DejaVuSans', 'bold');
        doc.text(${job.jobNo} -  (), 20, yPos);
        yPos += 7;

        const tableData = job.steps.map((step: any) => [
            step.title,
            step.completedBy,
            step.completedAt ? format(new Date(step.completedAt), 'dd.MM HH:mm') : '-',
            step.approvedBy,
            ${Math.round(step.duration)} dk
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Ad�m', 'Bitiren', 'Zaman', 'Onaylayan', 'S�re']],
            body: tableData,
            theme: 'striped',
            headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [71, 85, 105], fontSize: 8 },
            styles: { font: 'DejaVuSans', fontSize: 7, cellPadding: 2 }
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
    });

    return doc;
}

// 7. Detayl� Maliyet Analizi PDF
export function generateCostDetailsPDF(data: any[]) {
    const doc = new jsPDF();
    setupPDF(doc);
    let yPos = 20;

    doc.setFontSize(18);
    doc.text('DETAYLI MAL�YET ANAL�Z�', 105, yPos, { align: 'center' });
    yPos += 15;

    const tableData = data.map(item => [
        format(new Date(item.date), 'dd.MM.yyyy'),
        item.jobNo,
        item.jobTitle,
        item.category || '-',
        item.description,
        ?
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Tarih', '�� No', '�� Ba�l���', 'Kategori', 'A��klama', 'Tutar']],
        body: tableData,
        theme: 'grid',
        headStyles: { font: 'DejaVuSans', fontStyle: 'bold', fillColor: [22, 163, 74] },
        styles: { font: 'DejaVuSans', fontSize: 7 }
    });

    return doc;
}
