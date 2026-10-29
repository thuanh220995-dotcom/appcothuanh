import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, StationId, Student } from '../types';
import { audioService } from '../utils/audio';
import { Station1Warmup } from './Station1Warmup';
import { Station2Discovery } from './Station2Discovery';
import { Station3Practice } from './Station3Practice';
import { Station4Creation } from './Station4Creation';
import { Station5Reflection } from './Station5Reflection';

interface JourneyMapProps {
  lessons: Lesson[];
  currentLessonId: string;
  onSelectLesson: (id: string) => void;
  activeStudent?: Student;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  lessons,
  currentLessonId,
  onSelectLesson,
  activeStudent,
}) => {
  const currentLesson = lessons.find((l) => l.id === currentLessonId) || lessons[0];

  const [activeStation, setActiveStation] = useState<StationId>('station1');
  const [completedStations, setCompletedStations] = useState<StationId[]>([]);
  const [stationScores, setStationScores] = useState<Record<string, number>>({});

  const stationsMeta = [
    {
      id: 'station1' as StationId,
      number: 1,
      title: 'Khởi Động Hứng Thú',
      subtitle: '3-5 phút • Đố vui & Quan sát',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
      badgeColor: 'bg-emerald-500 text-white',
      icon: '💡',
    },
    {
      id: 'station2' as StationId,
      number: 2,
      title: 'Trạm Khám Phá',
      subtitle: '8-10 phút • Đa giác quan & Sơ đồ',
      color: 'border-sky-500 bg-sky-50 text-sky-900',
      badgeColor: 'bg-sky-500 text-white',
      icon: '🔍',
    },
    {
      id: 'station3' as StationId,
      number: 3,
      title: 'Trạm Nhiệm Vụ',
      subtitle: '10-12 phút • Phân hóa 3 mức độ',
      color: 'border-pink-500 bg-pink-50 text-pink-900',
      badgeColor: 'bg-pink-500 text-white',
      icon: '📋',
    },
    {
      id: 'station4' as StationId,
      number: 4,
      title: 'Trạm Sáng Tạo',
      subtitle: '5-7 phút • Vẽ tranh & Viết truyện',
      color: 'border-amber-500 bg-amber-50 text-amber-900',
      badgeColor: 'bg-amber-500 text-white',
      icon: '🎨',
    },
    {
      id: 'station5' as StationId,
      number: 5,
      title: 'Trạm Phản Hồi',
      subtitle: '3-5 phút • Tự đánh giá & Vinh danh',
      color: 'border-purple-500 bg-purple-50 text-purple-900',
      badgeColor: 'bg-purple-500 text-white',
      icon: '🌟',
    },
  ];

  const handleStationClick = (stId: StationId) => {
    audioService.playSound('pop');
    setActiveStation(stId);
  };

  const markStationComplete = (stId: StationId, score?: number) => {
    if (!completedStations.includes(stId)) {
      setCompletedStations((prev) => [...prev, stId]);
    }
    if (score !== undefined) {
      setStationScores((prev) => ({ ...prev, [stId]: score }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Lesson Selector & Progress Bar */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Lesson Picker */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider">
              Bài học đang phiêu lưu:
            </div>
            <select
              value={currentLesson.id}
              onChange={(e) => {
                onSelectLesson(e.target.value);
                setActiveStation('station1');
                setCompletedStations([]);
                audioService.playSound('pop');
              }}
              className="mt-0.5 bg-slate-50 border-2 border-sky-300 font-extrabold text-sm md:text-base text-slate-800 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
            >
              {lessons.map((les) => (
                <option key={les.id} value={les.id}>
                  [{les.subject}] {les.title} ({les.bookSeries})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Tracker across 5 stations */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500">Tiến độ 5 Trạm AI:</div>
            <div className="text-sm md:text-base font-extrabold text-indigo-700">
              Đã hoàn thành {completedStations.length} / 5 trạm
            </div>
          </div>
          <div className="w-24 md:w-32 h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(completedStations.length / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual 5-Station Connected Roadmap */}
      <div className="bg-gradient-to-br from-sky-50 via-indigo-50/40 to-pink-50 rounded-3xl p-6 border-2 border-sky-200 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-6">
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center justify-center gap-2">
            <Compass className="w-5 h-5 text-sky-600" />
            <span>BẢN ĐỒ HÀNH TRÌNH 5 TRẠM PHIÊU LƯU TRI THỨC</span>
          </h3>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Bấm chọn từng trạm để tham gia hoạt động hoặc đi tuần tự từ Trạm 1 đến Trạm 5
          </p>
        </div>

        {/* 5 Stations Grid with Connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 relative">
          {stationsMeta.map((st, idx) => {
            const isActive = activeStation === st.id;
            const isDone = completedStations.includes(st.id);

            return (
              <div
                key={st.id}
                onClick={() => handleStationClick(st.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative select-none flex flex-col justify-between ${
                  isActive
                    ? `${st.color} shadow-lg scale-[1.03] ring-2 ring-offset-2 ring-sky-400`
                    : isDone
                    ? 'bg-white/80 border-emerald-400 text-slate-700 hover:scale-[1.01]'
                    : 'bg-white/90 border-slate-200 hover:border-sky-300 text-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center ${st.badgeColor}`}>
                      {st.number}
                    </span>
                    <span className="text-2xl">{st.icon}</span>
                  </div>

                  <h4 className="font-extrabold text-sm tracking-tight text-slate-900 leading-tight">
                    {st.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1 line-clamp-1">
                    {st.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  {isDone ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã xong</span>
                    </span>
                  ) : isActive ? (
                    <span className="text-sky-600 font-black">● Đang học</span>
                  ) : (
                    <span className="text-slate-400">Chưa bắt đầu</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render Current Active Station View */}
      <div className="animate-fadeIn">
        {activeStation === 'station1' && (
          <Station1Warmup
            lesson={currentLesson}
            onCompleteStation={() => markStationComplete('station1')}
            onNextStation={() => setActiveStation('station2')}
          />
        )}

        {activeStation === 'station2' && (
          <Station2Discovery
            lesson={currentLesson}
            onCompleteStation={() => markStationComplete('station2')}
            onPrevStation={() => setActiveStation('station1')}
            onNextStation={() => setActiveStation('station3')}
          />
        )}

        {activeStation === 'station3' && (
          <Station3Practice
            lesson={currentLesson}
            onCompleteStation={(score, max) => markStationComplete('station3', score)}
            onPrevStation={() => setActiveStation('station2')}
            onNextStation={() => setActiveStation('station4')}
          />
        )}

        {activeStation === 'station4' && (
          <Station4Creation
            lesson={currentLesson}
            onCompleteStation={(drawingUrl) => markStationComplete('station4')}
            onPrevStation={() => setActiveStation('station3')}
            onNextStation={() => setActiveStation('station5')}
          />
        )}

        {activeStation === 'station5' && (
          <Station5Reflection
            lesson={currentLesson}
            onFinishJourney={(reflection) => {
              markStationComplete('station5');
            }}
            onPrevStation={() => setActiveStation('station4')}
          />
        )}
      </div>
    </div>
  );
};
