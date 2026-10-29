import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Volume2,
  Trash2,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Smile,
  BookOpen,
} from 'lucide-react';
import { audioService } from '../utils/audio';
import { callGeminiChat } from '../utils/geminiClient';
import { RobotMascot } from './RobotMascot';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export const RobotTutorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Xin chào bạn nhỏ Lớp 3D! 🤖 Mình là Robot Tri Thức - người bạn đồng hành của cô giáo Thu Anh. Hôm nay bạn muốn hỏi bài Toán, đọc hiểu Tiếng Việt, hay cùng mình khám phá điều gì mới nào? ✨',
      timestamp: 'Vừa xong',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'ask' | 'practice' | 'review' | 'discover' | 'english'>('ask');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    audioService.playSound('pop');

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    // Call server Gemini API proxy
    const { reply } = await callGeminiChat(
      newHistory.map((m) => ({ role: m.role, content: m.content })),
      mode === 'english' ? 'Tiếng Anh' : 'Toán & Tiếng Việt',
      'bạn nhỏ Lớp 3D'
    );

    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
    audioService.playSound('correct');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `m-init-${Date.now()}`,
        role: 'assistant',
        content: 'Lịch sử trò chuyện đã được làm mới an toàn! Chúng mình cùng bắt đầu câu hỏi mới nhé! 🤖',
        timestamp: 'Vừa xong',
      },
    ]);
    audioService.playSound('pop');
  };

  const quickPrompts = [
    '🤖 Giải thích giúp em phép tính 7 x 8 = 56 bằng que tính nhé!',
    '📖 Đố bạn biết câu này có hình ảnh so sánh gì?',
    '🌱 Vì sao lá cây lại có màu xanh lục?',
    '⭐ Cho em 1 câu đố vui toán học lớp 3!',
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-cyan-200 shadow-xl overflow-hidden transition-all flex flex-col h-[740px]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-300 text-cyan-950 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase">
                Gia sư AI Thân Thiện • Lớp 3D
              </span>
              <span className="text-cyan-200 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> An toàn trẻ em
              </span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight mt-0.5">
              Robot Tri Thức – Bạn Đồng Hành Của Em
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            title="Xóa lịch sử trò chuyện để bảo mật"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa trò chuyện</span>
          </button>
        </div>
      </div>

      {/* 5 Mode Selector Pills */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Chế độ:</span>
        {[
          { id: 'ask', label: '❓ Hỏi bài' },
          { id: 'practice', label: '🎯 Luyện tập' },
          { id: 'review', label: '📚 Ôn bài' },
          { id: 'discover', label: '🌿 Khám phá' },
          { id: 'english', label: '🇬🇧 Tiếng Anh' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setMode(item.id as any);
              audioService.playSound('pop');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              mode === item.id
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-cyan-50/20 via-white to-slate-50">
        {messages.map((m) => {
          const isBot = m.role === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-9 h-9 rounded-2xl bg-cyan-100 border border-cyan-300 flex items-center justify-center text-lg flex-shrink-0 shadow-sm">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-4 shadow-sm space-y-2 ${
                  isBot
                    ? 'bg-white border-2 border-cyan-200 text-slate-800'
                    : 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white font-semibold'
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed whitespace-pre-line font-['Nunito']">
                  {m.content}
                </p>

                <div
                  className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                    isBot ? 'border-slate-100 text-slate-400' : 'border-white/20 text-cyan-100'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {isBot && (
                    <button
                      onClick={() => audioService.speak(m.content)}
                      className="flex items-center gap-1 text-cyan-700 hover:text-cyan-900 font-bold cursor-pointer"
                      title="Nghe Robot đọc tiếng Việt"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe đọc</span>
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-9 h-9 rounded-2xl bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                  HS
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-2 rounded-2xl w-fit animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-500 animate-spin" />
            <span>Robot Tri Thức đang suy nghĩ gợi ý từng bước cho bạn...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">Gợi ý câu hỏi:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] font-semibold bg-white border border-slate-200 hover:border-cyan-400 text-slate-700 px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi Robot Tri Thức về bài học, từ ngữ, hoặc câu đố..."
            className="flex-1 bg-slate-50 border-2 border-slate-200 focus:border-cyan-500 rounded-2xl px-4 py-3 text-sm font-semibold outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold px-5 py-3 rounded-2xl text-sm shadow-md transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          💡 Robot gợi ý từng bước để các bạn tự suy nghĩ, không làm hộ bài tập. Không chia sẻ mật khẩu hay địa chỉ nhà nhé!
        </p>
      </div>
    </div>
  );
};
