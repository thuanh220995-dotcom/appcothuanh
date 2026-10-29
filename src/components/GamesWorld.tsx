import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  Volume2,
  RotateCcw,
  Award,
  Play,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../utils/audio';

export const GamesWorld: React.FC = () => {
  const [activeGameId, setActiveGameId] = useState<string>('g1');

  // Game 1: Ai là nhà thông thái
  const [g1Index, setG1Index] = useState<number>(0);
  const [g1Selected, setG1Selected] = useState<number | null>(null);
  const [g1Score, setG1Score] = useState<number>(0);

  const g1Questions = [
    {
      q: 'Một con nhện có 8 cái chân. Hỏi 7 con nhện có tất cả bao nhiêu cái chân?',
      options: ['48 cái chân', '54 cái chân', '56 cái chân', '64 cái chân'],
      answer: 2,
      explanation: '7 con nhện có: 8 x 7 = 56 cái chân.',
    },
    {
      q: 'Trong câu "Mặt trời đỏ ối như quả cầu lửa", từ nào được dùng để so sánh?',
      options: ['đỏ ối', 'như', 'quả cầu', 'Mặt trời'],
      answer: 1,
      explanation: 'Từ "như" là từ chỉ sự so sánh giữa mặt trời và quả cầu lửa.',
    },
    {
      q: 'Bộ phận nào của cây làm nhiệm vụ quang hợp và thoát hơi nước?',
      options: ['Rễ', 'Thân', 'Lá', 'Hoa'],
      answer: 2,
      explanation: 'Lá cây hấp thu ánh nắng để quang hợp và thoát hơi nước.',
    },
  ];

  // Game 2: Vòng quay kiến thức
  const [spinning, setSpinning] = useState<boolean>(false);
  const [wheelDegree, setWheelDegree] = useState<number>(0);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const wheelItems = ['7 x 9 = ?', 'Đố vui Tiếng Việt', '7 x 4 = ?', 'Thực vật quanh em', '7 x 8 = ?', 'Quà tặng may mắn ⭐'];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    audioService.playSound('pop');
    const randomTurns = 5 + Math.floor(Math.random() * 5);
    const randomSector = Math.floor(Math.random() * wheelItems.length);
    const newDeg = wheelDegree + randomTurns * 360 + randomSector * (360 / wheelItems.length);
    setWheelDegree(newDeg);

    setTimeout(() => {
      setSpinning(false);
      const chosen = wheelItems[randomSector];
      setWheelResult(chosen);
      audioService.playSound('celebrate');
      confetti({ particleCount: 60, spread: 70 });
    }, 2500);
  };

  // Game 7: Bé làm toán nhanh (Speed Math)
  const [mathTimer, setMathTimer] = useState<number>(30);
  const [mathA, setMathA] = useState<number>(7);
  const [mathB, setMathB] = useState<number>(6);
  const [mathInput, setMathInput] = useState<string>('');
  const [mathScore, setMathScore] = useState<number>(0);
  const [mathPlaying, setMathPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (mathPlaying && mathTimer > 0) {
      interval = setInterval(() => setMathTimer((t) => t - 1), 1000);
    } else if (mathTimer === 0 && mathPlaying) {
      setMathPlaying(false);
      audioService.playSound('celebrate');
      confetti({ particleCount: 70, spread: 80 });
    }
    return () => clearInterval(interval);
  }, [mathPlaying, mathTimer]);

  const handleStartMathGame = () => {
    setMathTimer(30);
    setMathScore(0);
    setMathPlaying(true);
    generateNextMath();
    audioService.playSound('pop');
  };

  const generateNextMath = () => {
    setMathA(7);
    setMathB(Math.floor(Math.random() * 9) + 2);
    setMathInput('');
  };

  const checkMathAnswer = () => {
    if (!mathPlaying) return;
    if (Number(mathInput) === mathA * mathB) {
      audioService.playSound('correct');
      setMathScore((s) => s + 10);
      generateNextMath();
    } else {
      audioService.playSound('wrong');
    }
  };

  // Game 10: Chăm sóc cây tri thức (Tree Care)
  const [treeStage, setTreeStage] = useState<number>(1); // 1: hạt mầm, 2: cây con, 3: cây xum xuê, 4: trổ hoa trĩu quả
  const [treeQIndex, setTreeQIndex] = useState<number>(0);

  const treeQuestions = [
    { q: 'Để cây lớn nhanh, ta cần tưới nước và cho cây tắm gì?', a: 'Ánh nắng mặt trời' },
    { q: '7 x 3 = 21, vậy 7 x 4 = ?', a: '28' },
    { q: 'Cây gì xòe tán rợp bóng sân trường em?', a: 'Cây bàng' },
  ];

  const handleWaterTree = (userAns: string) => {
    const isCorrect = userAns.toLowerCase().includes(treeQuestions[treeQIndex].a.toLowerCase());
    if (isCorrect || userAns.length > 2) {
      audioService.playSound('correct');
      const nextStage = Math.min(treeStage + 1, 4);
      setTreeStage(nextStage);
      setTreeQIndex((prev) => (prev + 1) % treeQuestions.length);
      if (nextStage === 4) {
        audioService.playSound('celebrate');
        confetti({ particleCount: 80, spread: 80 });
      }
    } else {
      audioService.playSound('wrong');
    }
  };

  const gamesList = [
    { id: 'g1', title: 'Ai là nhà thông thái?', icon: '🧠', tag: 'Trắc nghiệm' },
    { id: 'g2', title: 'Vòng quay kiến thức', icon: '🎡', tag: 'May mắn' },
    { id: 'g7', title: 'Bé làm toán nhanh', icon: '⚡', tag: 'Bấm giờ' },
    { id: 'g10', title: 'Bảo vệ khu vườn tri thức', icon: '🌱', tag: 'Chăm sóc' },
    { id: 'g3', title: 'Lật ô bí mật', icon: '🎁', tag: 'Ghi nhớ' },
    { id: 'g4', title: 'Ghép đôi thông minh', icon: '🧩', tag: 'Nối thẻ' },
    { id: 'g5', title: 'Đường đua tri thức', icon: '🏁', tag: 'Vượt chặng' },
    { id: 'g6', title: 'Sắp xếp siêu tốc', icon: '🔢', tag: 'Thứ tự' },
    { id: 'g8', title: 'Đọc hiểu cùng AI', icon: '📖', tag: 'Ngữ liệu' },
    { id: 'g9', title: 'Ô cửa tiếng Anh', icon: '🇬🇧', tag: 'Từ vựng' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🎮
            </div>
            <div>
              <span className="bg-pink-300 text-pink-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                10 Trò Chơi Trí Tuệ • Lớp 3D
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Thế Giới Trò Chơi Học Tập Tương Tác
              </h2>
              <p className="text-pink-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Học vui mà nhớ lâu, luyện phản xạ tư duy, không gây áp lực điểm số và cổ vũ tinh thần nỗ lực của từng em.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 10 Games Horizontal Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {gamesList.map((g) => {
          const isActive = activeGameId === g.id;
          return (
            <button
              key={g.id}
              onClick={() => {
                setActiveGameId(g.id);
                audioService.playSound('pop');
              }}
              className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                isActive
                  ? 'bg-pink-50 border-pink-500 shadow-md scale-[1.02] ring-1 ring-pink-400'
                  : 'bg-white border-slate-200 hover:border-pink-300'
              }`}
            >
              <span className="text-2xl">{g.icon}</span>
              <div className="overflow-hidden">
                <h4 className="font-extrabold text-xs text-slate-800 truncate">{g.title}</h4>
                <span className="text-[10px] font-bold text-pink-600 uppercase">{g.tag}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Window */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-pink-200 shadow-xl">
        {/* Game 1: Ai là nhà thông thái */}
        {activeGameId === 'g1' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧠</span>
                <h3 className="font-black text-slate-800 text-lg">Ai Là Nhà Thông Thái?</h3>
              </div>
              <span className="text-xs font-bold bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
                Điểm số: {g1Score} • Câu {g1Index + 1} / {g1Questions.length}
              </span>
            </div>

            <div className="bg-pink-50/70 p-6 rounded-2xl border border-pink-200">
              <p className="text-base md:text-lg font-extrabold text-slate-800">
                {g1Questions[g1Index].q}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {g1Questions[g1Index].options.map((opt, idx) => {
                const isSelected = g1Selected === idx;
                const isCorrect = idx === g1Questions[g1Index].answer;
                let style = 'bg-slate-50 border-2 border-slate-200 text-slate-800 hover:border-pink-400';

                if (g1Selected !== null) {
                  if (isCorrect) style = 'bg-emerald-500 border-emerald-600 text-white font-extrabold';
                  else if (isSelected) style = 'bg-rose-500 border-rose-600 text-white font-extrabold';
                }

                return (
                  <button
                    key={idx}
                    disabled={g1Selected !== null}
                    onClick={() => {
                      setG1Selected(idx);
                      if (isCorrect) {
                        setG1Score((s) => s + 10);
                        audioService.playSound('correct');
                      } else {
                        audioService.playSound('wrong');
                      }
                    }}
                    className={`p-4 rounded-2xl font-bold text-sm md:text-base text-left transition-all cursor-pointer ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {g1Selected !== null && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs md:text-sm font-semibold text-emerald-900 flex items-center justify-between">
                <span>💡 {g1Questions[g1Index].explanation}</span>
                <button
                  onClick={() => {
                    setG1Index((prev) => (prev + 1) % g1Questions.length);
                    setG1Selected(null);
                    audioService.playSound('pop');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Câu tiếp theo ➔
                </button>
              </div>
            )}
          </div>
        )}

        {/* Game 2: Vòng quay kiến thức */}
        {activeGameId === 'g2' && (
          <div className="space-y-6 text-center">
            <h3 className="font-black text-slate-800 text-lg">Vòng Quay Kiến Thức May Mắn</h3>
            <p className="text-xs text-slate-500 font-semibold">
              Bấm nút "Quay thưởng" để nhận thử thách bất ngờ cho các bạn nhỏ lớp 3D!
            </p>

            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              {/* Pointer */}
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600 drop-shadow-md" />

              {/* Wheel circle */}
              <div
                style={{
                  transform: `rotate(${wheelDegree}deg)`,
                  transition: spinning ? 'transform 2.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                }}
                className="w-full h-full rounded-full border-8 border-amber-400 bg-gradient-to-tr from-sky-400 via-pink-400 to-amber-300 shadow-2xl flex items-center justify-center p-3 select-none"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-center p-4 shadow-inner">
                  <span className="text-xs font-black text-slate-700">
                    🎡 VÒNG QUAY<br />TRI THỨC 3D
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={spinWheel}
              disabled={spinning}
              className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black px-8 py-3 rounded-2xl text-base shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {spinning ? 'Đang quay vèo vèo...' : 'QUAY NGAY 🎯'}
            </button>

            {wheelResult && (
              <div className="p-4 bg-amber-100 border-2 border-amber-300 rounded-2xl max-w-md mx-auto text-amber-950 font-black text-base animate-bounceOnce">
                🎁 Kết quả quay trúng: "{wheelResult}"!
              </div>
            )}
          </div>
        )}

        {/* Game 7: Bé làm toán nhanh */}
        {activeGameId === 'g7' && (
          <div className="space-y-6 text-center max-w-lg mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-800 text-lg">Bé Làm Toán Nhanh</h3>
              <div className="flex items-center gap-3 text-xs font-black">
                <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                  ⏱️ {mathTimer}s
                </span>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  ⭐ {mathScore} điểm
                </span>
              </div>
            </div>

            {!mathPlaying && mathTimer === 30 ? (
              <div className="py-8 space-y-4">
                <div className="text-5xl">⚡</div>
                <h4 className="font-black text-slate-800 text-xl">Thử thách 30 giây tính nhẩm</h4>
                <p className="text-xs text-slate-500">
                  Trả lời thật nhanh các phép tính trong bảng nhân 7 để tích lũy điểm cao nhé!
                </p>
                <button
                  onClick={handleStartMathGame}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3.5 rounded-2xl text-base shadow-md cursor-pointer"
                >
                  Bắt đầu tính nhanh ➔
                </button>
              </div>
            ) : mathPlaying ? (
              <div className="space-y-6">
                <div className="text-5xl font-black text-indigo-700 bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-200">
                  {mathA} x {mathB} = ?
                </div>

                <div className="flex items-center justify-center gap-3">
                  <input
                    type="number"
                    autoFocus
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && checkMathAnswer()}
                    placeholder="Đáp số..."
                    className="w-36 text-center bg-slate-50 border-2 border-indigo-300 focus:border-indigo-600 rounded-2xl py-3 text-2xl font-black outline-none"
                  />
                  <button
                    onClick={checkMathAnswer}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3.5 rounded-2xl text-base cursor-pointer"
                  >
                    Đúng rồi!
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-4 animate-fadeIn">
                <div className="text-5xl">🏆</div>
                <h4 className="font-black text-slate-800 text-2xl">Hết giờ!</h4>
                <p className="text-base font-bold text-emerald-700">
                  Tổng điểm của em: {mathScore} điểm!
                </p>
                <button
                  onClick={handleStartMathGame}
                  className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-black px-6 py-2.5 rounded-xl text-sm cursor-pointer"
                >
                  Chơi lại ván mới
                </button>
              </div>
            )}
          </div>
        )}

        {/* Game 10: Chăm sóc cây tri thức */}
        {activeGameId === 'g10' && (
          <div className="space-y-6 text-center max-w-xl mx-auto">
            <h3 className="font-black text-slate-800 text-lg">Bảo Vệ & Chăm Sóc Cây Tri Thức</h3>

            {/* Tree Stage Graphic */}
            <div className="h-44 flex flex-col items-center justify-center">
              {treeStage === 1 && <div className="text-6xl animate-bounce">🌰</div>}
              {treeStage === 2 && <div className="text-7xl animate-bounce">🌱</div>}
              {treeStage === 3 && <div className="text-8xl animate-bounce">🌿</div>}
              {treeStage === 4 && <div className="text-9xl animate-bounce">🌳🍎</div>}

              <div className="text-xs font-bold text-emerald-800 mt-2">
                {treeStage === 1 && 'Hạt mầm đang ngủ trong đất'}
                {treeStage === 2 && 'Mầm non nhú lên đón ánh sáng'}
                {treeStage === 3 && 'Cây phát triển cành lá xanh tốt'}
                {treeStage === 4 && 'Cây tri thức nở hoa thơm ngát và trĩu quả ngọt!'}
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-left space-y-3">
              <span className="text-xs font-bold text-emerald-800 uppercase">
                Câu hỏi tưới nước cho cây #{treeQIndex + 1}:
              </span>
              <p className="text-sm md:text-base font-bold text-slate-800">
                {treeQuestions[treeQIndex].q}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nhập câu trả lời để tưới nước..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleWaterTree((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  className="flex-1 bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input) {
                      handleWaterTree(input.value);
                      input.value = '';
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Tưới nước 💧
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Games Notice / Selector */}
        {!['g1', 'g2', 'g7', 'g10'].includes(activeGameId) && (
          <div className="text-center py-10 space-y-3">
            <div className="text-4xl">🎮</div>
            <h4 className="font-extrabold text-slate-800 text-lg">
              {gamesList.find((g) => g.id === activeGameId)?.title}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Trò chơi giáo dục đang kết nối bộ câu hỏi theo bài học lớp 3D của cô Thu Anh. Em hãy chọn các trò chơi nổi bật như Ai Là Nhà Thông Thái, Vòng Quay, Bé Làm Toán Nhanh ở trên nhé!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
