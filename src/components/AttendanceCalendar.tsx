import { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { AttendanceRecord } from '../types';

interface AttendanceCalendarProps {
  history: AttendanceRecord[];
}

export function AttendanceCalendar({ history }: AttendanceCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>('2026-08-28');

  // Month definition: August 2026 (Aug 1, 2026 is Saturday, Aug 3 is Monday)
  // Working days (Mon-Fri) in August 2026
  const augustDays = [
    { day: 3, date: '2026-08-03', weekday: 'Mon' },
    { day: 4, date: '2026-08-04', weekday: 'Tue' },
    { day: 5, date: '2026-08-05', weekday: 'Wed' },
    { day: 6, date: '2026-08-06', weekday: 'Thu' },
    { day: 7, date: '2026-08-07', weekday: 'Fri' },

    { day: 10, date: '2026-08-10', weekday: 'Mon' },
    { day: 11, date: '2026-08-11', weekday: 'Tue' },
    { day: 12, date: '2026-08-12', weekday: 'Wed' },
    { day: 13, date: '2026-08-13', weekday: 'Thu' },
    { day: 14, date: '2026-08-14', weekday: 'Fri' },

    { day: 17, date: '2026-08-17', weekday: 'Mon' },
    { day: 18, date: '2026-08-18', weekday: 'Tue' },
    { day: 19, date: '2026-08-19', weekday: 'Wed' },
    { day: 20, date: '2026-08-20', weekday: 'Thu' },
    { day: 21, date: '2026-08-21', weekday: 'Fri' },

    { day: 24, date: '2026-08-24', weekday: 'Mon' },
    { day: 25, date: '2026-08-25', weekday: 'Tue' },
    { day: 26, date: '2026-08-26', weekday: 'Wed' },
    { day: 27, date: '2026-08-27', weekday: 'Thu' },
    { day: 28, date: '2026-08-28', weekday: 'Fri' },
  ];

  // Group history by date
  const recordsByDate = history.reduce<Record<string, AttendanceRecord[]>>((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {});

  const selectedDateRecords = selectedDay ? recordsByDate[selectedDay] || [] : [];

  return (
    <div className="bg-white rounded-xl border border-[#DEE2E6] shadow-xs p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-gray-100 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#212529]">Attendance Calendar</h3>
            <p className="text-xs text-gray-500">August 2026 Academic Term</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Present (✓)
          </span>
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <XCircle className="w-3.5 h-3.5" /> Absent (✕)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-8">
          <div className="border border-[#DEE2E6] rounded-xl overflow-hidden">
            {/* Weekday Header */}
            <div className="grid grid-cols-5 bg-gray-50 border-b border-[#DEE2E6] text-center text-xs font-bold text-gray-700 py-2.5">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>

            {/* Days Grid (4 weeks x 5 days) */}
            <div className="grid grid-cols-5 divide-x divide-y divide-gray-100 bg-white">
              {augustDays.map(({ day, date }) => {
                const dayRecords = recordsByDate[date] || [];
                const hasAbsent = dayRecords.some((r) => r.status === 'Absent');
                const hasPresent = dayRecords.some((r) => r.status === 'Present');
                const isSelected = selectedDay === date;

                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDay(date)}
                    className={`min-h-[72px] p-2 text-left transition-colors flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-blue-50/90 ring-2 ring-blue-600 ring-inset'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold ${
                        isSelected ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {day}
                      </span>
                      {dayRecords.length > 0 && (
                        <span className="text-[10px] text-gray-400 font-mono">
                          {dayRecords.length} cl
                        </span>
                      )}
                    </div>

                    {/* Status icons row */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {dayRecords.map((r, i) => (
                        <span
                          key={r.id || i}
                          title={`${r.subjectCode}: ${r.status}`}
                          className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center ${
                            r.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {r.status === 'Present' ? '✓' : '✕'}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2">
            Click on any date to inspect specific lecture time slots and attendance logs.
          </p>
        </div>

        {/* Selected Date Inspector Panel */}
        <div className="lg:col-span-4 bg-[#F8F9FA] rounded-xl border border-[#DEE2E6] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
              <h4 className="font-bold text-xs uppercase text-gray-700">
                {selectedDay ? `Log: ${selectedDay}` : 'Select a Day'}
              </h4>
              <span className="text-xs font-mono text-gray-500">
                {selectedDateRecords.length} classes
              </span>
            </div>

            {selectedDateRecords.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDateRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white p-3 rounded-lg border border-[#DEE2E6] text-xs shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-gray-900 block">{rec.subjectName}</span>
                        <span className="text-[11px] text-gray-500 font-mono">{rec.subjectCode} • {rec.slot}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        rec.status === 'Present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400 text-xs">
                No university lecture records on this date (Holiday / Weekend / No class scheduled).
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-gray-500">
            Official records synchronized with University Academic Management System.
          </div>
        </div>
      </div>
    </div>
  );
}
