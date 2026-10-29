import React, { useRef, useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Download,
  Trash2,
  Undo2,
  Volume2,
  BookOpen,
  Send,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lesson, LessonStation4Data } from '../types';
import { audioService } from '../utils/audio';
import { callGeminiChat } from '../utils/geminiClient';

interface Station4CreationProps {
  lesson: Lesson;
  onCompleteStation: (drawingDataUrl?: string) => void;
  onPrevStation: () => void;
  onNextStation: () => void;
}

export const Station4Creation: React.FC<Station4CreationProps> = ({
  lesson,
  onCompleteStation,
  onPrevStation,
  onNextStation,
}) => {
  const data: LessonStation4Data = lesson.station4;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeTab, setActiveTab] = useState<'drawing' | 'story' | 'ideas'>('drawing');
  const [brushColor, setBrushColor] = useState<string>('#0284c7');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Creative Story state
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [storyContent, setStoryContent] = useState<string>('');
  const [storySaved, setStorySaved] = useState<boolean>(false);

  // AI Creative Idea helper
  const [aiIdea, setAiIdea] = useState<string | null>(null);
  const [isLoadingIdea, setIsLoadingIdea] = useState<boolean>(false);

  const colors = [
    '#0284c7', // Sky Blue
    '#10b981', // Emerald Green
    '#f59e0b', // Amber/Yellow
    '#ef4444', // Red
    '#ec4899', // Pink
    '#8b5cf6', // Purple
    '#334155', // Slate
    '#78350f', // Brown
  ];

  // Canvas drawing handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background initially
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    audioService.playSound('pop');
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `San_pham_sang_tao_Lop3D_${lesson.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    audioService.playSound('celebrate');
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleRequestAIIdea = async () => {
    setIsLoadingIdea(true);
    audioService.playSound('pop');

    const prompt = `Bạn là cố vấn sáng tạo cho học sinh lớp 3 (Trường Tiểu học Khoái Châu 1). Bài học là: "${lesson.title}". Hãy đưa ra 2 ý tưởng sáng tạo cực kỳ thú vị và dễ làm cho các em (vẽ tranh, viết truyện hoặc làm mô hình thủ công giấy đơn giản), tạo cảm hứng và khích lệ trí tưởng tượng phong phú!`;

    const { reply } = await callGeminiChat([{ role: 'user', content: prompt }], lesson.subject, 'họa sĩ nhí');
    setAiIdea(reply);
    setIsLoadingIdea(false);
    audioService.speak(reply);
  };

  const handleSaveProduct = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas ? canvas.toDataURL('image/png') : undefined;
    audioService.playSound('celebrate');
    confetti({ particleCount: 70, spread: 70 });
    onCompleteStation(dataUrl);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-xl overflow-hidden transition-all">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white p-6 relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-300 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Trạm 4 • Sáng Tạo & Thuyết Trình
                </span>
                <span className="text-amber-100 text-xs font-semibold">• Tự do thể hiện</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                {data.challengeTitle}
              </h2>
              <p className="text-amber-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Phát huy trí tưởng tượng, vẽ tranh minh họa, viết truyện ngắn và thiết kế sản phẩm tri thức của riêng em.
              </p>
            </div>
          </div>

          {/* AI Idea Prompt Button */}
          <button
            onClick={handleRequestAIIdea}
            disabled={isLoadingIdea}
            className="flex items-center gap-2 bg-white text-amber-900 hover:bg-amber-50 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            title="Nhờ AI gợi ý ý tưởng sáng tạo bất ngờ"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>{isLoadingIdea ? 'AI đang suy nghĩ...' : 'Gợi ý ý tưởng mới cùng AI'}</span>
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 mt-5">
          <button
            onClick={() => setActiveTab('drawing')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'drawing' ? 'bg-white text-amber-950 shadow-md' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            🖌️ 1. Bảng vẽ trực tuyến
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'story' ? 'bg-white text-amber-950 shadow-md' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            ✍️ 2. Viết câu chuyện ngắn
          </button>
          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all cursor-pointer ${
              activeTab === 'ideas' ? 'bg-white text-amber-950 shadow-md' : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            💡 3. Ý tưởng gợi ý
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Challenge prompt box */}
        <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider">Thử thách sáng tạo hôm nay:</span>
            <p className="text-slate-800 font-bold text-sm md:text-base">{data.prompt}</p>
          </div>
          <button
            onClick={() => audioService.speak(data.prompt)}
            className="p-2 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl cursor-pointer"
            title="Nghe lời gợi ý"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* AI idea box if generated */}
        {aiIdea && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-2xl p-5 shadow-sm space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-orange-900 font-black text-sm">
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin" />
              <span>Gợi ý độc đáo từ AI Cùng Em:</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed font-semibold whitespace-pre-line">
              {aiIdea}
            </p>
          </div>
        )}

        {/* Tab 1: HTML5 Canvas Drawing Board */}
        {activeTab === 'drawing' && (
          <div className="space-y-4">
            {/* Drawing Controls Bar */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              {/* Color Palette */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 mr-1">Màu:</span>
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setBrushColor(c);
                      setIsEraser(false);
                      audioService.playSound('pop');
                    }}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                      brushColor === c && !isEraser ? 'scale-125 ring-2 ring-slate-800 ring-offset-1' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>

              {/* Brush Size & Eraser */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Nét:</span>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">{brushSize}px</span>
                </div>

                <button
                  onClick={() => {
                    setIsEraser(!isEraser);
                    audioService.playSound('pop');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isEraser ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isEraser ? 'Đang dùng Tẩy 🧹' : 'Dùng Tẩy'}
                </button>

                <button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa bảng</span>
                </button>

                <button
                  onClick={downloadDrawing}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer shadow-sm"
                  title="Tải tranh về máy tính (PNG)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh PNG</span>
                </button>
              </div>
            </div>

            {/* Canvas Element */}
            <div className="border-4 border-dashed border-amber-300 rounded-3xl overflow-hidden bg-white shadow-inner flex justify-center">
              <canvas
                ref={canvasRef}
                width={760}
                height={400}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full max-w-full h-[320px] md:h-[400px] cursor-crosshair touch-none"
              />
            </div>
            <p className="text-xs text-slate-500 italic text-center">
              Em có thể dùng chuột hoặc chạm tay trên màn hình cảm ứng để vẽ tranh. Bấm "Tải ảnh PNG" để lưu vào máy nhé!
            </p>
          </div>
        )}

        {/* Tab 2: Story Writing */}
        {activeTab === 'story' && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Tiêu đề bài viết / câu chuyện:</label>
              <input
                type="text"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Ví dụ: Chuyến phiêu lưu của Giọt Sương nhỏ..."
                className="w-full bg-white border-2 border-amber-300 focus:border-amber-500 rounded-2xl px-4 py-2.5 text-sm md:text-base font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Nội dung sáng tạo của em:</label>
              <textarea
                rows={6}
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="Hãy viết lại cảm nhận, câu thơ hoặc câu chuyện nhỏ mà em tưởng tượng ra sau bài học..."
                className="w-full bg-white border-2 border-amber-300 focus:border-amber-500 rounded-2xl p-4 text-sm md:text-base font-semibold outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {storyContent.length} ký tự • Đã lưu trong bài học Lớp 3D
              </span>

              <button
                onClick={() => {
                  setStorySaved(true);
                  audioService.playSound('celebrate');
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{storySaved ? 'Đã lưu bài viết ✨' : 'Lưu bài sáng tạo'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Suggested Ideas */}
        {activeTab === 'ideas' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.suggestedIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 space-y-2 hover:border-amber-400 transition-all shadow-sm"
              >
                <span className="text-2xl">💡</span>
                <h4 className="font-extrabold text-amber-900 text-sm">Ý tưởng #{idx + 1}</h4>
                <p className="text-slate-700 text-xs md:text-sm font-semibold leading-relaxed">
                  {idea}
                </p>
                <button
                  onClick={() => audioService.speak(idea)}
                  className="mt-2 text-[11px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe ý tưởng</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Station Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <button
            onClick={onPrevStation}
            className="text-slate-600 hover:text-slate-900 font-bold text-xs md:text-sm px-4 py-2 rounded-xl border border-slate-200 cursor-pointer"
          >
            ← Quay lại Trạm 3
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveProduct}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
            >
              Lưu sản phẩm sáng tạo Trạm 4 ⭐
            </button>
            <button
              onClick={onNextStation}
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-sm shadow-md transition-all cursor-pointer"
            >
              Tiến vào Trạm 5 - Trạm Phản Hồi ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
