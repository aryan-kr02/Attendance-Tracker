import { TrendingUp } from 'lucide-react';
import { MonthlyTrend } from '../types';

interface AttendanceTrendChartProps {
  trend: MonthlyTrend[];
  currentPercentage: number;
}

export function AttendanceTrendChart({ trend, currentPercentage }: AttendanceTrendChartProps) {
  // Compute chart coordinates
  const height = 180;
  const width = 500;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 35;

  const minVal = 50;
  const maxVal = 100;

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const range = maxVal - minVal;
    return paddingTop + ((maxVal - clamped) / range) * (height - paddingTop - paddingBottom);
  };

  const getX = (index: number) => {
    if (trend.length <= 1) return paddingLeft + (width - paddingLeft - paddingRight) / 2;
    const step = (width - paddingLeft - paddingRight) / (trend.length - 1);
    return paddingLeft + index * step;
  };

  // Generate SVG path for line
  const points = trend.map((t, idx) => ({
    x: getX(idx),
    y: getY(t.percentage),
    pct: t.percentage,
    month: t.month,
  }));

  const linePath = points.length > 0
    ? points.reduce((acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '')
    : '';

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x},${getY(50)} L ${points[0].x},${getY(50)} Z`
    : '';

  const y75 = getY(75);

  return (
    <div className="bg-white rounded-xl border border-[#DEE2E6] shadow-xs p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-gray-100 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Monthly Progress</span>
          <h3 className="font-bold text-lg text-[#212529]">Attendance Progress by Month</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="inline-block w-3 h-0.5 bg-blue-600"></span>
          <span>Monthly Attendance</span>
          <span className="inline-block w-3 h-0.5 border-b border-dashed border-red-500 ml-2"></span>
          <span className="text-red-700 font-semibold">75% Exam Minimum</span>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-x-auto py-2">
        <div className="min-w-[440px]">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
            {/* Grid horizontal lines */}
            {[60, 75, 90, 100].map((tick) => {
              const y = getY(tick);
              const is75 = tick === 75;
              return (
                <g key={tick}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke={is75 ? '#EF4444' : '#E5E7EB'}
                    strokeWidth={is75 ? 1.5 : 1}
                    strokeDasharray={is75 ? '4 4' : undefined}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className={`text-[10px] font-mono ${is75 ? 'fill-red-600 font-bold' : 'fill-gray-400'}`}
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* 75% Badge on Right */}
            <text
              x={width - paddingRight + 6}
              y={y75 + 3}
              className="text-[9px] font-bold fill-red-600"
            >
              75% Min
            </text>

            {/* Area Fill */}
            <path d={areaPath} fill="rgba(37, 99, 235, 0.08)" />

            {/* Main Trend Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Point Circles & Tooltip Labels */}
            {points.map((pt, idx) => (
              <g key={idx}>
                {/* Outer Glow */}
                <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
                {/* Value Label above */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  className="text-[11px] font-mono font-bold fill-[#212529]"
                >
                  {pt.pct.toFixed(1)}%
                </text>
                {/* X-axis Month Label */}
                <text
                  x={pt.x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[11px] font-medium fill-gray-600"
                >
                  {pt.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Footer explanation */}
      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between border-t border-gray-100 pt-3">
        <span>Current Month Attendance: <strong className="text-gray-900 font-mono">{currentPercentage.toFixed(1)}%</strong></span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          Consistent upward trajectory
        </span>
      </div>
    </div>
  );
}
