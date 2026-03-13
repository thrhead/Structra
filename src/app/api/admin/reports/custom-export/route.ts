import { NextResponse } from 'next/server';
import { verifyAdminOrManager } from '@/lib/auth-helper';
import * as ReportsData from '@/lib/data/reports';
import * as PDFGen from '@/lib/pdf-generator';
import * as ExcelGen from '@/lib/excel-generator';
import * as XLSX from 'xlsx';

export async function GET(req: Request) {
    const session = await verifyAdminOrManager(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format') || 'pdf';
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');
    const customerId = searchParams.get('customerId');

    const startDate = fromStr ? new Date(fromStr) : new Date(0);
    const endDate = toStr ? new Date(toStr) : new Date();

    try {
        let data: any;
        let filename = `Report_${type}_${new Date().getTime()}`;

        switch (type) {
            case 'profitability':
                data = await ReportsData.getProfitabilityData(startDate, endDate, customerId || undefined);
                if (format === 'pdf') {
                    const doc = PDFGen.generateProfitabilityPDF(data);
                    return servePDF(doc, `${filename}.pdf`);
                } else {
                    const wb = ExcelGen.generateProfitabilityWorkbook(data);
                    return serveExcel(wb, `${filename}.xlsx`);
                }

            case 'delay':
                data = await ReportsData.getDelayAnalysisData(startDate, endDate);
                if (format === 'pdf') {
                    const doc = PDFGen.generateDelayPDF(data);
                    return servePDF(doc, `${filename}.pdf`);
                } else {
                    const wb = ExcelGen.generateDelayWorkbook(data);
                    return serveExcel(wb, `${filename}.xlsx`);
                }

            case 'capacity':
                data = await ReportsData.getTeamCapacityData();
                if (format === 'pdf') {
                    const doc = PDFGen.generateCapacityPDF(data);
                    return servePDF(doc, `${filename}.pdf`);
                } else {
                    const wb = ExcelGen.generateTeamCapacityWorkbook(data);
                    return serveExcel(wb, `${filename}.xlsx`);
                }

            case 'personnel':
                data = await ReportsData.getPersonnelPerformanceData(startDate, endDate);
                if (format === 'pdf') {
                    const doc = PDFGen.generatePersonnelPDF(data);
                    return servePDF(doc, `${filename}.pdf`);
                } else {
                    const wb = XLSX.utils.book_new();
                    const ws = XLSX.utils.json_to_sheet(data);
                    XLSX.utils.book_append_sheet(wb, ws, 'Personel');
                    return serveExcel(wb, `${filename}.xlsx`);
                }

            case 'financial':
                data = await ReportsData.getFinancialSummaryData(startDate, endDate);
                if (format === 'pdf') {
                    const doc = PDFGen.generateFinancialPDF(data);
                    return servePDF(doc, `${filename}.pdf`);
                } else {
                    const wb = XLSX.utils.book_new();
                    const ws = XLSX.utils.json_to_sheet(data.recentCosts);
                    XLSX.utils.book_append_sheet(wb, ws, 'Finansal');
                    return serveExcel(wb, `${filename}.xlsx`);
                }

            default:
                return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
        }
    } catch (error) {
        console.error("Custom export error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function servePDF(doc: any, filename: string) {
    const buffer = doc.output('arraybuffer');
    return new NextResponse(Buffer.from(buffer), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
}

function serveExcel(wb: any, filename: string) {
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return new NextResponse(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="${filename}"`
        }
    });
}
