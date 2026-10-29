import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  Volume2,
  HelpCircle,
  RotateCcw,
  Award,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, Question } from '../types';
import { audioService } from '../utils/audio';

interface Station3PracticeProps {
  lesson: Lesson;
  onCompleteStation: (score: number, maxScore: number) => void;
  onPrevStation: () => void;
  onNextStation: () => void;
}

export const Station3Practice: React.FC<Station3PracticeProps> = ({
  lesson,
  onCompleteStation,
  onPrevStation,
  onNextStation,
}) => {
  const allTasks: Question[] = lesson.station3.tasks;
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<number | 'all'>('all');

  // Answers map: questionId -> value
  const [answers, setAnswers] = useState<Record<string, any>>({});
  // Submitted status
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  // Show hints map
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  // Matching pair state for questions of type 'matching'
  // questionId -> array of selected left / right items
  const [matchingSelections, setMatchingSelections] = useState<Record<string, { left?: string; right?: string }>>({});
  const [matchedPairs, setMatchedPairs] = useState<Record<string, Record<string, string>>>({});

  const filteredTasks = selectedLevelFilter === 'all'
    ? allTasks
    : allTasks.filter((t) => t.level === selectedLevelFilter);

  const handleSelectOption = (qid: string, val: string | number | boolean) => {
    if (isSubmitted) return;
    audioService.playSound('pop');
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const handleMatchingClick = (qid: string, side: 'left' | 'right', value: string) => {
    if (isSubmitted) return;
    audioService.playSound('pop');

    const currentSel = matchingSelections[qid] || {};
    const updatedSel = { ...currentSel, [side]: value };

    if (updatedSel.left && updatedSel.right) {
      // Create match pair
      const curPairs = matchedPairs[qid] || {};
      const newPairs = { ...curPairs, [updatedSel.left]: updatedSel.right };
      setMatchedPairs((prev) => ({ ...prev, [qid]: newPairs }));
      setMatchingSelections((prev) => ({ ...prev, [qid]: {} }));
      audioService.playSound('correct');
    } else {
      setMatchingSelections((prev) => ({ ...prev, [qid]: updatedSel }));
    }
  };

  const toggleHint = (qid: string) => {
    audioService.playSound('pop');
    setRevealedHints((prev) => ({ ...prev, [qid]: !prev[qid] }));
  };

  // Grading calculation
  const calculateScore = () => {
    let score = 0;
    const maxScore = filteredTasks.length * 10;

    filteredTasks.forEach((t) => {
      const userAns = answers[t.id];
      if (t.type === 'matching') {
        const pairs = matchedPairs[t.id] || {};
        let allMatched = true;
        if (t.pairs && t.pairs.length > 0) {
          t.pairs.forEach((p) => {
            if (pairs[p.left] !== p.right) allMatched = false;
          });
        }
        if (allMatched && Object.keys(pairs).length > 0) score += 10;
      } else if (t.type === 'fill-blank') {
        const cleanUser = String(userAns || '').trim().toLowerCase();
        const cleanCorrect = String(t.correctAnswer).trim().toLowerCase();
        if (cleanUser === cleanCorrect) score += 10;
      } else {
        if (String(userAns) === String(t.correctAnswer)) score += 10;
      }
    });

    return { score, maxScore };
  };

  const handleSubmitAll = () => {
    setIsSubmitted(true);
    const { score, maxScore } = calculateScore();
    const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;

    if (percent >= 70) {
      audioService.playSound('celebrate');
      confetti({ particleCount: 80, spread: 80 });
    } else {
      audioService.playSound('correct');
    }

    onCompleteStation(score, maxScore);
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setAnswers({});
    setMatchedPairs({});
    setMatchingSelections({});
    audioService.playSound('pop');
  };

  const { score, maxScore } = calculateScore();
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border-2 border-pink-200 shadow-xl overflow-hidden transition-all">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-red-500 text-white p-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-pink-300 text-pink-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Trạm 3 • Nhiệm Vụ Học Tập
                </span>
                <span className="text-pink-100 text-xs font-semibold">• Phân hóa năng lực</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Luyện Tập & Vận Dụng Thực Tế
              </h2>
              <p className="text-pink-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Làm bài theo năng lực, nhận phản hồi tức thì, giải thích chi tiết và gợi ý từng bước.
              </p>
            </div>
          </div>

          {/* Level Filter Tabs */}
          <div className="bg-white/15 p-1.5 rounded-2xl flex items-center gap-1 border border-white/20">
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedLevelFilter === 'all' ? 'bg-white text-pink-900 shadow-sm' : 'text-pink-100 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedLevelFilter(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedLevelFilter === 1 ? 'bg-white text-pink-900 shadow-sm' : 'text-pink-100 hover:text-white'
              }`}
            >
              Mức 1: Nền tảng
            </button>
            <button
              onClick={() => setSelectedLevelFilter(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedLevelFilter === 2 ? 'bg-white text-pink-900 shadow-sm' : 'text-pink-100 hover:text-white'
              }`}
            >
              Mức 2: Vận dụng
            </button>
            <button
              onClick={() => setSelectedLevelFilter(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedLevelFilter === 3 ? 'bg-white text-pink-900 shadow-sm' : 'text-pink-100 hover:text-white'
              }`}
            >
              Mức 3: Nâng cao
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6 md:p-8 space-y-6">
        {filteredTasks.map((task, idx) => {
          const userAns = answers[task.id];
          const hasHint = !!task.hint;
          const isHintOpen = revealedHints[task.id];

          // Check correctness if submitted
          let isCorrect = false;
          if (isSubmitted) {
            if (task.type === 'matching') {
              const pairs = matchedPairs[task.id] || {};
              let ok = true;
              task.pairs?.forEach((p) => {
                if (pairs[p.left] !== p.right) ok = false;
              });
              isCorrect = ok && Object.keys(pairs).length > 0;
            } else if (task.type === 'fill-blank') {
              isCorrect = String(userAns || '').trim().toLowerCase() === String(task.correctAnswer).trim().toLowerCase();
            } else {
              isCorrect = String(userAns) === String(task.correctAnswer);
            }
          }

          return (
            <div
              key={task.id}
              className={`border-2 rounded-3xl p-6 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-rose-50/70 border-rose-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-pink-100 text-pink-800 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      task.level === 1
                        ? 'bg-blue-100 text-blue-800'
                        : task.level === 2
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {task.level === 1 ? 'Mức 1: Nền tảng' : task.level === 2 ? 'Mức 2: Vận dụng' : 'Mức 3: Nâng cao'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* TTS Voice Read */}
                  <button
                    onClick={() => audioService.speak(task.prompt)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="Nghe câu hỏi"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Hint Toggle */}
                  {hasHint && (
                    <button
                      onClick={() => toggleHint(task.id)}
                      className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isHintOpen ? 'Ẩn gợi ý' : 'Gợi ý'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Question Text */}
              <p className="text-slate-800 text-base md:text-lg font-bold mb-4 font-['Quicksand']">
                {task.prompt}
              </p>

              {/* Hint Box */}
              {isHintOpen && task.hint && (
                <div className="mb-4 bg-amber-50 border border-amber-300 p-3 rounded-xl text-amber-900 text-xs md:text-sm font-semibold flex items-start gap-2">
                  <span>💡</span>
                  <span>{task.hint}</span>
                </div>
              )}

              {/* Render by Question Type */}
              {/* Type 1 & Type True/False: Options */}
              {(task.type === 'multiple-choice' || task.type === 'true-false') && task.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {task.options.map((opt, oIdx) => {
                    const isChecked = String(userAns) === String(opt);
                    let optStyle = 'bg-white border-2 border-slate-200 text-slate-700 hover:border-pink-300';

                    if (isChecked) {
                      optStyle = 'bg-pink-600 border-2 border-pink-700 text-white font-extrabold shadow-sm';
                    }

                    if (isSubmitted) {
                      if (String(opt) === String(task.correctAnswer)) {
                        optStyle = 'bg-emerald-600 border-2 border-emerald-700 text-white font-extrabold';
                      } else if (isChecked && !isCorrect) {
                        optStyle = 'bg-rose-500 border-2 border-rose-600 text-white font-extrabold';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(task.id, opt)}
                        className={`p-3.5 rounded-2xl text-left font-bold text-sm md:text-base transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isChecked && <span>●</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Type 2: Fill Blank */}
              {task.type === 'fill-blank' && (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={userAns || ''}
                    onChange={(e) => handleSelectOption(task.id, e.target.value)}
                    placeholder="Nhập câu trả lời của em vào đây..."
                    className="max-w-md bg-white border-2 border-pink-200 focus:border-pink-500 rounded-2xl px-4 py-2.5 text-sm md:text-base font-semibold outline-none w-full"
                  />
                  {isSubmitted && (
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-white border">
                      Đáp án đúng: <b className="text-emerald-700">{String(task.correctAnswer)}</b>
                    </span>
                  )}
                </div>
              )}

              {/* Type 3: Matching Pairs */}
              {task.type === 'matching' && task.pairs && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 font-semibold">
                    Bấm chọn 1 thẻ ở Cột A rồi bấm chọn 1 thẻ tương ứng ở Cột B để nối cặp:
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700">CỘT A</div>
                      {task.pairs.map((p, pIdx) => {
                        const isMatched = !!matchedPairs[task.id]?.[p.left];
                        const isCurrentSelected = matchingSelections[task.id]?.left === p.left;
                        return (
                          <div
                            key={pIdx}
                            onClick={() => !isMatched && handleMatchingClick(task.id, 'left', p.left)}
                            className={`p-3 rounded-xl border-2 text-sm font-bold text-center transition-all cursor-pointer ${
                              isMatched
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-90'
                                : isCurrentSelected
                                ? 'bg-pink-500 border-pink-600 text-white'
                                : 'bg-white border-slate-200 hover:border-pink-300 text-slate-800'
                            }`}
                          >
                            {p.left} {isMatched && '✓'}
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700">CỘT B</div>
                      {task.pairs.map((p, pIdx) => {
                        const isMatched = Object.values(matchedPairs[task.id] || {}).includes(p.right);
                        const isCurrentSelected = matchingSelections[task.id]?.right === p.right;
                        return (
                          <div
                            key={pIdx}
                            onClick={() => !isMatched && handleMatchingClick(task.id, 'right', p.right)}
                            className={`p-3 rounded-xl border-2 text-sm font-bold text-center transition-all cursor-pointer ${
                              isMatched
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-90'
                                : isCurrentSelected
                                ? 'bg-pink-500 border-pink-600 text-white'
                                : 'bg-white border-slate-200 hover:border-pink-300 text-slate-800'
                            }`}
                          >
                            {p.right} {isMatched && '✓'}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {matchedPairs[task.id] && Object.keys(matchedPairs[task.id]).length > 0 && (
                    <div className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl">
                      Đã ghép: {Object.entries(matchedPairs[task.id]).map(([k, v]) => `[${k} = ${v}]`).join(' • ')}
                    </div>
                  )}
                </div>
              )}

              {/* Explanation after submission */}
              {isSubmitted && (
                <div className="mt-4 pt-4 border-t border-slate-200/60 text-xs md:text-sm font-semibold leading-relaxed">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={isCorrect ? 'text-emerald-700 font-black' : 'text-rose-700 font-black'}>
                      {isCorrect ? '🎉 Hoan hô! Em làm rất chuẩn!' : '💡 Em cần chú ý:'}
                    </span>
                  </div>
                  <p className="text-slate-700">{task.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Results Banner if Submitted */}
        {isSubmitted && (
          <div className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 p-6 rounded-3xl border-2 border-amber-500 text-amber-950 shadow-lg text-center space-y-3 animate-fadeIn">
            <div className="text-3xl">🏅</div>
            <h3 className="text-xl md:text-2xl font-black">
              Kết quả Nhiệm vụ: {score} / {maxScore} điểm ({percentage}%)
            </h3>
            <p className="text-xs md:text-sm font-bold text-amber-900 max-w-lg mx-auto">
              {percentage >= 80
                ? 'Xuất sắc! Năng lực vận dụng của em rất đáng khen ngợi! Đã sẵn sàng bước vào Trạm 4 Sáng tạo!'
                : percentage >= 50
                ? 'Em đã hoàn thành rất tốt! Hãy xem lại phần giải thích cho những câu chưa đúng để nhớ lâu hơn nhé!'
                : 'Đừng lo lắng nhé! Hãy thử làm lại hoặc nhờ Robot Tri Thức ở Trạm 2 gợi ý thêm để hiểu sâu hơn!'}
            </p>

            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 bg-white text-amber-950 hover:bg-amber-50 font-black px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại bộ câu hỏi này</span>
            </button>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            onClick={onPrevStation}
            className="text-slate-600 hover:text-slate-900 font-bold text-xs md:text-sm px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
          >
            ← Quay lại Trạm 2
          </button>

          <div className="flex items-center gap-3">
            {!isSubmitted ? (
              <button
                onClick={handleSubmitAll}
                className="bg-pink-600 hover:bg-pink-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer"
              >
                Nộp bài & Chấm điểm tự động ✨
              </button>
            ) : (
              <button
                onClick={onNextStation}
                className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-6 py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer"
              >
                Sang Trạm 4 - Trạm Sáng Tạo ➔
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
