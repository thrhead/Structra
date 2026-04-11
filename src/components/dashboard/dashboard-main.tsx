import { Card, Metric, Text, BadgeDelta, Flex, Grid } from "@tremor/react";
import { AreaChart } from "@/components/charts/area-chart";
import { CardWrapper } from "@/lib/ui/card-wrapper";
import { SectionContainer } from "@/lib/ui/section-container";
import { PageHeader } from "@/lib/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// --- Mock Data ---
const kpiData = [
  { title: "Aktif Görev", metric: "124", delta: "12.5%", deltaType: "moderateIncrease" },
  { title: "Toplam Maliyet", metric: "₺45,231", delta: "1.8%", deltaType: "moderateDecrease" },
  { title: "Saha Personeli", metric: "42", delta: "4.1%", deltaType: "increase" },
  { title: "Onay Bekleyen", metric: "18", delta: "15.3%", deltaType: "decrease" },
];

const chartData = [
  { date: "Oca", "Montajlar": 65, "Tamamlanan": 45 },
  { date: "Şub", "Montajlar": 72, "Tamamlanan": 58 },
  { date: "Mar", "Montajlar": 86, "Tamamlanan": 74 },
  { date: "Nis", "Montajlar": 94, "Tamamlanan": 85 },
  { date: "May", "Montajlar": 110, "Tamamlanan": 98 },
  { date: "Haz", "Montajlar": 125, "Tamamlanan": 115 },
];

const jobsData = [
  { id: "JOB-4821", name: "Endüstriyel Fan Montajı", status: "completed", worker: "Ahmet Yılmaz", date: "2024-06-15" },
  { id: "JOB-4822", name: "HVAC Sistem Bakımı", status: "pending", worker: "Mehmet Demir", date: "2024-06-16" },
  { id: "JOB-4823", name: "Boru Hattı İzolasyonu", status: "delayed", worker: "Can Özkan", date: "2024-06-12" },
  { id: "JOB-4824", name: "Pano Kurulumu", status: "completed", worker: "Ali Çelik", date: "2024-06-14" },
  { id: "JOB-4825", name: "Soğutma Kulesi Testi", status: "pending", worker: "Ahmet Yılmaz", date: "2024-06-17" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200 shadow-none">Tamamlandı</Badge>;
    case "pending":
      return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200 shadow-none">Bekliyor</Badge>;
    case "delayed":
      return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-200 shadow-none">Gecikti</Badge>;
    default:
      return <Badge variant="outline" className="shadow-none">{status}</Badge>;
  }
};

export async function DashboardMain() {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Genel Bakış" 
        description="Saha operasyonları ve güncel metrikler"
        actions={
          <>
            <Button variant="outline" className="hidden sm:flex bg-white dark:bg-slate-900 border-border/50 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
              <UserPlus className="mr-2 h-4 w-4" />
              Yeni Kullanıcı
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Yeni İş Oluştur
            </Button>
          </>
        }
      />

      <SectionContainer>
        <Grid numItemsSm={2} numItemsLg={4} className="gap-6">
          {kpiData.map((item) => (
            <Card key={item.title} decoration="top" decorationColor="blue" className="bg-white dark:bg-slate-900 border-border/50 ring-0 shadow-sm">
              <Flex alignItems="start">
                <div>
                  <Text className="text-slate-500 dark:text-slate-400 font-medium">{item.title}</Text>
                  <Metric className="text-slate-900 dark:text-white mt-2">{item.metric}</Metric>
                </div>
                <BadgeDelta deltaType={item.deltaType as any}>{item.delta}</BadgeDelta>
              </Flex>
            </Card>
          ))}
        </Grid>
      </SectionContainer>

      <SectionContainer>
        <CardWrapper padding="default">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Aylık Operasyon Performansı</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Son 6 aydaki montaj ve tamamlanma oranları</p>
          </div>
          <AreaChart 
            data={chartData}
            index="date"
            categories={["Montajlar", "Tamamlanan"]}
            colors={["blue", "emerald"]}
            className="h-72 mt-4"
          />
        </CardWrapper>
      </SectionContainer>

      <SectionContainer>
        <CardWrapper padding="none" className="overflow-hidden">
          <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Son İşler</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Saha personelinin güncel görev durumları</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-[120px] font-medium text-slate-600 dark:text-slate-300">ID</TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-300">İş Adı</TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-300">Durum</TableHead>
                  <TableHead className="font-medium text-slate-600 dark:text-slate-300">Atanan Personel</TableHead>
                  <TableHead className="text-right font-medium text-slate-600 dark:text-slate-300">Tarih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobsData.map((job) => (
                  <TableRow key={job.id} className="border-border/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-200">{job.id}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{job.name}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300">{job.worker}</TableCell>
                    <TableCell className="text-right text-slate-500 dark:text-slate-400">{job.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardWrapper>
      </SectionContainer>
    </div>
  );
}
