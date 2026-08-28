import { Student } from '../types';

interface StudentInfoCardProps {
  student: Student;
}

export function StudentInfoCard({ student }: StudentInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#DEE2E6] shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase text-[#6C757D] tracking-wider">
          Student Profile
        </h2>
        <span className="text-[10px] font-mono font-bold bg-[#E9ECEF] text-[#495057] px-2 py-0.5 rounded border border-[#DEE2E6]">
          {student.academicYear}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-2xl font-bold text-[#212529] tracking-tight">{student.name}</p>
          <p className="text-sm text-[#6C757D] font-medium">{student.course}</p>
          <p className="text-xs text-[#ADB5BD] mt-0.5">{student.department}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-[#F1F3F5] pt-4">
          <div>
            <p className="text-[10px] uppercase text-[#ADB5BD] font-bold tracking-wider">Semester</p>
            <p className="font-semibold text-sm text-[#212529]">{student.semester}th Semester</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#ADB5BD] font-bold tracking-wider">Section</p>
            <p className="font-semibold text-sm text-[#212529]">Section {student.section}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#ADB5BD] font-bold tracking-wider">Roll Number</p>
            <p className="font-semibold font-mono text-sm text-[#212529]">{student.rollNo}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#ADB5BD] font-bold tracking-wider">Registration</p>
            <p className="font-semibold font-mono text-sm text-[#2563EB]">{student.registrationNo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

