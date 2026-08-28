import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { SubjectAttendance } from '../types';
import { calculateClassesCanMiss, calculateClassesMustAttend } from '../utils/calculations';

interface SubjectWiseAttendanceProps {
  subjects: SubjectAttendance[];
  onSelectSubject: (subject: SubjectAttendance) => void;
}

export function SubjectWiseAttendance({ subjects, onSelectSubject }: SubjectWiseAttendanceProps) {
  // Totals across all subjects
  const totalHeld = subjects.reduce((sum, s) => sum + s.held, 0);
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalMissed = totalHeld - totalPresent;
  const overallPercentage = totalHeld > 0 ? (totalPresent / totalHeld) * 100 : 0;
  const overallNeed75 = overallPercentage < 75 ? calculateClassesMustAttend(totalPresent, totalHeld, 75) : 0;
  const overallTakeOff75 = overallPercentage >= 75 ? calculateClassesCanMiss(totalPresent, totalHeld, 75) : 0;

  return (
    <div className="bg-white rounded-xl border border-[#DEE2E6] shadow-xs flex flex-col mb-6">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#F1F3F5] flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase text-[#6C757D] tracking-wider">
          Subject-wise Attendance
        </h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 text-[#212529]">
            <span className="w-2 h-2 rounded-full bg-[#DC3545]"></span>
            Min for exams: <strong>75%</strong>
          </span>
        </div>
      </div>

      {/* Clean Tabular Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-[#F8F9FA] sticky top-0">
            <tr className="text-[10px] uppercase font-bold text-[#6C757D] border-b border-[#DEE2E6]">
              <th className="px-5 sm:px-6 py-3">Subject</th>
              <th className="px-3 py-3 text-center">Total</th>
              <th className="px-3 py-3 text-center">Attended</th>
              <th className="px-3 py-3 text-center">Missed</th>
              <th className="px-3 py-3 text-center">Attendance</th>
              <th className="px-3.5 py-3 text-center bg-blue-50/50 text-[#0D6EFD]">Need for 75%</th>
              <th className="px-3.5 py-3 text-center bg-emerald-50/50 text-[#0F5132]">Can Miss</th>
              <th className="px-5 sm:px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F3F5]">
            {subjects.map((subj) => {
              const isBelow75 = subj.percentage < 75;
              const isAbove90 = subj.percentage >= 90;

              // Classes needed or allowed to take off
              const need75 = isBelow75 ? calculateClassesMustAttend(subj.present, subj.held, 75) : 0;
              const takeOff75 = isBelow75 ? 0 : calculateClassesCanMiss(subj.present, subj.held, 75);

              // Percentage Color
              const pctColor = isAbove90
                ? 'text-[#198754]'
                : isBelow75
                ? 'text-[#DC3545]'
                : 'text-[#212529]';

              // Status Badge
              const statusBadge = isBelow75 ? (
                <span className="text-[10px] bg-[#F8D7DA] text-[#842029] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  Below 75%
                </span>
              ) : (
                <span className="text-[10px] bg-[#D1E7DD] text-[#0F5132] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                  Eligible
                </span>
              );

              return (
                <tr
                  key={subj.subjectCode}
                  onClick={() => onSelectSubject(subj)}
                  className={`hover:bg-[#F8F9FA] transition-colors cursor-pointer group ${
                    isBelow75 ? 'bg-[#FFF5F5]/40' : ''
                  }`}
                >
                  {/* Subject Info */}
                  <td className="px-5 sm:px-6 py-3.5">
                    <div className="font-semibold text-[#212529] group-hover:text-[#2563EB] transition-colors">
                      {subj.subjectName}
                    </div>
                    <div className="text-[11px] text-[#6C757D] flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono">{subj.subjectCode}</span>
                      <span>•</span>
                      <span>{subj.type}</span>
                    </div>
                  </td>

                  {/* Held */}
                  <td className="px-3 py-3.5 text-center text-sm font-mono text-[#212529]">
                    {subj.held}
                  </td>

                  {/* Present */}
                  <td className="px-3 py-3.5 text-center text-sm font-mono text-[#212529]">
                    {subj.present}
                  </td>

                  {/* Absent */}
                  <td className="px-3 py-3.5 text-center text-sm font-mono text-[#6C757D]">
                    {subj.absent}
                  </td>

                  {/* Percentage */}
                  <td className={`px-3 py-3.5 text-center font-mono font-bold text-sm ${pctColor}`}>
                    {subj.percentage.toFixed(1)}%
                  </td>

                  {/* Need for 75% */}
                  <td className="px-3.5 py-3.5 text-center bg-blue-50/20">
                    {need75 > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#DC3545] font-mono bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3 h-3" />
                        {need75}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#198754] font-mono">
                        0
                      </span>
                    )}
                  </td>

                  {/* Take Off for 75% */}
                  <td className="px-3.5 py-3.5 text-center bg-emerald-50/20">
                    {takeOff75 > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#198754] font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        {takeOff75} {takeOff75 === 1 ? 'class' : 'classes'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-[#6C757D] font-mono">
                        0
                      </span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 sm:px-6 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      {statusBadge}
                      <ChevronRight className="w-3.5 h-3.5 text-[#ADB5BD] group-hover:text-[#2563EB] transition-colors" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Table Summary Footer */}
          <tfoot className="bg-[#F8F9FA] border-t-2 border-[#DEE2E6] font-semibold text-xs text-[#212529]">
            <tr>
              <td className="px-5 sm:px-6 py-3 font-bold uppercase text-[#495057]">
                All Subjects Combined
              </td>
              <td className="px-3 py-3 text-center font-mono font-bold">{totalHeld}</td>
              <td className="px-3 py-3 text-center font-mono font-bold text-[#2563EB]">{totalPresent}</td>
              <td className="px-3 py-3 text-center font-mono font-bold text-[#DC3545]">{totalMissed}</td>
              <td className="px-3 py-3 text-center font-mono font-bold text-sm">
                {overallPercentage.toFixed(1)}%
              </td>
              <td className="px-3.5 py-3 text-center bg-blue-50/40">
                <span className={`font-mono font-bold ${overallNeed75 > 0 ? 'text-[#DC3545]' : 'text-[#198754]'}`}>
                  {overallNeed75}
                </span>
              </td>
              <td className="px-3.5 py-3 text-center bg-emerald-50/40">
                <span className={`font-mono font-bold ${overallTakeOff75 > 0 ? 'text-[#198754]' : 'text-[#6C757D]'}`}>
                  {overallTakeOff75}
                </span>
              </td>
              <td className="px-5 sm:px-6 py-3 text-right">
                <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                  overallPercentage >= 75 ? 'bg-[#D1E7DD] text-[#0F5132]' : 'bg-[#F8D7DA] text-[#842029]'
                }`}>
                  {overallPercentage >= 75 ? 'Safe' : 'Shortage'}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

