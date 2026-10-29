import React from 'react';
import {
  Compass,
  BookOpen,
  Gamepad2,
  Bot,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { ActiveTab } from './Header';
import { RobotMascot } from './RobotMascot';
import { Lesson } from '../types';
import { audioService } from '../utils/audio';

interface HomeViewProps {
  onNavigate: (tab: ActiveTab) => void;
  lessons: Lesson[];
  onSelectLesson: (id: string) => void;
  onOpenHelp: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  lessons,
  onSelectLesson,
  onOpenHelp,
}) => {
  const stationsOverview = [
    {
      num: 1,
      title: 'Trạm 1: Khởi Động Hứng Thú',
      desc: 'Câu đố vui thông thái, lật ô bí mật và trò chơi quan sát kích hoạt trí tò mò.',
      color: 'bg-emerald-500',
      badge: 'border-emerald-300 bg-emerald-50 text-emerald-950',
      icon: '💡',
    },
    {
      num: 2,
      title: 'Trạm 2: Trạm Khám Phá',
      desc: 'Tìm hiểu kiến thức đa giác quan qua câu chuyện, thẻ ghi nhớ và sơ đồ tư duy 3 cấp độ.',
      color: 'bg-sky-500',
      badge: 'border-sky-300 bg-sky-50 text-sky-950',
      icon: '🔍',
    },
    {
      num: 3,
      title: 'Trạm 3: Trạm Nhiệm Vụ',
      desc: 'Cá nhân hóa nhiệm vụ học tập theo 3 mức độ (nền tảng, vận dụng, thử thách), chấm điểm tự động.',
      color: 'bg-pink-500',
      badge: 'border-pink-300 bg-pink-50 text-pink-950',
      icon: '📋',
    },
    {
      num: 4,
      title: 'Trạm 4: Trạm Sáng Tạo',
      desc: 'Bảng vẽ trực tuyến rực rỡ sắc màu, viết câu chuyện ngắn và thiết kế sản phẩm tri thức.',
      color: 'bg-amber-500',
      badge: 'border-amber-300 bg-amber-50 text-amber-950',
      icon: '🎨',
    },
    {
      num: 5,
      title: 'Trạm 5: Trạm Phản Hồi',
      desc: 'Tự đánh giá cảm xúc, ghi nhận điều còn băn khoăn và mở khóa vinh danh chiến binh tri thức.',
      color: 'bg-purple-500',
      badge: 'border-purple-300 bg-purple-50 text-purple-950',
      icon: '🌟',
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Grand Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-indigo-600 to-pink-500 rounded-3xl p-6 md:p-12 text-white shadow-2xl">
        {/* Soft background floating shapes */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & Call to Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs md:text-sm font-bold border border-white/30 text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Cá nhân hóa học tập – Khơi mở sáng tạo – Phát triển năng lực</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-md">
                AI CÙNG EM
              </h1>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-300 drop-shadow-sm">
                PHIÊU LƯU TRI THỨC LỚP 3
              </div>
            </div>

            {/* Teacher, School & Class Info Card */}
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-3.5 max-w-lg mx-auto lg:mx-0 text-xs md:text-sm text-sky-100 flex flex-wrap items-center justify-around gap-3">
              <div>
                <span className="text-sky-200 text-[11px] block">Giáo viên phụ trách</span>
                <b className="text-white text-sm">Nguyễn Hoàng Thu Anh</b>
              </div>
              <div className="w-px h-8 bg-white/20 hidden sm:block" />
              <div>
                <span className="text-sky-200 text-[11px] block">Đơn vị công tác</span>
                <b className="text-white text-sm">Trường TH Khoái Châu 1</b>
              </div>
              <div className="w-px h-8 bg-white/20 hidden sm:block" />
              <div>
                <span className="text-sky-200 text-[11px] block">Lớp đồng hành</span>
                <b className="text-amber-300 text-sm font-black">LỚP 3D</b>
              </div>
            </div>

            {/* 6 Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <button
                onClick={() => {
                  audioService.playSound('celebrate');
                  onNavigate('stations');
                }}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-6 py-3.5 rounded-2xl text-sm md:text-base shadow-lg shadow-amber-500/30 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
              >
                <span>Bắt đầu phiêu lưu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  audioService.playSound('pop');
                  onNavigate('lesson_plan');
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold px-4 py-3.5 rounded-2xl text-xs md:text-sm backdrop-blur-sm border border-white/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>Xưởng giáo viên</span>
              </button>

              <button
                onClick={() => {
                  audioService.playSound('pop');
                  onNavigate('games');
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold px-4 py-3.5 rounded-2xl text-xs md:text-sm backdrop-blur-sm border border-white/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Gamepad2 className="w-4 h-4 text-pink-300" />
                <span>Trò chơi trí tuệ</span>
              </button>

              <button
                onClick={() => {
                  audioService.playSound('pop');
                  onNavigate('tutor');
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold px-4 py-3.5 rounded-2xl text-xs md:text-sm backdrop-blur-sm border border-white/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>Gặp Robot Tri Thức</span>
              </button>

              <button
                onClick={onOpenHelp}
                className="bg-white/10 hover:bg-white/20 text-sky-100 font-bold px-3 py-3.5 rounded-2xl text-xs cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Hướng dẫn</span>
              </button>
            </div>
          </div>

          {/* Right Mascot (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <RobotMascot
              size="lg"
              message="Xin chào các bạn nhỏ lớp 3D! Mình là AI Cùng Em. Hôm nay chúng mình sẽ cùng khám phá những điều thú vị nhé!"
            />
          </div>
        </div>
      </section>

      {/* 5-Station Connected Roadmap Presentation */}
      <section className="bg-white rounded-3xl p-6 md:p-10 border-2 border-slate-200 shadow-lg space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-black uppercase text-sky-600 tracking-wider">
            Mô hình giáo dục hiện đại
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            Hành Trình 5 Trạm Phiêu Lưu AI Lớp 3
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-semibold">
            Mỗi bài học được thiết kế như một cuộc thám hiểm hấp dẫn, giúp học sinh chủ động khám phá và sáng tạo
          </p>
        </div>

        {/* 5 Connected Stations Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {stationsOverview.map((st) => (
            <div
              key={st.num}
              onClick={() => {
                audioService.playSound('pop');
                onNavigate('stations');
              }}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer hover:shadow-xl hover:scale-[1.02] flex flex-col justify-between ${st.badge}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`w-8 h-8 rounded-2xl text-white font-black text-sm flex items-center justify-center shadow-md ${st.color}`}>
                    {st.num}
                  </span>
                  <span className="text-3xl">{st.icon}</span>
                </div>
                <h3 className="font-extrabold text-sm md:text-base text-slate-900 leading-snug">
                  {st.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  {st.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Vào trạm ngay</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Featured Sample Lessons */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-slate-800">
              Khám Phá Các Bài Học Mẫu Chuẩn GDPT 2018
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Đầy đủ 5 trạm hoạt động thực tế, câu hỏi phân hóa, sơ đồ tư duy và giọng đọc tiếng Việt
            </p>
          </div>
          <button
            onClick={() => onNavigate('stations')}
            className="text-xs md:text-sm font-extrabold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả bài</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {lessons.slice(0, 3).map((les) => (
            <div
              key={les.id}
              onClick={() => {
                onSelectLesson(les.id);
                onNavigate('stations');
                audioService.playSound('pop');
              }}
              className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                    {les.subject}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {les.durationMinutes} phút
                  </span>
                </div>
                <h4 className="font-extrabold text-lg text-slate-900 leading-snug">
                  {les.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 font-semibold">
                  {les.objective}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
                <span>Bộ sách: {les.bookSeries}</span>
                <span className="flex items-center gap-1">
                  <span>Học ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
