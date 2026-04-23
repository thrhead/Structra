'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getCalendarEventsAction } from '@/lib/actions/calendar'

export default function Calendar() {
    const router = useRouter()
    const [events, setEvents] = useState<any[]>([])
    const [filteredEvents, setFilteredEvents] = useState<any[]>([])
    const [view, setView] = useState('dayGridMonth')
    const [searchQuery, setSearchQuery] = useState('')

    const fetchEvents = async (info: any) => {
        try {
            // Using Server Action instead of API fetch
            // But FullCalendar fetchEvents expects a promise or array.
            // Since we can't export server action from this file (it's 'use client'),
            // we need to import it.
            // Note: Server actions are async functions.

            const start = new Date(info.startStr)
            const end = new Date(info.endStr)

            const data = await getCalendarEventsAction(start, end)
            setEvents(data)
            setFilteredEvents(data)
        } catch (error: any) {
            console.error('Failed to fetch calendar events:', error)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)
        if (!query) {
            setFilteredEvents(events)
        } else {
            const filtered = events.filter(ev =>
                ev.title.toLowerCase().includes(query) ||
                (ev.extendedProps?.location && ev.extendedProps.location.toLowerCase().includes(query)) ||
                (ev.extendedProps?.customer && ev.extendedProps.customer.toLowerCase().includes(query))
            )
            setFilteredEvents(filtered)
        }
    }

    return (
        <Card className="h-full flex flex-col border-0 shadow-sm">
            <CardHeader className="pb-4 border-b px-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-50/50 gap-4">
                <CardTitle className="text-xl text-slate-800 font-bold">Takvim ve Kaynak Planlama</CardTitle>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            type="text"
                            placeholder="İş, müşteri veya konum ara..."
                            className="pl-9 bg-white"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <Button onClick={() => router.push('/admin/jobs/new')} className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Görev
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-6">
                <style jsx global>{`
          .fc {
            height: 100%;
            font-family: inherit;
          }
          .fc-toolbar-title {
            font-size: 1.25rem !important;
            font-weight: 700;
            color: #1e293b;
          }
          .fc-button {
            border-radius: 0.5rem !important;
            text-transform: capitalize !important;
            font-weight: 500 !important;
          }
          .fc-button-primary {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
            color: #334155 !important;
            transition: all 0.2s;
          }
          .fc-button-primary:hover {
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
            color: #0f172a !important;
          }
          .fc-button-active, .fc-button-active:hover {
            background-color: #f1f5f9 !important;
            border-color: #cbd5e1 !important;
            color: #0f172a !important;
            font-weight: 600 !important;
          }
          .fc-theme-standard td, .fc-theme-standard th {
            border-color: #e2e8f0;
          }
          .fc-col-header-cell-cushion {
            color: #475569;
            font-weight: 600;
            padding: 8px 0 !important;
          }
          .fc-daygrid-day-number {
            color: #334155;
            font-weight: 500;
          }
          .fc-event {
            border-radius: 4px;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            border: none !important;
          }
          .fc-timegrid-slot-label-cushion {
            color: #64748b;
          }
        `}</style>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView={view}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    locale="tr"
                    buttonText={{
                        today: 'Bugün',
                        month: 'Ay',
                        week: 'Hafta',
                        day: 'Gün'
                    }}
                    events={filteredEvents}
                    datesSet={(dateInfo: { startStr: string; endStr: string; view: { type: string } }) => {
                        fetchEvents(dateInfo)
                        setView(dateInfo.view.type)
                    }}
                    eventContent={(eventInfo: { timeText: string; event: { title: string; extendedProps: any } }) => {
                        return (
                            <div className="overflow-hidden text-xs p-1 cursor-pointer flex flex-col gap-0.5">
                                {eventInfo.timeText && <div className="font-semibold opacity-90">{eventInfo.timeText}</div>}
                                <div className="truncate font-medium flex-1">{eventInfo.event.title}</div>
                                {eventInfo.event.extendedProps?.location && (
                                    <div className="truncate opacity-75 text-[10px]">📍 {eventInfo.event.extendedProps.location}</div>
                                )}
                            </div>
                        )
                    }}
                    eventClick={(info: { event: { id: string } }) => {
                        router.push(`/admin/jobs/${info.event.id}`)
                    }}
                    height="100%"
                    allDaySlot={true}
                    firstDay={1}
                    nowIndicator={true}
                    scrollTime="08:00:00"
                    expandRows={true}
                />
            </CardContent>
        </Card>
    )
}
