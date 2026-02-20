"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VarianceData {
    id: string;
    jobNo: string | null;
    title: string;
    customerName: string;
    status: string;
    plannedCost: number;
    actualCost: number;
    costVariance: number;
    plannedDuration: number;
    actualDuration: number;
    timeVariance: number;
}

interface VarianceTableProps {
    data: VarianceData[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
    'PENDING': { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800' },
    'IN_PROGRESS': { label: 'Devam Ediyor', className: 'bg-blue-100 text-blue-800' },
    'COMPLETED': { label: 'Tamamlandı', className: 'bg-green-100 text-green-800' },
    'CANCELLED': { label: 'İptal Edildi', className: 'bg-red-100 text-red-800' }
};

const formatDuration = (minutes: number) => {
    if (minutes === 0) return '0dk';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}dk`;
    if (mins === 0) return `${hours}sa`;
    return `${hours}sa ${mins}dk`;
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
};

const getVarianceColor = (value: number) => {
    if (value > 0) return "text-red-600 font-bold";
    if (value < 0) return "text-green-600 font-bold";
    return "text-gray-500";
};

export default function VarianceTable({ data }: VarianceTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Planlanan vs. Gerçekleşen (Sapma Analizi)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>İş Bilgisi</TableHead>
                                <TableHead>Müşteri</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="text-right">Planlanan Maliyet</TableHead>
                                <TableHead className="text-right">Gerçek Maliyet</TableHead>
                                <TableHead className="text-right">Maliyet Sapması</TableHead>
                                <TableHead className="text-right">Planlanan Süre</TableHead>
                                <TableHead className="text-right">Gerçek Süre</TableHead>
                                <TableHead className="text-right">Süre Sapması</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.jobNo || 'N/A'}</span>
                                                <span className="font-medium truncate max-w-[150px]" title={item.title}>{item.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[120px] truncate" title={item.customerName}>
                                            {item.customerName}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={cn("whitespace-nowrap", statusConfig[item.status]?.className)}>
                                                {statusConfig[item.status]?.label || item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.plannedCost)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.actualCost)}</TableCell>
                                        <TableCell className={cn("text-right", getVarianceColor(item.costVariance))}>
                                            {item.costVariance > 0 ? '+' : ''}{formatCurrency(item.costVariance)}
                                        </TableCell>
                                        <TableCell className="text-right">{formatDuration(item.plannedDuration)}</TableCell>
                                        <TableCell className="text-right">{formatDuration(item.actualDuration)}</TableCell>
                                        <TableCell className={cn("text-right", getVarianceColor(item.timeVariance))}>
                                            {item.timeVariance > 0 ? '+' : ''}{formatDuration(item.timeVariance)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="h-24 text-center">
                                        Analiz edilecek veri bulunamadı.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
