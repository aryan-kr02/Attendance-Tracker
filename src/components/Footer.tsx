import { BookCheck, Code2, GraduationCap, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-12 border-t border-[#DEE2E6] bg-white py-8 text-xs text-gray-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-[#212529] text-sm">University Attendance Tracker</span>
            <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">v2.4.0</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-gray-600">
              <Shield className="w-3.5 h-3.5 text-blue-600" /> University Standard: 75% Mandatory
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <BookCheck className="w-3.5 h-3.5 text-emerald-600" /> No Auth / Public Student Portal
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 text-[11px] text-gray-400">
          <p>© 2026 Academic Student Portal • Computer Science & Engineering Project</p>
          <div className="flex items-center gap-3 font-mono">
            <span>Stack: React • TypeScript • Express • Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
