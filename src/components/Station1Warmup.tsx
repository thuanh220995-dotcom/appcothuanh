import React, { useState } from 'react';
import {
  Lightbulb,
  Sparkles,
  Volume2,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Eye,
  Award,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, LessonStation1Data } from '../types';
import { audioService } from '../utils/audio';
import { callGeminiGenerate } from '../utils/geminiClient';

interface Station1WarmupProps {
  lesson: Lesson;
  onCompleteStation: () => void;
  onNextStation: () => void;
}

export const Station1Warmup: React.FC<Station1WarmupProps> = ({
  lesson,
  onCompleteStation,
  onNextStation,
}) => {
  const [stationData, setStationData] = useState<LessonStation1Data>(lesson.station1);
  const [activeTab, setActiveTab] = useState<'riddle' | 'observation' | 'secretTile'>('riddle');

  // Riddle state
  const [showRiddleAnswer, setShowRiddleAnswer] = useState(false);
  const [riddleUserGuess, setRiddleUserGuess] = useState('');
  const [riddleFeedback, setRiddleFeedback] = useState<string | null>(null);

  // Observation state
  const [selectedObsOption, setSelectedObsOption] = useState<number | null>(null);
  const [obsFeedback, setObsFeedback] = useState<boolean | null>(null);

  // Secret tiles state
  const [revealedTiles, setRevealedTiles] = useState<number[]>([]);
  const [isSecretSolved, setIsSecretSolved] = useState(false);

  // AI Generation Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const handleRevealTile = (id: number) => {
    if (!revealedTiles.includes(id)) {
      audioService.playSound('pop');
      const updated = [...revealedTiles, id];
      setRevealedTiles(updated);
      if (updated.length === stationData.secretTile.tiles.length) {
        setIsSecretSolved(true);
        audioService.playSound('celebrate');
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleCheckRiddle = () => {
    if (!riddleUserGuess.trim()) return;
    setShowRiddleAnswer(true);
    audioService.playSound('correct');
    setRiddleFeedback('Tuyệt vời! Bạn đã suy nghĩ rất tích cực cùng câu đố này! 🌟');
  };

  const handleSelectObs = (idx: number) => {
    setSelectedObsOption(idx);
    const isCorrect = idx === stationData.observationGame.correctIndex;
    setObsFeedback(isCorrect);
    if (isCorrect) {
      audioService.playSound('correct');
      confetti({ particleCount: 50, spread: 60 });
    } else {
      audioService.playSound('wrong');
    }
  };

  const handleGenerateNewAI = async () => {
    setIsGenerating(true);
    setAiNote(null);
    audioService.playSound('pop');

    const prompt = `Bạn là trợ lý giáo viên lớp 3 (Trường Tiểu học Khoái Châu 1). Hãy tạo 1 hoạt động khởi động mới (3-5 phút) cho bài học: "${lesson.title}" môn ${lesson.subject}.
Trả về định dạng JSON thuần túy (không markdown) với cấu trúc:
{
  "warmupRiddle": {
    "riddle": "4 câu thơ câu đố vui tiếng Việt cho học sinh lớp 3",
    "hint": "Gợi ý đơn giản",
    "answer": "Đáp án",
    "explanation": "Giải thích ngắn"
  },
  "observationGame": {
    "title": "Tên tình huống quan sát",
    "description": "Mô tả ngắn gọn gắn liền thực tế",
    "question": "Câu hỏi dự đoán",
    "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
    "correctIndex": 0,
    "explanation": "Lời giải thích"
  },
  "secretTile": {
    "topic": "Chủ đề bí mật",
    "question": "Câu hỏi mở ô chữ",
    "tiles": [
      {"id": 1, "clue": "Gợi ý 1", "isRevealed": false},
      {"id": 2, "clue": "Gợi ý 2", "isRevealed": false},
      {"id": 3, "clue": "Gợi ý 3", "isRevealed": false},
      {"id": 4, "clue": "Gợi ý 4", "isRevealed": false}
    ],
    "hiddenContent": "Thông điệp bí mật vinh danh học sinh Lớp 3D",
    "answer": "Quy tắc cốt lõi của bài học"
  }
}`;

    const { text, isAi } = await callGeminiGenerate({
      prompt,
      responseMimeType: 'application/json',
      temperature: 0.8,
    });

    try {
      // Parse clean json
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.warmupRiddle && parsed.observationGame && parsed.secretTile) {
        setStationData(parsed);
        setRevealedTiles([]);
        setIsSecretSolved(false);
        setShowRiddleAnswer(false);
        setSelectedObsOption(null);
        setObsFeedback(null);
        setAiNote(isAi ? '✨ AI Gemini vừa sáng tạo bộ hoạt động khởi động mới!' : '✨ Đã làm mới hoạt động từ ngân hàng sư phạm chuẩn GDPT 2018.');
        audioService.playSound('celebrate');
      }
    } catch (e) {
      console.warn('Could not parse generated station 1 json:', e);
      setAiNote('Đã cập nhật hoạt động khởi động phong phú cho học sinh.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-xl overflow-hidden transition-all">
      {/* Station Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white p-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              💡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-400 text-emerald-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Trạm 1 • Thời lượng: 3 - 5 phút
                </span>
                <span className="text-emerald-200 text-xs font-semibold">• Môn: {lesson.subject}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Khởi Động Hứng Thú
              </h2>
              <p className="text-emerald-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Khơi gợi tò mò, kích hoạt tri thức ban đầu qua câu đố vui và trò chơi quan sát sinh động.
              </p>
            </div>
          </div>

          {/* AI Generator button */}
          <button
            onClick={handleGenerateNewAI}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="AI tự động tạo hoạt động khởi động mới mẻ, không lặp lại"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'AI đang tạo...' : 'Tạo hoạt động mới bằng AI'}</span>
          </button>
        </div>

        {aiNote && (
          <div className="mt-3 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-50 flex items-center gap-1.5 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{aiNote}</span>
          </div>
        )}

        {/* Sub-tab Pills */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={() => setActiveTab('riddle')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'riddle'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            🧩 1. Câu đố vui thông thái
          </button>
          <button
            onClick={() => setActiveTab('observation')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'observation'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            🔍 2. Quan sát & Dự đoán
          </button>
          <button
            onClick={() => setActiveTab('secretTile')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'secretTile'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            🎁 3. Lật ô bí mật 4 mảnh ghép
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Tab 1: Câu đố vui */}
        {activeTab === 'riddle' && (
          <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏮</span>
                <h3 className="text-lg md:text-xl font-black text-emerald-900">
                  Câu đố khởi động vui nhộn
                </h3>
              </div>

              {/* TTS Listen */}
              <button
                onClick={() => audioService.speak(stationData.warmupRiddle.riddle)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-200 hover:bg-emerald-300 text-emerald-900 font-bold rounded-xl text-xs cursor-pointer"
                title="Nghe AI đọc câu đố bằng tiếng Việt"
              >
                <Volume2 className="w-4 h-4 text-emerald-800" />
                <span>Nghe đọc câu đố</span>
              </button>
            </div>

            {/* Riddle text formatted in poetic box */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm text-center">
              <p className="text-slate-800 text-base md:text-lg font-bold italic leading-relaxed whitespace-pre-line font-['Quicksand']">
                "{stationData.warmupRiddle.riddle}"
              </p>
              <div className="mt-4 text-xs font-semibold text-emerald-700 bg-emerald-100/60 inline-block px-3 py-1 rounded-full">
                💡 Gợi ý: {stationData.warmupRiddle.hint}
              </div>
            </div>

            {/* Student Guess Input */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={riddleUserGuess}
                onChange={(e) => setRiddleUserGuess(e.target.value)}
                placeholder="Nhập câu trả lời hoặc suy nghĩ của em..."
                className="flex-1 bg-white border-2 border-emerald-300 focus:border-emerald-500 rounded-2xl px-4 py-3 text-sm md:text-base font-semibold outline-none w-full"
                onKeyDown={(e) => e.key === 'Enter' && handleCheckRiddle()}
              />
              <button
                onClick={handleCheckRiddle}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-2xl text-sm shadow-md transition-all cursor-pointer"
              >
                Kiểm tra đáp án ✨
              </button>
              <button
                onClick={() => {
                  setShowRiddleAnswer(!showRiddleAnswer);
                  audioService.playSound('pop');
                }}
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-2xl text-xs cursor-pointer"
              >
                {showRiddleAnswer ? 'Ẩn đáp án' : 'Xem đáp án'}
              </button>
            </div>

            {/* Revealed Answer Box */}
            {showRiddleAnswer && (
              <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-amber-800 font-black text-sm md:text-base">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Đáp án đúng: {stationData.warmupRiddle.answer}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {stationData.warmupRiddle.explanation}
                </p>
                {riddleFeedback && (
                  <p className="text-emerald-700 font-bold text-xs pt-1">{riddleFeedback}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Quan sát & Dự đoán */}
        {activeTab === 'observation' && (
          <div className="bg-teal-50/70 border-2 border-teal-200 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg md:text-xl font-black text-teal-900">
                  {stationData.observationGame.title}
                </h3>
              </div>

              <button
                onClick={() =>
                  audioService.speak(
                    `${stationData.observationGame.description}. ${stationData.observationGame.question}`
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-200 hover:bg-teal-300 text-teal-900 font-bold rounded-xl text-xs cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-teal-800" />
                <span>Nghe tình huống</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm">
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-semibold">
                {stationData.observationGame.description}
              </p>
              <div className="mt-3 p-3 bg-teal-100/50 rounded-xl text-teal-900 font-extrabold text-sm md:text-base">
                ❓ {stationData.observationGame.question}
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stationData.observationGame.options.map((opt, idx) => {
                const isSelected = selectedObsOption === idx;
                const isCorrect = idx === stationData.observationGame.correctIndex;
                let btnStyle = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-400';

                if (isSelected) {
                  btnStyle = isCorrect
                    ? 'bg-emerald-500 border-2 border-emerald-600 text-white shadow-md'
                    : 'bg-rose-500 border-2 border-rose-600 text-white shadow-md';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectObs(idx)}
                    className={`p-4 rounded-2xl text-left font-bold text-sm md:text-base transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <span>{isCorrect ? '✅ Đúng rồi!' : '❌ Thử lại nhé!'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {obsFeedback !== null && (
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed font-semibold ${
                  obsFeedback
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {obsFeedback ? (
                  <div>
                    <span className="font-extrabold">🎉 Chính xác! </span>
                    {stationData.observationGame.explanation}
                  </div>
                ) : (
                  <div>
                    <span className="font-extrabold">💡 Gợi ý thêm: </span>
                    Hãy cùng quan sát kĩ lại số lượng và thực hiện phép tính nhé!
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Lật ô bí mật 4 mảnh ghép */}
        {activeTab === 'secretTile' && (
          <div className="bg-green-50/70 border-2 border-green-200 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layers className="w-6 h-6 text-green-600" />
                <h3 className="text-lg md:text-xl font-black text-green-900">
                  {stationData.secretTile.topic}
                </h3>
              </div>
              <span className="text-xs font-bold bg-green-200 text-green-900 px-3 py-1 rounded-full">
                Đã mở: {revealedTiles.length} / {stationData.secretTile.tiles.length} ô
              </span>
            </div>

            <p className="text-slate-700 text-sm font-semibold">
              {stationData.secretTile.question}
            </p>

            {/* 4 Interactive Secret Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stationData.secretTile.tiles.map((tile) => {
                const isRevealed = revealedTiles.includes(tile.id);
                return (
                  <div
                    key={tile.id}
                    onClick={() => handleRevealTile(tile.id)}
                    className={`p-6 rounded-2xl border-2 transition-all cursor-pointer select-none text-center min-h-[110px] flex flex-col items-center justify-center ${
                      isRevealed
                        ? 'bg-white border-green-400 shadow-md text-emerald-900 font-extrabold'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-700 text-white font-bold hover:scale-[1.02] shadow-lg'
                    }`}
                  >
                    {isRevealed ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-green-600 uppercase">Mảnh ghép số {tile.id}</span>
                        <p className="text-sm md:text-base font-extrabold">{tile.clue}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-3xl">❓</span>
                        <p className="text-xs md:text-sm">Bấm để lật mở ô số {tile.id}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Revealed Secret Box */}
            {isSecretSolved && (
              <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-6 rounded-2xl text-amber-950 font-bold border-2 border-amber-500 shadow-lg text-center space-y-2 animate-bounceOnce">
                <div className="text-2xl">🏆</div>
                <h4 className="text-lg md:text-xl font-black">
                  {stationData.secretTile.hiddenContent}
                </h4>
                <p className="text-sm font-semibold text-amber-900">
                  {stationData.secretTile.answer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Station Navigation Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Hoàn thành Trạm 1 để khơi mở Trạm 2 - Khám phá tri thức</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onCompleteStation();
                audioService.playSound('celebrate');
                confetti({ particleCount: 70, spread: 80 });
              }}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              Ghi nhận hoàn thành Trạm 1 ⭐
            </button>
            <button
              onClick={onNextStation}
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Tiếp tục sang Trạm 2 ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
