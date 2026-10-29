/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { HomeView } from './components/HomeView';
import { JourneyMap } from './components/JourneyMap';
import { LessonPlanWorkshop } from './components/LessonPlanWorkshop';
import { SmartMaterialsHub } from './components/SmartMaterialsHub';
import { GamesWorld } from './components/GamesWorld';
import { RobotTutorChat } from './components/RobotTutorChat';
import { Classroom3D } from './components/Classroom3D';
import { ProgressTracker } from './components/ProgressTracker';
import { EvidencePortfolio } from './components/EvidencePortfolio';
import { SettingsModal } from './components/SettingsModal';
import { HelpGuideModal } from './components/HelpGuideModal';

import { Lesson, Student } from './types';
import { SAMPLE_LESSONS } from './data/sampleLessons';
import { SAMPLE_STUDENTS } from './data/sampleStudents';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Persistent Lessons state
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem('ai_cung_em_lessons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved lessons:', e);
    }
    return SAMPLE_LESSONS;
  });

  // Persistent Students state (automatically loads official 33 students of Class 3D)
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const savedVersion = localStorage.getItem('ai_cung_em_students_version');
      const saved = localStorage.getItem('ai_cung_em_students');
      if (saved && savedVersion === 'v_33_official_2026_2027') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 33) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved students:', e);
    }
    // Default to the 33 official students of Class 3D
    localStorage.setItem('ai_cung_em_students_version', 'v_33_official_2026_2027');
    return SAMPLE_STUDENTS;
  });

  const [currentLessonId, setCurrentLessonId] = useState<string>(SAMPLE_LESSONS[0].id);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('ai_cung_em_lessons', JSON.stringify(lessons));
    } catch (e) {
      console.warn('Could not save lessons:', e);
    }
  }, [lessons]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_cung_em_students', JSON.stringify(students));
    } catch (e) {
      console.warn('Could not save students:', e);
    }
  }, [students]);

  const handleAddCustomLesson = (newLesson: Lesson) => {
    setLessons((prev) => [newLesson, ...prev]);
    setCurrentLessonId(newLesson.id);
    setActiveTab('stations');
  };

  const handleRestoreState = (state: any) => {
    if (state.lessons) setLessons(state.lessons);
    if (state.students) setStudents(state.students);
    if (state.currentLessonId) setCurrentLessonId(state.currentLessonId);
  };

  const fullAppState = {
    lessons,
    students,
    currentLessonId,
    exportedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Nunito',sans-serif] selection:bg-sky-200 selection:text-sky-900">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 md:py-8">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={(tab) => setActiveTab(tab)}
            lessons={lessons}
            onSelectLesson={(id) => setCurrentLessonId(id)}
            onOpenHelp={() => setIsHelpOpen(true)}
          />
        )}

        {activeTab === 'stations' && (
          <JourneyMap
            lessons={lessons}
            currentLessonId={currentLessonId}
            onSelectLesson={(id) => setCurrentLessonId(id)}
          />
        )}

        {activeTab === 'lesson_plan' && (
          <LessonPlanWorkshop onAddCustomLesson={handleAddCustomLesson} />
        )}

        {activeTab === 'materials' && <SmartMaterialsHub />}

        {activeTab === 'games' && <GamesWorld />}

        {activeTab === 'tutor' && <RobotTutorChat />}

        {activeTab === 'classroom' && (
          <Classroom3D
            students={students}
            onUpdateStudents={setStudents}
            isDemoMode={isDemoMode}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTracker students={students} isDemoMode={isDemoMode} />
        )}

        {activeTab === 'evidence' && <EvidencePortfolio />}
      </main>

      {/* Standard Educational Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8 px-4 text-center text-xs text-slate-500 space-y-2 no-print">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-bold text-slate-700">
          <span>AI CÙNG EM – PHIÊU LƯU TRI THỨC LỚP 3</span>
          <span>•</span>
          <span>Giáo viên: Nguyễn Hoàng Thu Anh</span>
          <span>•</span>
          <span>Trường Tiểu học Khoái Châu 1</span>
          <span>•</span>
          <span>Lớp 3D</span>
        </div>
        <p className="max-w-2xl mx-auto text-slate-400 font-semibold leading-relaxed">
          “Cá nhân hóa học tập – Khơi mở sáng tạo – Phát triển năng lực học sinh lớp 3.”
          <br />
          Định hướng Chương trình Giáo dục phổ thông 2018 • AI là công cụ hỗ trợ, học sinh là trung tâm của hành trình học tập.
        </p>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fullAppState={fullAppState}
        onRestoreState={handleRestoreState}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
      />

      <HelpGuideModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
