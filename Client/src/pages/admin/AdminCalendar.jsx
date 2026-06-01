import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { bookingApi } from '@/api/bookings'
import { motorApi } from '@/api/motors'
import { formatDate } from '@/utils/formatDate'

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const PALETTE = [
  'bg-gold text-charcoal',
  'bg-blue-400 text-white',
  'bg-emerald-400 text-white',
  'bg-pink-400 text-white',
  'bg-purple-400 text-white',
  'bg-orange-400 text-white',
  'bg-teal-400 text-white',
  'bg-rose-400 text-white',
]

export default function AdminCalendar() {
  const [bookings, setBookings] = useState([])
  const [motors, setMotors] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    Promise.allSettled([bookingApi.getAll(), motorApi.getAll()])
      .then(([bResult, mResult]) => {
        if (bResult.status === 'fulfilled') setBookings(bResult.value)
        if (mResult.status === 'fulfilled') setMotors(mResult.value)
      })
      .finally(() => setLoading(false))
  }, [])

  const motorColorMap = useMemo(() => {
    const map = {}
    motors.forEach((m, i) => {
      map[m.id] = PALETTE[i % PALETTE.length]
    })
    return map
  }, [motors])

  const bookingsByDate = useMemo(() => {
    const map = {}
    bookings.forEach(b => {
      if (b.status === 'CANCELLED') return
      const start = new Date(b.startDate)
      const end = new Date(b.endDate)
      const cur = new Date(start)
      while (cur.toISOString().split('T')[0] <= b.endDate) {
        const key = cur.toISOString().split('T')[0]
        if (!map[key]) map[key] = []
        map[key].push(b)
        cur.setDate(cur.getDate() + 1)
      }
    })
    return map
  }, [bookings])

  const calendarDays = useMemo(() => {
    const year = current.getFullYear()
    const month = current.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startPad = (firstDay.getDay() + 6) % 7

    const days = []
    for (let i = 0; i < startPad; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d))
    }
    return days
  }, [current])

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const todayStr = new Date().toISOString().split('T')[0]

  const selectedBookings = selectedDay ? (bookingsByDate[selectedDay] ?? []) : []

  return (
    <div className="p-7">
      <div className="mb-7">
        <h1 className="text-xl font-bold text-charcoal">Kalender Armada</h1>
        <p className="text-sm text-gray-400 mt-0.5">Lihat jadwal sewa motor per hari</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {motors.map((m, i) => (
          <div key={m.id} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${PALETTE[i % PALETTE.length].split(' ')[0]}`} />
            <span className="text-xs text-gray-500">{m.name}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-bold text-charcoal">
            {MONTH_NAMES[current.getMonth()]} {current.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2.5 border-b border-gray-50">
              {d}
            </div>
          ))}

          {loading ? (
            <div className="col-span-7 py-20 text-center text-sm text-gray-400">Memuat data...</div>
          ) : (
            calendarDays.map((day, idx) => {
              if (!day) return <div key={`pad-${idx}`} className="border-b border-r border-gray-50 min-h-[90px]" />
              const key = day.toISOString().split('T')[0]
              const dayBookings = bookingsByDate[key] ?? []
              const isToday = key === todayStr
              const isSelected = key === selectedDay
              const isPast = key < todayStr

              return (
                <div
                  key={key}
                  onClick={() => setSelectedDay(isSelected ? null : key)}
                  className={`border-b border-r border-gray-50 min-h-[90px] p-2 cursor-pointer transition-colors ${
                    isSelected ? 'bg-gold/8' : isPast ? 'bg-gray-50/50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`text-xs font-semibold mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-charcoal text-white' : isSelected ? 'text-gold' : isPast ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {dayBookings.slice(0, 3).map((b, i) => (
                      <div
                        key={`${b.id}-${i}`}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate ${motorColorMap[b.motorId] ?? 'bg-gray-200 text-gray-600'}`}
                      >
                        {b.motorName}
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-[10px] text-gray-400 pl-1">+{dayBookings.length - 3} lainnya</div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {selectedDay && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-charcoal text-sm">
              Booking pada {selectedDay}
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-xs text-gray-400 hover:text-charcoal transition-colors"
            >
              Tutup
            </button>
          </div>

          {selectedBookings.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <CalendarDays size={20} className="text-gray-200" />
              <p className="text-sm text-gray-400">Tidak ada booking pada tanggal ini</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedBookings.map(b => (
                <div key={b.id} className="flex items-center gap-3 border border-gray-100 rounded-lg px-4 py-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${(motorColorMap[b.motorId] ?? 'bg-gray-200').split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-charcoal">{b.motorName}</p>
                    <p className="text-xs text-gray-400">{b.customerName} · {b.customerPhone}</p>
                    <p className="text-xs text-gray-400">{formatDate(b.startDate)} → {formatDate(b.endDate)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    b.status === 'ACTIVE' ? 'bg-green-50 text-green-600' :
                    b.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {b.status === 'ACTIVE' ? 'Aktif' : b.status === 'PENDING' ? 'Menunggu' : 'Selesai'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
