import { auth } from "@/lib/auth"
import { redirect } from "@/lib/navigation"
import { Link } from "@/lib/navigation"
import { CustomerDialog } from "@/components/admin/customer-dialog"
import { DeleteCustomerButton } from "@/components/admin/delete-customer-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, Building2Icon, PhoneIcon, MailIcon, PencilIcon, BriefcaseIcon, UserIcon, ArrowRightIcon } from "lucide-react"
import { getCustomers } from "@/lib/data/customers"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default async function CustomersPage(props: {
  searchParams: Promise<{ search?: string }>
}) {
  const searchParams = await props.searchParams
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  const { customers } = await getCustomers({
    filter: { search: searchParams.search },
    limit: 50
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Müşteri İlişkileri</p>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">Müşteri Portföyü</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">İş ortaklarınız ve firma detaylarını tek bakışta görün.</p>
        </div>
        <CustomerDialog />
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative max-w-md w-full">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <form>
            <Input
              name="search"
              placeholder="Firma veya yetkili ara..."
              className="pl-12 h-12 rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:ring-4 focus:ring-indigo-500/10 transition-all"
              defaultValue={searchParams.search}
            />
          </form>
        </div>

        {customers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="group relative">
                <Link href={`/admin/customers/${customer.id}`} className="block h-full">
                  <Card className="h-full border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                          <Building2Icon className="h-6 w-6" />
                        </div>
                        <Badge variant={customer.user.isActive ? "default" : "secondary"} className="rounded-full px-3">
                          {customer.user.isActive ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-4">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                          {customer.company}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <UserIcon className="h-3.5 w-3.5" />
                          <span className="truncate">{customer.user.name}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Toplam İş</p>
                          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-bold">
                            <BriefcaseIcon className="h-4 w-4 text-indigo-500" />
                            {customer._count.jobs}
                          </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">İletişim</p>
                          <div className="flex items-center gap-2">
                            {customer.user.phone ? (
                              <PhoneIcon className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <MailIcon className="h-4 w-4 text-amber-500" />
                            )}
                            <span className="text-xs font-medium truncate">Mevcut</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center group-hover:bg-indigo-600 transition-colors">
                      <span className="text-sm font-medium group-hover:text-white transition-colors">Detayları Gör</span>
                      <ArrowRightIcon className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </CardFooter>
                  </Card>
                </Link>

                {/* Actions overlaid to allow separate clicking */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <CustomerDialog
                    customer={customer}
                    trigger={
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full shadow-lg">
                        <PencilIcon className="h-3.5 w-3.5" />
                      </Button>
                    }
                  />
                  <DeleteCustomerButton
                    customerId={customer.id}
                    companyName={customer.company}
                    hasActiveJobs={customer._count.jobs > 0}
                    className="h-8 w-8 rounded-full shadow-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Building2Icon className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
            <p className="text-xl font-medium text-slate-500">Müşteri bulunamadı.</p>
            <p className="text-sm text-slate-400">Farklı bir arama yapmayı deneyin veya yeni bir müşteri ekleyin.</p>
          </div>
        )}
      </div>
    </div>
  )
}
