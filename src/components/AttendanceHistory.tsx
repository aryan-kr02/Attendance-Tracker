import { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Filter, History, Search, XCircle } from 'lucide-react';
import { AttendanceRecord, SubjectAttendance } from '../types';

interface AttendanceHistoryProps {
  history: AttendanceRecord[];
  subjects: SubjectAttendance[];
}

export function AttendanceHistory({ history, subjects }: AttendanceHistoryProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      if (selectedSubject !== 'ALL' && item.subjectCode !== selectedSubject) {
        return false;
      }
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.subjectName.toLowerCase().includes(q);
        const matchesCode = item.subjectCode.toLowerCase().includes(q);
        const matchesDate = item.displayDate.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDate) return false;
      }
      return true;
    });
  }, [history, selectedSubject, selectedStatus, searchQuery]);

  const presentCount = history.filter((h) => h.status === 'Present').length;
  const absentCount = history.filter((h) => h.status === 'Absent').length;

  return (
    <div className="bg-white rounded-xl border border-[#DEE2E6] shadow-xs p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Lecture Logs</span>
          <h3 className="font-bold text-xl text-[#212529]">Attendance History</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-semibold">
            {presentCount} Present
          </span>
          <span className="bg-red-50 text-red-800 border border-red-200 px-2.5 py-1 rounded font-semibold">
            {absentCount} Absent
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {/* Subject Filter */}
        <div>
          <label htmlFor="filterSubject" className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
            Filter by Subject
          </label>
          <select
            id="filterSubject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-white border border-[#DEE2E6] rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="ALL">All Subjects ({subjects.length})</option>
            {subjects.map((s) => (
              <option key={s.subjectCode} value={s.subjectCode}>
                {s.subjectCode} - {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="filterStatus" className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
            Filter by Status
          </label>
          <select
            id="filterStatus"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white border border-[#DEE2E6] rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="ALL">All Records</option>
            <option value="Present">Present Only</option>
            <option value="Absent">Absent Only</option>
          </select>
        </div>

        {/* Keyword Search */}
        <div>
          <label htmlFor="filterSearch" className="block text-[11px] font-bold uppercase text-gray-500 mb-1">
            Search Date or Topic
          </label>
          <div className="relative">
            <input
              id="filterSearch"
              type="text"
              placeholder="e.g. 28 Aug or OS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#DEE2E6] rounded-lg px-3 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#DEE2E6] text-gray-600 bg-gray-50/70 font-semibold">
              <th className="py-2.5 px-3.5 rounded-l-lg">Date</th>
              <th className="py-2.5 px-3">Subject</th>
              <th className="py-2.5 px-3">Time Slot & Room</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((rec) => {
                const isPresent = rec.status === 'Present';
                return (
                  <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Date */}
                    <td className="py-3 px-3.5 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{rec.displayDate}</span>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900">{rec.subjectName}</div>
                      <div className="text-xs text-gray-500 font-mono">{rec.subjectCode}</div>
                    </td>

                    {/* Time Slot & Room */}
                    <td className="py-3 px-3 text-gray-600">
                      <div>{rec.slot}</div>
                      <div className="text-[11px] text-gray-400">{rec.room}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {isPresent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3.5 h-3.5" />
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500 text-xs">
                  No attendance records found matching the applied filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>Showing {filteredHistory.length} of {history.length} logged sessions</span>
        <span>Semester 5 • 2026 Academic Term</span>
      </div>
    </div>
  );
}
