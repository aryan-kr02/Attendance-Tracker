import { CheckCircle2, AlertCircle, X, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { AttendanceRecord, SubjectAttendance } from '../types';
import { calculateClassesCanMiss, calculateClassesMustAttend } from '../utils/calculations';

interface SubjectDetailModalProps {
  subject: SubjectAttendance | null;
  history: AttendanceRecord[];
  onClose: () => void;
}

export function SubjectDetailModal({ subject, history, onClose }: SubjectDetailModalProps) {
  if (!subject) return null;

  const subjectHistory = history.filter((h) => h.subjectCode === subject.subjectCode);

  const canMiss75 = calculateClassesCanMiss(subject.present, subject.held, 75);
  const mustAttend75 = subject.percentage < 75 ? calculateClassesMustAttend(subject.present, subject.held, 75) : 0;

  const isLow = subject.percentage < 75;

  // Progressive Future Preview intervals
  const attendIntervals = [1, 3, 5, 8, 12, 16];
  const missIntervals = [1, 2, 4, 6, 8];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-[#DEE2E6] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                {subject.subjectCode}
              </span>
              <span className="text-xs text-gray-500 font-medium">{subject.type} Course</span>
            </div>
            <h2 className="text-xl font-bold text-[#212529] mt-1">{subject.subjectName}</h2>
            <p className="text-xs text-gray-500">Instructor: {subject.facultyName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-gray-50 p-3 rounded-lg border border-[#DEE2E6]">
              <span className="text-[10px] text-gray-500 uppercase font-bold block">Total Classes</span>
              <span className="text-lg font-bold font-mono text-gray-900">{subject.held}</span>
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Attended</span>
              <span className="text-lg font-bold font-mono text-emerald-800">{subject.present}</span>
            </div>
            <div className="bg-red-50/60 p-3 rounded-lg border border-red-200">
              <span className="text-[10px] text-red-700 uppercase font-bold block">Missed</span>
              <span className="text-lg font-bold font-mono text-red-800">{subject.absent}</span>
            </div>
            <div className={`p-3 rounded-lg border ${
              isLow ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <span className="text-[10px] text-gray-600 uppercase font-bold block">Attendance</span>
              <span className={`text-lg font-bold font-mono ${
                isLow ? 'text-red-700' : 'text-blue-700'
              }`}>
                {subject.percentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* 75% Need & Take Off Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border text-center ${
              mustAttend75 > 0 ? 'bg-[#FFF5F5] border-[#F5C2C7] text-[#842029]' : 'bg-[#D1E7DD]/40 border-[#BADBCC] text-[#0F5132]'
            }`}>
              <span className="text-[10px] uppercase font-bold block">Need for 75%</span>
              <span className="text-xl font-black font-mono mt-0.5 block">
                {mustAttend75}
              </span>
              <span className="text-[10px] font-semibold block">
                {mustAttend75 > 0 ? 'consecutive classes in a row' : 'Eligible (≥75%)'}
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border text-center ${
              canMiss75 > 0 ? 'bg-[#D1E7DD]/40 border-[#BADBCC] text-[#0F5132]' : 'bg-[#F8F9FA] border-[#DEE2E6] text-[#6C757D]'
            }`}>
              <span className="text-[10px] uppercase font-bold block">Can Miss</span>
              <span className="text-xl font-black font-mono mt-0.5 block">
                {canMiss75}
              </span>
              <span className="text-[10px] font-semibold block">
                {canMiss75 > 0 ? `${canMiss75 === 1 ? 'class' : 'classes'} can be missed` : '0 buffer'}
              </span>
            </div>
          </div>

          {/* Future Attendance Preview - Progressive Increments */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-gray-700 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Future Preview: If You Attend Next Classes</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {attendIntervals.map((n) => {
                  const newPresent = subject.present + n;
                  const newTotal = subject.held + n;
                  const newPct = (newPresent / newTotal) * 100;
                  const delta = Math.round((newPct - subject.percentage) * 10) / 10;
                  const meets75 = newPct >= 75;

                  return (
                    <div
                      key={`attend-${n}`}
                      className="bg-white p-2.5 rounded-lg border border-[#DEE2E6] text-center hover:border-emerald-300 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded block truncate">
                        Attend +{n} {n === 1 ? 'class' : 'classes'}
                      </span>
                      <span className="text-base font-black font-mono text-[#212529] mt-1.5 block">
                        {newPct.toFixed(1)}%
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 block">
                        +{delta}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase text-gray-700 mb-2">
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                <span>Future Preview: If You Miss Next Classes</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {missIntervals.map((n) => {
                  const newPresent = subject.present;
                  const newTotal = subject.held + n;
                  const newPct = (newPresent / newTotal) * 100;
                  const delta = Math.round((newPct - subject.percentage) * 10) / 10;

                  return (
                    <div
                      key={`miss-${n}`}
                      className="bg-white p-2.5 rounded-lg border border-[#DEE2E6] text-center hover:border-red-300 transition-colors"
                    >
                      <span className="text-[10px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded block truncate">
                        Miss +{n} {n === 1 ? 'class' : 'classes'}
                      </span>
                      <span className="text-base font-black font-mono text-[#212529] mt-1.5 block">
                        {newPct.toFixed(1)}%
                      </span>
                      <span className="text-[10px] font-semibold text-red-600 block">
                        {delta}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Past History for this subject */}
          <div>
            <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">
              Recent Class History ({subjectHistory.length} recorded)
            </h4>
            {subjectHistory.length > 0 ? (
              <div className="max-h-40 overflow-y-auto border border-[#DEE2E6] rounded-lg divide-y divide-gray-100 text-xs">
                {subjectHistory.map((h) => (
                  <div key={h.id} className="p-2.5 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <span className="font-medium text-gray-900">{h.displayDate}</span>
                      <span className="text-gray-400 text-[11px] ml-2 font-mono">{h.slot} • {h.room}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      h.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No specific history logs available for this subject.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
