import React, { useEffect, useState } from 'react';
import { AttendanceCalendar } from './components/AttendanceCalendar';
import { AttendanceGoalTracker } from './components/AttendanceGoalTracker';
import { AttendanceHistory } from './components/AttendanceHistory';
import { AttendanceTrendChart } from './components/AttendanceTrendChart';
import { Footer } from './components/Footer';
import { HomeSearch } from './components/HomeSearch';
import { Navbar } from './components/Navbar';
import { OverallAttendanceCard } from './components/OverallAttendanceCard';
import { StudentInfoCard } from './components/StudentInfoCard';
import { SubjectDetailModal } from './components/SubjectDetailModal';
import { SubjectWiseAttendance } from './components/SubjectWiseAttendance';
import { getOrCreateStudentData } from './data/students';
import { StudentFullData, SubjectAttendance } from './types';

export default function App() {
  const [currentRegNo, setCurrentRegNo] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentFullData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectAttendance | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals' | 'history' | 'calendar'>('dashboard');

  // Handle Search
  const handleSearch = async (regNo: string) => {
    setIsLoading(true);
    try {
      // Attempt backend fetch from Express API
      const res = await fetch(`/api/student/${encodeURIComponent(regNo)}/all`);
      if (res.ok) {
        const data = await res.json();
        setStudentData(data);
        setCurrentRegNo(regNo);
      } else {
        // Fallback to local client data generator
        const data = getOrCreateStudentData(regNo);
        setStudentData(data);
        setCurrentRegNo(regNo);
      }
    } catch {
      // Fallback
      const data = getOrCreateStudentData(regNo);
      setStudentData(data);
      setCurrentRegNo(regNo);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setCurrentRegNo(null);
    setStudentData(null);
    setSelectedSubject(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#212529]">
      {/* Navigation Bar */}
      <Navbar
        currentRegNo={currentRegNo}
        studentName={studentData?.student.name}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!currentRegNo || !studentData ? (
          /* View 1: Homepage Search */
          <HomeSearch onSearch={handleSearch} isLoading={isLoading} />
        ) : (
          /* View 2: Student Attendance Dashboard */
          <div>
            {/* Quick Navigation Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#495057] hover:bg-[#F8F9FA] border border-[#DEE2E6]'
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('goals')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'goals'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#495057] hover:bg-[#F8F9FA] border border-[#DEE2E6]'
                }`}
              >
                Goal Tracker
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#495057] hover:bg-[#F8F9FA] border border-[#DEE2E6]'
                }`}
              >
                Class History ({studentData.history.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#495057] hover:bg-[#F8F9FA] border border-[#DEE2E6]'
                }`}
              >
                Calendar
              </button>
            </div>

            {/* View based on selected tab */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-12 gap-6">
                {/* Left Column (4 cols on desktop): Student Profile & Overall Radial Gauge */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                  <StudentInfoCard student={studentData.student} />
                  <OverallAttendanceCard overall={studentData.overall} />
                </div>

                {/* Right Column (8 cols on desktop): Subject Breakdown Data Grid */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                  <SubjectWiseAttendance
                    subjects={studentData.subjects}
                    onSelectSubject={(subj) => setSelectedSubject(subj)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-6">
                <StudentInfoCard student={studentData.student} />
                <AttendanceGoalTracker
                  overall={studentData.overall}
                  subjects={studentData.subjects}
                />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <StudentInfoCard student={studentData.student} />
                <AttendanceTrendChart
                  trend={studentData.trend}
                  currentPercentage={studentData.overall.percentage}
                />
                <AttendanceHistory
                  history={studentData.history}
                  subjects={studentData.subjects}
                />
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-6">
                <StudentInfoCard student={studentData.student} />
                <AttendanceCalendar history={studentData.history} />
              </div>
            )}
          </div>
        )}

        {/* Modal for Individual Subject Breakdown */}
        {selectedSubject && studentData && (
          <SubjectDetailModal
            subject={selectedSubject}
            history={studentData.history}
            onClose={() => setSelectedSubject(null)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
