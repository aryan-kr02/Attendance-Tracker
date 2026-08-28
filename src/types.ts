export interface Student {
  registrationNo: string;
  name: string;
  course: string;
  semester: number;
  section: string;
  rollNo: string;
  academicYear: string;
  department: string;
}

export type AttendanceStatus = 'excellent' | 'good' | 'low';
export type RiskLevel = 'safe' | 'warning' | 'critical';

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  type: 'Theory' | 'Practical' | 'Tutorial';
  held: number;
  present: number;
  absent: number;
  percentage: number;
  canMiss: number;
  mustAttend: number;
  status: AttendanceStatus;
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO date 'YYYY-MM-DD' or formatted '28 Aug 2026'
  displayDate: string;
  subjectCode: string;
  subjectName: string;
  slot: string;
  status: 'Present' | 'Absent';
  room: string;
}

export interface MonthlyTrend {
  month: string;
  percentage: number;
  held: number;
  attended: number;
}

export interface OverallAttendance {
  totalHeld: number;
  totalPresent: number;
  totalMissed: number;
  percentage: number;
  bufferPercentage: number; // e.g. +7.4% or -2.3% relative to 75%
  riskLevel: RiskLevel;
  maxMissableOverall: number;
  mustAttendOverall: number;
}

export interface StudentFullData {
  student: Student;
  overall: OverallAttendance;
  subjects: SubjectAttendance[];
  history: AttendanceRecord[];
  trend: MonthlyTrend[];
  insights: {
    type: 'success' | 'warning' | 'info';
    text: string;
  }[];
}
