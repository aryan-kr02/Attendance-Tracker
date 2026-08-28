import { CheckCircle2, GraduationCap, LogOut } from 'lucide-react';

interface NavbarProps {
  currentRegNo: string | null;
  studentName?: string;
  onReset: () => void;
}

export function Navbar({ currentRegNo, studentName, onReset }: NavbarProps) {
  return (
    <header className="bg-white border-b border-[#DEE2E6] sticky top-0 z-40 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex justify-between items-center">
        {/* Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="bg-[#2563EB] p-2 rounded-lg text-white shadow-xs transition-transform group-hover:scale-105 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#212529] flex items-center gap-2">
              Attendance Tracker
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider bg-[#E9ECEF] text-[#6C757D] px-2 py-0.5 rounded border border-[#DEE2E6]">
                Data Grid
              </span>
            </h1>
            <p className="text-[11px] text-[#6C757D] hidden md:block">University Academic Monitoring System</p>
          </div>
        </div>

        {/* Right side controls */}
        {currentRegNo ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-[#E9ECEF] px-3.5 py-1.5 rounded-lg flex items-center gap-2 border border-[#DEE2E6]">
              <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider">Registration No.</span>
              <span className="font-mono font-bold text-sm text-[#2563EB]">{currentRegNo}</span>
            </div>

            {studentName && (
              <div 
                title={studentName}
                className="w-9 h-9 bg-[#2563EB] text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
              >
                {studentName.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
            )}

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#DC3545] bg-[#F8D7DA]/40 hover:bg-[#F8D7DA] border border-[#F5C2C7] rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F5132] bg-[#D1E7DD] px-3 py-1.5 rounded-full border border-[#BADBCC]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Open Access Portal</span>
          </div>
        )}
      </div>
    </header>
  );
}

