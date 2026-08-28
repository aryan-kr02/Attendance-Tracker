import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { OverallAttendance } from '../types';

interface OverallAttendanceCardProps {
  overall: OverallAttendance;
}

export function OverallAttendanceCard({ overall }: OverallAttendanceCardProps) {
  const isBelow75 = overall.percentage < 75;
  const isAbove90 = overall.percentage >= 90;

  // Badge Status - Warning only when below 75%
  const badgeStyle = isBelow75
    ? 'bg-[#F8D7DA] text-[#842029]'
    : isAbove90
    ? 'bg-[#D1E7DD] text-[#0F5132]'
    : 'bg-[#E7F1FF] text-[#0D6EFD]';

  const badgeText = isBelow75 ? 'LOW (<75%)' : isAbove90 ? 'EXCELLENT' : 'SAFE (≥75%)';

  // SVG Gauge calculations
  // Circumference of r=40 is 2 * PI * 40 = 251.2
  const circumference = 251.2;
  const percentCapped = Math.min(100, Math.max(0, overall.percentage));
  const dashoffset = circumference - (percentCapped / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-xl border border-[#DEE2E6] shadow-xs flex flex-col items-center justify-center relative overflow-hidden">
      {/* Corner Status Badge */}
      <div className="absolute top-0 right-0 p-3">
        <span className={`${badgeStyle} text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider`}>
          {badgeText}
        </span>
      </div>

      <h2 className="text-xs font-bold uppercase text-[#6C757D] mb-6 tracking-wider w-full text-left">
        Overall Attendance
      </h2>

      {/* Radial SVG Gauge */}
      <div className="relative w-40 h-40 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-[#E9ECEF]"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className={isBelow75 ? 'text-[#DC3545]' : 'text-[#198754]'}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black text-[#212529] tracking-tight">{overall.percentage.toFixed(1)}%</span>
          <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider">Current</span>
        </div>
      </div>

      {/* 3 Metric Summary Blocks */}
      <div className="mt-6 grid grid-cols-3 gap-2 w-full pt-5 border-t border-[#F1F3F5]">
        <div className="text-center">
          <p className="text-xl font-bold font-mono text-[#212529]">{overall.totalHeld}</p>
          <p className="text-[9px] text-[#6C757D] uppercase font-bold tracking-wider">Total Classes</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold font-mono text-[#2563EB]">{overall.totalPresent}</p>
          <p className="text-[9px] text-[#6C757D] uppercase font-bold tracking-wider">Attended</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold font-mono text-[#DC3545]">{overall.totalMissed}</p>
          <p className="text-[9px] text-[#6C757D] uppercase font-bold tracking-wider">Missed</p>
        </div>
      </div>

      {/* Threshold Status Banner - Warning icon ONLY when below 75% */}
      <div className={`mt-4 w-full p-3 rounded-lg border text-xs flex items-center justify-between ${
        isBelow75
          ? 'bg-[#F8D7DA]/60 border-[#F5C2C7] text-[#842029]'
          : 'bg-[#D1E7DD]/50 border-[#BADBCC] text-[#0F5132]'
      }`}>
        <div className="flex items-center gap-1.5 font-medium truncate">
          {isBelow75 ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[#DC3545]" />
              <span>Below 75% rule ({Math.abs(overall.bufferPercentage)}% shortage)</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#198754]" />
              <span>Above 75% rule (+{overall.bufferPercentage}% extra)</span>
            </>
          )}
        </div>
        <span className="font-bold shrink-0 text-[11px]">
          {isBelow75 ? `Need to attend ${overall.mustAttendOverall}` : `Can miss ${overall.maxMissableOverall}`}
        </span>
      </div>
    </div>
  );
}

