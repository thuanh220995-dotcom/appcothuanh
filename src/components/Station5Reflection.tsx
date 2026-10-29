import React, { useState } from 'react';
import {
  Star,
  Sparkles,
  Heart,
  Send,
  MessageSquare,
  Award,
  CheckCircle2,
  Volume2,
  Smile,
  Meh,
  Frown,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, LessonStation5Data } from '../types';
import { audioService } from '../utils/audio';

interface Station5ReflectionProps {
  lesson: Lesson;
  onFinishJourney: (reflectionData: {
    emoji: string;
    selfRate: 'need_help' | 'understood' | 'mastered';
    learned: string;
    concern: string;
    questionForTeacher: string;
  }) => void;
  onPrevStation: () => void;
}

export const Station5Reflection: React.FC<Station5ReflectionProps> = ({
  lesson,
  onFinishJourney,
  onPrevStation,
}) => {
  const data: LessonStation5Data = lesson.station5;

  const [selectedEmoji, setSelectedEmoji] = useState<string>('🤩 Rất hào hứng');
  const [selfEvaluation, setSelfEvaluation] = useState<'need_help' | 'understood' | 'mastered'>('understood');
  const [learnedText, setLearnedText] = useState<string>('');
  const [concernText, setConcernText] = useState<string>('');
  const [questionForTeacher, setQuestionForTeacher] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const emojis = [
    { label: '🤩 Rất hào hứng', icon: '🤩', text: 'Cực kỳ thích thú và năng động' },
    { label: '😊 Vui vẻ hiểu bài', icon: '😊', text: 'Thấy bài học bổ ích, dễ hiểu' },
    { label: '🤔 Hơi băn khoăn', icon: '🤔', text: 'Có vài chỗ em muốn hỏi thêm' },
    { label: '🌱 Cố gắng hơn', icon: '🌱', text: 'Em sẽ luyện tập thêm nhiều lần' },
  ];

  const selfRateOptions: { key: 'need_help' | 'understood' | 'mastered'; title: string; subtitle: string; icon: string }[] = [
    {
      key: 'need_help',
      title: 'Em cần hỗ trợ thêm',
      subtitle: 'Em muốn cô giáo hoặc bạn bè hướng dẫn thêm một số phần',
      icon: '🤝',
    },
    {
      key: 'understood',
      title: 'Em đã hiểu bài',
      subtitle: 'Em nắm vững kiến thức chính và tự làm được bài tập cơ bản',
      icon: '⭐',
    },
    {
      key: 'mastered',
      title: 'Em có thể vận dụng tốt',
      subtitle: 'Em tự tin giải bài nâng cao và sẵn sàng giúp đỡ bạn khác',
      icon: '🚀',
    },
  ];

  const handleFinish = () => {
    setIsCompleted(true);
    audioService.playSound('celebrate');
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
    });

    onFinishJourney({
      emoji: selectedEmoji,
      selfRate: selfEvaluation,
      learned: learnedText,
      concern: concernText,
      questionForTeacher,
    });
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl overflow-hidden transition-all">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 text-white p-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-300 text-purple-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Trạm 5 • Phản Hồi & Suy Ngẫm
                </span>
                <span className="text-purple-200 text-xs font-semibold">• Trạm đích vinh quang</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Nhìn Lại Chặng Đường & Đánh Giá
              </h2>
              <p className="text-purple-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Tự đánh giá mức độ hiểu bài, gửi gắm suy nghĩ tới cô giáo Thu Anh và nhận lời khích lệ ấm áp.
              </p>
            </div>
          </div>

          <button
            onClick={() => audioService.speak(data.teacherCheer)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Nghe lời cô nhắn</span>
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Teacher Warm Cheer Box */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="text-3xl">🌸</div>
          <div className="space-y-1">
            <span className="text-xs font-black text-purple-800 uppercase tracking-wider">
              Lời nhắn từ Cô giáo Nguyễn Hoàng Thu Anh (Lớp 3D):
            </span>
            <p className="text-slate-800 text-sm md:text-base font-bold italic leading-relaxed">
              "{data.teacherCheer}"
            </p>
          </div>
        </div>

        {/* 1. Emoji Feeling Picker */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span>1. Hôm nay em cảm thấy tiết học như thế nào?</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {emojis.map((em) => {
              const isSelected = selectedEmoji === em.label;
              return (
                <button
                  key={em.label}
                  onClick={() => {
                    setSelectedEmoji(em.label);
                    audioService.playSound('pop');
                  }}
                  className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 border-purple-700 text-white shadow-md scale-[1.02]'
                      : 'bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-700'
                  }`}
                >
                  <div className="text-3xl mb-1">{em.icon}</div>
                  <div className="font-extrabold text-xs md:text-sm">{em.label}</div>
                  <div className={`text-[10px] mt-1 ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                    {em.text}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Three Mandatory Self-Rate Options */}
        <div className="space-y-3">
          <label className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span>2. Tự đánh giá mức độ hiểu bài của em:</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selfRateOptions.map((opt) => {
              const isSelected = selfEvaluation === opt.key;
              return (
                <div
                  key={opt.key}
                  onClick={() => {
                    setSelfEvaluation(opt.key);
                    audioService.playSound('pop');
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-100/90 border-purple-500 shadow-md text-purple-950 ring-2 ring-purple-400 ring-offset-1'
                      : 'bg-white border-slate-200 hover:border-purple-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{opt.icon}</span>
                    <h4 className="font-black text-sm md:text-base">{opt.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {opt.subtitle}
                  </p>
                  <div className="mt-3 text-right">
                    <span className={`text-xs font-bold ${isSelected ? 'text-purple-700' : 'text-slate-400'}`}>
                      {isSelected ? '● Đã chọn' : '○ Bấm chọn'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Open text: What I learned & Concerns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <span>✍️ Hôm nay em học được điều gì mới nhất?</span>
            </label>
            <textarea
              rows={3}
              value={learnedText}
              onChange={(e) => setLearnedText(e.target.value)}
              placeholder="Ví dụ: Em đã nhớ được 7 x 8 = 56 và biết thêm cách tính số ngày trong 4 tuần..."
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-400 rounded-2xl p-3.5 text-xs md:text-sm font-semibold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
              <span>💭 Điều em còn băn khoăn hoặc câu hỏi gửi cô Thu Anh:</span>
            </label>
            <textarea
              rows={3}
              value={concernText}
              onChange={(e) => setConcernText(e.target.value)}
              placeholder="Ví dụ: Cô ơi, tiết sau mình có được chơi trò vòng quay may mắn nữa không ạ?..."
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-purple-400 rounded-2xl p-3.5 text-xs md:text-sm font-semibold outline-none"
            />
          </div>
        </div>

        {/* Grand Completion Card when Clicked Finish */}
        {isCompleted && (
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-8 rounded-3xl border-2 border-amber-500 text-amber-950 shadow-2xl text-center space-y-4 animate-bounceOnce">
            <div className="text-5xl">🏆</div>
            <h3 className="text-2xl md:text-3xl font-black">
              Chúc Mừng Chiến Binh Lớp 3D Đã Hoàn Thành Hành Trình 5 Trạm!
            </h3>
            <p className="text-sm md:text-base font-bold text-amber-900 max-w-xl mx-auto leading-relaxed">
              Em đã xuất sắc vượt qua các thử thách khởi động, khám phá, luyện tập, sáng tạo và tự tin suy ngẫm. Kết quả học tập đã được lưu vào Hồ sơ Trưởng thành của lớp!
            </p>
            <div className="inline-flex items-center gap-2 bg-white/90 text-amber-950 px-4 py-2 rounded-full font-black text-sm shadow-md">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Huy hiệu đạt được: Dũng Sĩ Tri Thức Lớp 3D ⭐</span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            onClick={onPrevStation}
            className="text-slate-600 hover:text-slate-900 font-bold text-xs md:text-sm px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
          >
            ← Quay lại Trạm 4
          </button>

          <button
            onClick={handleFinish}
            className="bg-purple-600 hover:bg-purple-700 text-white font-black px-8 py-3.5 rounded-2xl text-base shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>Hoàn thành hành trình & Nhận huy hiệu 🏆</span>
          </button>
        </div>
      </div>
    </div>
  );
};
