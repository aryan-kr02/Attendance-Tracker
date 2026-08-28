import { useState } from 'react';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { OverallAttendance, SubjectAttendance } from '../types';
import { calculateClassesCanMiss, calculateClassesMustAttend } from '../utils/calculations';

interface AttendanceGoalTrackerProps {
  overall: OverallAttendance;
  subjects: SubjectAttendance[];
}

export function AttendanceGoalTracker({ overall, subjects }: AttendanceGoalTrackerProps) {
  const [targetGoal, setTargetGoal] = useState<number>(85);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('overall');

  // Quick preset targets
  const presets = [75, 80, 85, 90, 95];

  // Active calculation data
  const isOverall = selectedSubjectCode === 'overall';
  const activeSubject = subjects.find((s) => s.subjectCode === selectedSubjectCode);

  const activePresent = isOverall ? overall.totalPresent : (activeSubject?.present ?? 0);
  const activeHeld = isOverall ? overall.totalHeld : (activeSubject?.held ?? 0);
  const activePercentage = isOverall ? overall.percentage : (activeSubject?.percentage ?? 0);
  const activeName = isOverall ? 'All Subjects Combined' : (activeSubject?.subjectName ?? '');

  const mustAttend = calculateClassesMustAttend(activePresent, activeHeld, targetGoal);
  const canMiss = calculateClassesCanMiss(activePresent, activeHeld, targetGoal);
  const isGoalMet = activePercentage >= targetGoal;

  return (
    <div className="bg-white rounded-xl border border-[#DEE2E6] shadow-xs flex flex-col mb-6">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#F1F3F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#212529]">
              Attendance Goal Tracker
            </h2>
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presets.map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setTargetGoal(pct)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                targetGoal === pct
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F8F9FA] text-[#495057] hover:bg-[#E9ECEF] border border-[#DEE2E6]'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Target Setting Bar */}
      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F9FA] p-3 rounded-xl border border-[#DEE2E6]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-[#6C757D]">Check For:</span>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              className="text-xs font-medium bg-white border border-[#DEE2E6] rounded-lg px-3 py-1.5 text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="overall">All Subjects Combined ({overall.percentage.toFixed(1)}%)</option>
              {subjects.map((s) => (
                <option key={s.subjectCode} value={s.subjectCode}>
                  {s.subjectCode} - {s.subjectName} ({s.percentage.toFixed(1)}%)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#DEE2E6]">
            <span className="text-xs font-bold text-[#495057]">My Target (0-100%):</span>
            <input
              type="number"
              min="0"
              max="100"
              value={targetGoal}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (!isNaN(val)) {
                  setTargetGoal(Math.min(100, Math.max(0, val)));
                }
              }}
              className="w-14 text-xs font-mono font-bold text-[#2563EB] text-center border-b-2 border-[#2563EB] focus:outline-none py-0.5"
            />
            <span className="text-xs font-bold text-[#6C757D]">%</span>
          </div>
        </div>

        {/* Minimal 4-Metric Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Target */}
          <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#DEE2E6] text-center">
            <span className="text-[10px] uppercase font-bold text-[#6C757D] block">Target Goal</span>
            <span className="text-2xl font-black font-mono text-[#2563EB] mt-0.5 block">
              {targetGoal}%
            </span>
            <span className="text-[10px] text-[#6C757D] truncate block mt-0.5" title={activeName}>
              {isOverall ? 'Overall' : activeSubject?.subjectCode}
            </span>
          </div>

          {/* 2. Current Attendance */}
          <div className="bg-[#F8F9FA] p-3.5 rounded-xl border border-[#DEE2E6] text-center">
            <span className="text-[10px] uppercase font-bold text-[#6C757D] block">Current Attendance</span>
            <span className={`text-2xl font-black font-mono mt-0.5 block ${
              isGoalMet ? 'text-[#198754]' : 'text-[#DC3545]'
            }`}>
              {activePercentage.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#6C757D] block mt-0.5">
              {activePresent} of {activeHeld} classes
            </span>
          </div>

          {/* 3. Classes Needed */}
          <div className={`p-3.5 rounded-xl border text-center ${
            mustAttend > 0
              ? 'bg-[#FFF5F5] border-[#F5C2C7] text-[#842029]'
              : 'bg-[#D1E7DD]/40 border-[#BADBCC] text-[#0F5132]'
          }`}>
            <span className="text-[10px] uppercase font-bold block">Need to Attend</span>
            <span className="text-2xl font-black font-mono mt-0.5 block">
              {mustAttend}
            </span>
            <span className="text-[10px] font-semibold block mt-0.5">
              {mustAttend > 0 ? 'consecutive classes' : 'Target reached'}
            </span>
          </div>

          {/* 4. Safe to Miss */}
          <div className={`p-3.5 rounded-xl border text-center ${
            canMiss > 0
              ? 'bg-[#D1E7DD]/40 border-[#BADBCC] text-[#0F5132]'
              : 'bg-[#F8F9FA] border-[#DEE2E6] text-[#6C757D]'
          }`}>
            <span className="text-[10px] uppercase font-bold block">Can Safely Miss</span>
            <span className="text-2xl font-black font-mono mt-0.5 block">
              {canMiss}
            </span>
            <span className="text-[10px] font-semibold block mt-0.5">
              {canMiss > 0 ? `${canMiss === 1 ? 'class' : 'classes'} buffer` : '0 buffer'}
            </span>
          </div>
        </div>

        {/* Minimal Table for All Subjects with Target */}
        <div className="border border-[#DEE2E6] rounded-xl overflow-hidden">
          <div className="bg-[#F8F9FA] px-4 py-2.5 border-b border-[#DEE2E6] flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#6C757D] tracking-wider">
              All Subjects Status for {targetGoal}% Target
            </span>
            <span className="text-[11px] text-[#6C757D]">
              {subjects.filter((s) => s.percentage >= targetGoal).length} of {subjects.length} achieved
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8F9FA]">
                <tr className="text-[10px] uppercase font-bold text-[#6C757D] border-b border-[#DEE2E6]">
                  <th className="px-4 py-2.5">Subject</th>
                  <th className="px-3 py-2.5 text-center">Current</th>
                  <th className="px-3 py-2.5 text-center">Target</th>
                  <th className="px-3 py-2.5 text-center bg-red-50/30 text-[#DC3545]">Need to Attend</th>
                  <th className="px-3 py-2.5 text-center bg-emerald-50/30 text-[#0F5132]">Can Miss</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {subjects.map((subj) => {
                  const subjectMustAttend = calculateClassesMustAttend(subj.present, subj.held, targetGoal);
                  const subjectCanMiss = calculateClassesCanMiss(subj.present, subj.held, targetGoal);
                  const subjectMet = subj.percentage >= targetGoal;

                  return (
                    <tr key={subj.subjectCode} className="hover:bg-[#F8F9FA]">
                      <td className="px-4 py-2.5 font-medium text-[#212529]">
                        <div>{subj.subjectName}</div>
                        <div className="text-[10px] text-[#6C757D] font-mono">{subj.subjectCode}</div>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold">
                        <span className={subjectMet ? 'text-[#198754]' : 'text-[#DC3545]'}>
                          {subj.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-[#6C757D]">
                        {targetGoal}%
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold bg-red-50/10">
                        {subjectMustAttend > 0 ? (
                          <span className="text-[#DC3545]">{subjectMustAttend}</span>
                        ) : (
                          <span className="text-[#198754]">0</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold bg-emerald-50/10">
                        {subjectCanMiss > 0 ? (
                          <span className="text-[#198754]">{subjectCanMiss}</span>
                        ) : (
                          <span className="text-[#6C757D]">0</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            subjectMet
                              ? 'bg-[#D1E7DD] text-[#0F5132]'
                              : 'bg-[#F8D7DA] text-[#842029]'
                          }`}
                        >
                          {subjectMet ? 'Achieved' : 'Need Classes'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
