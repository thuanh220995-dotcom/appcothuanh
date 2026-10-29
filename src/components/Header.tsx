import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  BookOpen,
  FolderKanban,
  Gamepad2,
  Bot,
  Users,
  TrendingUp,
  Award,
  Settings,
  HelpCircle,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { audioService } from '../utils/audio';

export type ActiveTab =
  | 'home'
  | 'stations'
  | 'lesson_plan'
  | 'materials'
  | 'games'
  | 'tutor'
  | 'classroom'
  | 'progress'
  | 'evidence';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDemoMode: boolean;
  setIsDemoMode: (demo: boolean) => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDemoMode,
  setIsDemoMode,
  onOpenSettings,
  onOpenHelp,
}) => {
  const [isMuted, setIsMuted] = useState(audioService.isMuted);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [speed, setSpeed] = useState<number>(0.95);

  const toggleSound = () => {
    audioService.isMuted = !audioService.isMuted;
    setIsMuted(audioService.isMuted);
    if (!audioService.isMuted) {
      audioService.playSound('pop');
    }
  };

  const cycleSpeed = () => {
    const nextSpeed = speed === 0.8 ? 1.0 : speed === 1.0 ? 1.2 : 0.8;
    setSpeed(nextSpeed);
    audioService.speechRate = nextSpeed;
    audioService.playSound('pop');
  };

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Sparkles, color: 'text-amber-500' },
    { id: 'stations', label: '5 Trạm Phiêu lưu', icon: Compass, color: 'text-sky-500' },
    { id: 'lesson_plan', label: 'Xưởng Bài giảng AI', icon: BookOpen, color: 'text-emerald-500' },
    { id: 'materials', label: 'Kho Học liệu', icon: FolderKanban, color: 'text-indigo-500' },
    { id: 'games', label: 'Trò chơi Trí tuệ', icon: Gamepad2, color: 'text-pink-500' },
    { id: 'tutor', label: 'Robot Tri Thức', icon: Bot, color: 'text-cyan-500' },
    { id: 'classroom', label: 'Lớp học 3D', icon: Users, color: 'text-teal-500' },
    { id: 'progress', label: 'Hành trình Trưởng thành', icon: TrendingUp, color: 'text-purple-500' },
    { id: 'evidence', label: 'Minh chứng & Hồ sơ', icon: Award, color: 'text-rose-500' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    audioService.playSound('pop');
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm transition-all">
      {/* Top Banner with Teacher, School, Mode & Audio */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 text-white px-3 md:px-6 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Identity Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Lớp 3D
            </span>
            <span className="font-semibold">Cô giáo Nguyễn Hoàng Thu Anh</span>
            <span className="hidden sm:inline text-sky-200">•</span>
            <span className="hidden sm:inline text-sky-100">Trường Tiểu học Khoái Châu 1</span>
          </div>

          {/* Quick controls: Mode & Audio */}
          <div className="flex items-center gap-2">
            {/* Mode Indicator / Switcher */}
            <button
              onClick={() => {
                const next = !isDemoMode;
                setIsDemoMode(next);
                audioService.playSound('pop');
              }}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] transition-all cursor-pointer ${
                isDemoMode
                  ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                  : 'bg-emerald-400 text-emerald-950 hover:bg-emerald-300'
              }`}
              title="Nhấn để chuyển đổi giữa Chế độ Trải nghiệm Demo và Chế độ Sử dụng Thực tế"
            >
              <ShieldCheck className="w-3 h-3" />
              {isDemoMode ? 'Chế độ Demo (Mẫu)' : 'Chế độ Thực tế'}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1 rounded-full cursor-pointer transition-colors ${
                isMuted ? 'bg-rose-500/80 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={isMuted ? 'Bật âm thanh và giọng đọc' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Speech Rate Button */}
            <button
              onClick={cycleSpeed}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-1.5 py-0.5 rounded text-[11px] cursor-pointer"
              title="Tốc độ giọng đọc tiếng Việt"
            >
              {speed}x
            </button>

            {/* Settings & Help */}
            <button
              onClick={onOpenSettings}
              className="p-1 rounded bg-white/10 hover:bg-white/25 text-white cursor-pointer"
              title="Cài đặt & Triển khai Vercel"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenHelp}
              className="p-1 rounded bg-white/10 hover:bg-white/25 text-white cursor-pointer"
              title="Hướng dẫn sử dụng"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Slogan */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-pink-500 p-0.5 shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl md:text-2xl">
              🤖
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg md:text-xl tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
                AI CÙNG EM
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 rounded-md">
                Lớp 3D
              </span>
            </div>
            <p className="text-[11px] md:text-xs font-semibold text-slate-500 line-clamp-1">
              Phiêu lưu tri thức • Cá nhân hóa học tập – Khơi mở sáng tạo
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-sm border border-sky-200'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ActiveTab)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-sky-100 text-sky-800 border border-sky-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
