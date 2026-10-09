'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays as CalendarIcon, LayoutList } from 'lucide-react'

interface ExamDate {
  date: string
  subject: string
  type: string
  time: string
}

const UNIVERSITY_EVENTS = [
  { date: '2026-10-02', title: 'Gandhi Jayanti', type: 'holiday', time: 'All Day' },
  { date: '2026-10-15', title: 'Tech Fest 2026', type: 'university', time: '09:00 AM' },
  { date: '2026-10-16', title: 'Tech Fest 2026', type: 'university', time: '09:00 AM' },
  { date: '2026-10-24', title: 'Diwali', type: 'holiday', time: 'All Day' },
  { date: '2026-10-31', title: 'Kerala Piravi Eve', type: 'holiday', time: 'All Day' },
  { date: '2026-10-10', title: 'Workshop: AI in Health', type: 'university', time: '02:00 PM' },
]

export function CalendarWidget({ exams }: { exams: ExamDate[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'day'>('month')
  
  const today = new Date()

  // Month navigation
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))

  // Day navigation
  const nextDay = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1))
  const prevDay = () => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1))

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const getEventsForDate = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const dayExams = exams.filter(e => e.date.startsWith(dateStr)).map(e => ({ ...e, eventType: 'exam' as const }))
    const dayUniv = UNIVERSITY_EVENTS.filter(e => e.date === dateStr).map(e => ({ ...e, eventType: e.type as 'university' | 'holiday' }))
    return [...dayExams, ...dayUniv]
  }

  const handleDayClick = (d: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), d))
    setView('day')
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-[var(--color-surface-accent)]">
         {/* Header */}
         <div className="flex items-center justify-between bg-[var(--color-primary)] p-5 text-white">
           <div className="flex rounded-full bg-white/15 p-1">
             <button 
               onClick={() => setView('month')} 
               className={`p-2 rounded-full transition-colors ${view === 'month' ? 'bg-white text-[var(--color-primary)]' : 'text-white/85 hover:text-white'}`}
             >
               <CalendarIcon size={16} strokeWidth={2.5} />
             </button>
             <button 
               onClick={() => setView('day')} 
               className={`p-2 rounded-full transition-colors ${view === 'day' ? 'bg-white text-[var(--color-primary)]' : 'text-white/85 hover:text-white'}`}
             >
               <LayoutList size={16} strokeWidth={2.5} />
             </button>
           </div>
           
           <div className="flex items-center gap-4">
             <h3 className="font-display text-base font-bold text-white">
               {view === 'month' 
                 ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                 : selectedDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })
               }
             </h3>
             <div className="flex gap-1">
               <button onClick={view === 'month' ? prevMonth : prevDay} className="p-1.5 rounded-full text-white/90 hover:bg-white/15 hover:text-white transition-colors cursor-pointer">
                 <ChevronLeft size={16} strokeWidth={2.5} />
               </button>
               <button onClick={view === 'month' ? nextMonth : nextDay} className="p-1.5 rounded-full text-white/90 hover:bg-white/15 hover:text-white transition-colors cursor-pointer">
                 <ChevronRight size={16} strokeWidth={2.5} />
               </button>
             </div>
           </div>
         </div>
         
         {/* Body */}
         <div className="px-5 py-5">
            {view === 'month' ? (
              <div className="animate-fade-up" style={{ animationDuration: '0.2s' }}>
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-[var(--color-text-muted)] font-medium">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-sm">
                  {blanks.map(b => <div key={`blank-${b}`} className="h-10" />)}
                  {days.map(d => {
                     const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), d)
                     const events = getEventsForDate(dateObj)
                     const isHoliday = events.some(e => e.eventType === 'holiday')
                     const hasExam = events.some(e => e.eventType === 'exam')
                     const hasUniv = events.some(e => e.eventType === 'university')
                     
                     const isToday = d === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
                     const isSelected = d === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() && currentDate.getFullYear() === selectedDate.getFullYear()

                     return (
                       <div 
                         key={d} 
                         onClick={() => handleDayClick(d)} 
                         className="relative flex flex-col justify-center items-center group cursor-pointer h-10"
                       >
                         <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors font-medium
                           ${isToday ? 'bg-[var(--color-primary)] text-white font-bold' : 
                             isSelected ? 'bg-[var(--color-primary-soft)] text-[var(--color-primary)] font-bold' :
                             isHoliday ? 'text-[#B42318] font-bold hover:bg-[var(--color-surface-accent-hover)]' : 
                             'hover:bg-[var(--color-surface-accent-hover)] text-[var(--color-ink)]'}`}
                         >
                           {d}
                         </div>
                         {/* Indicators */}
                         <div className="absolute bottom-0 flex gap-0.5 mt-1">
                           {hasExam && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]"></div>}
                           {hasUniv && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-glow)]"></div>}
                         </div>
                       </div>
                     )
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-fade-up" style={{ animationDuration: '0.2s' }}>
                <h4 className="text-sm font-semibold text-[var(--color-text-muted)] mb-3">
                  {selectedDate.toLocaleDateString('en-GB', { weekday: 'long' })}
                </h4>
                
                {(() => {
                  const events = getEventsForDate(selectedDate)
                  if (events.length === 0) {
                    return (
                      <div className="py-10 text-center text-[var(--color-text-muted)] text-sm bg-[var(--color-surface-accent-hover)] rounded-2xl">
                        No activities scheduled.
                      </div>
                    )
                  }
                  return (
                    <div className="space-y-2">
                       {events.map((e, i) => (
                         <div key={i} className={`p-4 rounded-2xl ${
                           e.eventType === 'holiday' ? 'bg-[#F3DEDB]' : e.eventType === 'exam' ? 'bg-[var(--color-primary-soft)]' : 'bg-[var(--color-primary-light)]'
                         } flex flex-col`}>
                           <div className="flex justify-between items-start mb-1">
                             <span className={`text-xs font-semibold ${
                               e.eventType === 'holiday' ? 'text-[#B42318]' : 'text-[var(--color-primary)]'
                             }`}>
                               {e.eventType === 'holiday' ? 'Holiday' : e.eventType === 'exam' ? 'Examination' : 'University Event'}
                             </span>
                             <span className={`text-xs ${
                               'text-[var(--color-text-muted)]'
                             }`}>
                               {e.time}
                             </span>
                           </div>
                           <p className={`font-semibold text-sm text-[var(--color-ink)]`}>
                             {'subject' in e ? e.subject : e.title}
                           </p>
                           {'type' in e && e.type !== 'university' && e.type !== 'holiday' && (
                             <p className="text-xs text-[var(--color-text-muted)] mt-1">
                               {e.type}
                             </p>
                           )}
                         </div>
                       ))}
                    </div>
                  )
                })()}
              </div>
            )}
         </div>
    </div>
  )
}
