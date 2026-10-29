import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  Sparkles,
  HelpCircle,
  Network,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { Lesson, LessonStation2Data } from '../types';
import { audioService } from '../utils/audio';
import { callGeminiChat } from '../utils/geminiClient';

interface Station2DiscoveryProps {
  lesson: Lesson;
  onCompleteStation: () => void;
  onPrevStation: () => void;
  onNextStation: () => void;
}

export const Station2Discovery: React.FC<Station2DiscoveryProps> = ({
  lesson,
  onCompleteStation,
  onPrevStation,
  onNextStation,
}) => {
  const data: LessonStation2Data = lesson.station2;
  const [level, setLevel] = useState<'basic' | 'standard' | 'advanced'>('standard');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [simplifiedExplanation, setSimplifiedExplanation] = useState<string | null>(null);
  const [isLoadingSimplify, setIsLoadingSimplify] = useState<boolean>(false);

  const currentLevelContent = data.levels[level];

  const handleLevelChange = (lvl: 'basic' | 'standard' | 'advanced') => {
    setLevel(lvl);
    audioService.playSound('pop');
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    audioService.playSound('pop');
    setActiveCardIndex((prev) => (prev + 1) % data.flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    audioService.playSound('pop');
    setActiveCardIndex((prev) => (prev - 1 + data.flashcards.length) % data.flashcards.length);
  };

  const handleRequestSimplify = async () => {
    setIsLoadingSimplify(true);
    audioService.playSound('pop');

    const prompt = `Em là học sinh lớp 3 (Trường Tiểu học Khoái Châu 1). Bài học là: "${lesson.title}" (${lesson.subject}). 
Nội dung hiện tại: "${currentLevelContent.content}".
Em thấy hơi khó hiểu. Robot Tri Thức hãy giải thích lại thật ngắn gọn (khoảng 3 câu), dùng ví dụ que tính, kẹo hoặc vật dụng thật gần gũi với trẻ 8 tuổi, giọng điệu vui vẻ, động viên nhé!`;

    const { reply } = await callGeminiChat([{ role: 'user', content: prompt }], lesson.subject, 'bạn nhỏ');
    setSimplifiedExplanation(reply);
    setIsLoadingSimplify(false);
    audioService.speak(reply);
  };

  const currentCard = data.flashcards[activeCardIndex] || data.flashcards[0];

  return (
    <div className="bg-white rounded-3xl border-2 border-sky-200 shadow-xl overflow-hidden transition-all">
      {/* Station Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white p-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🔍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-sky-300 text-sky-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Trạm 2 • Khám Phá Tri Thức
                </span>
                <span className="text-sky-200 text-xs font-semibold">• Môn: {lesson.subject}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {data.summaryTitle}
              </h2>
              <p className="text-sky-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Tự tìm hiểu kiến thức qua câu chuyện, hình ảnh, thẻ tương tác và sơ đồ tư duy đa cấp độ.
              </p>
            </div>
          </div>

          {/* Level Switcher (Cơ bản - Vừa sức - Mở rộng) */}
          <div className="bg-white/15 p-1.5 rounded-2xl flex items-center gap-1 border border-white/20">
            <button
              onClick={() => handleLevelChange('basic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                level === 'basic' ? 'bg-white text-sky-900 shadow-sm' : 'text-sky-100 hover:text-white'
              }`}
            >
              🌱 1. Cơ bản
            </button>
            <button
              onClick={() => handleLevelChange('standard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                level === 'standard' ? 'bg-white text-sky-900 shadow-sm' : 'text-sky-100 hover:text-white'
              }`}
            >
              ⭐ 2. Vừa sức
            </button>
            <button
              onClick={() => handleLevelChange('advanced')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                level === 'advanced' ? 'bg-white text-sky-900 shadow-sm' : 'text-sky-100 hover:text-white'
              }`}
            >
              🚀 3. Mở rộng
            </button>
          </div>
        </div>
      </div>

      {/* Main Exploration Grid */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Knowledge Card for Current Level */}
        <div className="bg-sky-50/70 border-2 border-sky-200 rounded-3xl p-6 md:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <h3 className="text-lg md:text-xl font-black text-sky-900">
                {currentLevelContent.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {/* TTS Listen Button */}
              <button
                onClick={() => audioService.speak(currentLevelContent.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-200 hover:bg-sky-300 text-sky-900 font-bold rounded-xl text-xs cursor-pointer"
                title="Nghe đọc bài giảng bằng tiếng Việt"
              >
                <Volume2 className="w-4 h-4 text-sky-800" />
                <span>Nghe đọc nội dung</span>
              </button>

              {/* Simplify Helper Button */}
              <button
                onClick={handleRequestSimplify}
                disabled={isLoadingSimplify}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-xs cursor-pointer active:scale-95 disabled:opacity-60"
                title="AI giải thích lại bằng ngôn ngữ và ví dụ siêu đơn giản cho học sinh"
              >
                <HelpCircle className="w-4 h-4 text-amber-800" />
                <span>{isLoadingSimplify ? 'Đang giải thích...' : 'Em chưa hiểu? Nhờ AI giải thích lại'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm">
            <p className="text-slate-800 text-base md:text-lg leading-relaxed font-semibold font-['Quicksand']">
              {currentLevelContent.content}
            </p>

            {/* Key Bullet Points */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
              <span className="text-xs font-extrabold text-sky-800 uppercase tracking-wider">Từ khóa cốt lõi:</span>
              {currentLevelContent.keyPoints.map((kp, idx) => (
                <span
                  key={idx}
                  className="bg-sky-100 text-sky-800 text-xs md:text-sm font-bold px-3 py-1 rounded-full border border-sky-200"
                >
                  ✓ {kp}
                </span>
              ))}
            </div>
          </div>

          {/* AI Simplified Response Box */}
          {simplifiedExplanation && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
                <span>Robot Tri Thức mách nhỏ bạn:</span>
              </div>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-semibold">
                {simplifiedExplanation}
              </p>
            </div>
          )}
        </div>

        {/* 2 Interactive Tools: Flashcard & Mind Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Flashcard */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎴</span>
                <h4 className="font-extrabold text-slate-800 text-base">Thẻ Ghi Nhớ Thông Minh</h4>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Thẻ {activeCardIndex + 1} / {data.flashcards.length}
              </span>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => {
                setIsFlipped(!isFlipped);
                audioService.playSound('pop');
              }}
              className="h-48 bg-gradient-to-br from-indigo-500 via-sky-500 to-blue-600 rounded-2xl p-6 text-white flex flex-col justify-between cursor-pointer select-none shadow-md hover:shadow-lg transition-transform hover:scale-[1.01]"
              title="Nhấn vào thẻ để lật mặt sau"
            >
              <div className="flex items-center justify-between text-xs text-sky-200">
                <span className="font-bold">{isFlipped ? 'MẶT SAU (LỜI GIẢI / Ý NGHĨA)' : 'MẶT TRƯỚC (CÂU HỎI)'}</span>
                <RotateCcw className="w-4 h-4" />
              </div>

              <div className="text-center my-auto">
                {isFlipped ? (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="text-3xl font-black text-amber-300">{currentCard.back}</div>
                    <div className="text-xs text-sky-100 font-semibold italic">
                      Ví dụ: {currentCard.example}
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl md:text-3xl font-extrabold animate-fadeIn">
                    {currentCard.front}
                  </div>
                )}
              </div>

              <div className="text-center text-[11px] text-sky-200">
                Bấm vào đây để lật thẻ • Nghe giải thích
              </div>
            </div>

            {/* Flashcard Nav Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrevCard}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                ← Thẻ trước
              </button>
              <button
                onClick={() =>
                  audioService.speak(
                    isFlipped ? `${currentCard.back}. ${currentCard.example}` : currentCard.front
                  )
                }
                className="px-4 py-2 bg-sky-100 hover:bg-sky-200 rounded-xl text-xs font-bold text-sky-800 flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Nghe thẻ này</span>
              </button>
              <button
                onClick={handleNextCard}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Thẻ tiếp →
              </button>
            </div>
          </div>

          {/* Mind Map Tree Nodes */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-indigo-600" />
              <h4 className="font-extrabold text-slate-800 text-base">Sơ Đồ Tư Duy Bài Học</h4>
            </div>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
              {data.mindMapNodes.map((node) => {
                const isRoot = !node.parentId;
                return (
                  <div
                    key={node.id}
                    className={`p-3 rounded-xl font-bold text-xs md:text-sm shadow-sm transition-all flex items-center justify-between ${
                      isRoot ? 'bg-indigo-600 text-white text-base py-3.5' : `${node.color} ml-6 border border-slate-200/50`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{isRoot ? '🌟' : '🔹'}</span>
                      <span>{node.label}</span>
                    </div>
                    <button
                      onClick={() => audioService.speak(node.label)}
                      className="p-1 rounded-lg hover:bg-black/10 text-current cursor-pointer"
                      title="Nghe nhánh sơ đồ"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 italic text-center">
              Sơ đồ tư duy trực quan giúp các bạn Lớp 3D ghi nhớ logic và phát triển năng lực tự học.
            </p>
          </div>
        </div>

        {/* Bottom Station Nav */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            onClick={onPrevStation}
            className="text-slate-600 hover:text-slate-900 font-bold text-xs md:text-sm px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
          >
            ← Quay lại Trạm 1
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onCompleteStation();
                audioService.playSound('celebrate');
              }}
              className="bg-sky-100 hover:bg-sky-200 text-sky-900 font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              Ghi nhận hoàn thành Trạm 2 ⭐
            </button>
            <button
              onClick={onNextStation}
              className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Tiến vào Trạm 3 - Nhiệm vụ ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
