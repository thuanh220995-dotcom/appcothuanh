import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, MessageCircle } from 'lucide-react';
import { audioService } from '../utils/audio';

interface RobotMascotProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  onTap?: () => void;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  message = 'Xin chào các bạn nhỏ lớp 3D! Mình là AI Cùng Em. Hôm nay chúng mình sẽ cùng khám phá những điều thú vị nhé!',
  size = 'md',
  showSpeechBubble = true,
  onTap,
}) => {
  const [isWaving, setIsWaving] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleMascotClick = () => {
    setIsWaving(true);
    audioService.playSound('pop');
    setTimeout(() => setIsWaving(false), 1200);
    if (onTap) onTap();
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      audioService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioService.speak(
        message,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const dimensions = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32 md:w-36 md:h-36',
    lg: 'w-44 h-44 md:w-52 md:h-52',
  }[size];

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 relative select-none">
      {/* 3D-styled Cute Robot SVG */}
      <div
        onClick={handleMascotClick}
        className={`relative ${dimensions} cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95`}
        title="Bấm vào chú Robot để chào nhé!"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xl animate-float"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft Shadow below */}
          <ellipse cx="100" cy="188" rx="55" ry="10" fill="#0284c7" fillOpacity="0.18" />

          {/* Antenna */}
          <line x1="100" y1="52" x2="100" y2="28" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="24" r="12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="3" className="animate-pulse" />
          <circle cx="103" cy="21" r="4" fill="#ffffff" />

          {/* Head Body (Rounded friendly cube/sphere) */}
          <rect
            x="45"
            y="48"
            width="110"
            height="86"
            rx="32"
            fill="url(#robot_gradient_head)"
            stroke="#0284c7"
            strokeWidth="4"
          />

          {/* Head Highlight */}
          <path
            d="M58 58 Q100 48 142 58"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Ears / Headset */}
          <rect x="34" y="72" width="14" height="38" rx="7" fill="#0ea5e9" stroke="#0369a1" strokeWidth="3" />
          <circle cx="41" cy="91" r="3" fill="#ffffff" />
          <rect x="152" y="72" width="14" height="38" rx="7" fill="#0ea5e9" stroke="#0369a1" strokeWidth="3" />
          <circle cx="159" cy="91" r="3" fill="#ffffff" />

          {/* Screen Visor (Dark glossy cyan) */}
          <rect x="62" y="66" width="76" height="48" rx="18" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

          {/* Eyes (Glowing bright cyan with cute heart/wink highlight) */}
          <ellipse cx="82" cy="88" rx="10" ry="13" fill="#38bdf8" />
          <circle cx="85" cy="84" r="4" fill="#ffffff" />
          <circle cx="80" cy="93" r="2" fill="#ffffff" />

          {isWaving ? (
            /* Winking eye when clicked */
            <path d="M110 88 Q118 80 126 88" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
          ) : (
            <>
              <ellipse cx="118" cy="88" rx="10" ry="13" fill="#38bdf8" />
              <circle cx="121" cy="84" r="4" fill="#ffffff" />
              <circle cx="116" cy="93" r="2" fill="#ffffff" />
            </>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="70" cy="99" rx="6" ry="3" fill="#f43f5e" opacity="0.4" />
          <ellipse cx="130" cy="99" rx="6" ry="3" fill="#f43f5e" opacity="0.4" />

          {/* Smiling Mouth */}
          <path d="M93 98 Q100 106 107 98" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

          {/* Neck */}
          <rect x="88" y="132" width="24" height="10" rx="4" fill="#94a3b8" />

          {/* Body */}
          <path
            d="M62 140 H138 Q144 175 100 178 Q56 175 62 140 Z"
            fill="url(#robot_gradient_body)"
            stroke="#0284c7"
            strokeWidth="4"
          />

          {/* Chest Heart/Gemini Core */}
          <circle cx="100" cy="158" r="11" fill="#ec4899" stroke="#db2777" strokeWidth="2.5" />
          <path
            d="M96 157 C96 154 99 152 100 154 C101 152 104 154 104 157 C104 160 100 163 100 163 C100 163 96 160 96 157 Z"
            fill="#ffffff"
          />

          {/* Left Arm */}
          <path
            d="M58 146 Q40 156 46 172"
            stroke="#0284c7"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="46" cy="172" r="7" fill="#38bdf8" />

          {/* Right Arm (Waving animation) */}
          <g className={isWaving ? 'animate-bounce origin-bottom' : ''}>
            <path
              d="M142 146 Q162 140 168 126"
              stroke="#0284c7"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="168" cy="126" r="7" fill="#38bdf8" />
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="robot_gradient_head" x1="45" y1="48" x2="155" y2="134" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#f0f9ff" />
              <stop offset="1" stopColor="#bae6fd" />
            </linearGradient>
            <linearGradient id="robot_gradient_body" x1="62" y1="140" x2="138" y2="178" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#bae6fd" />
            </linearGradient>
          </defs>
        </svg>

        {/* Small floating sparkles badge */}
        <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 p-1 rounded-full shadow-md animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="relative bg-white/95 backdrop-blur-sm border-2 border-sky-300 rounded-3xl p-4 md:p-5 max-w-md shadow-lg shadow-sky-100/60 transition-all">
          {/* Triangular Tail pointing to Robot */}
          <div className="hidden md:block absolute -left-3 top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-sky-300" />
          <div className="hidden md:block absolute -left-2 top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              <MessageCircle className="w-3.5 h-3.5 text-sky-500" />
              <span>Robot Tri Thức • Lớp 3D</span>
            </div>

            {/* TTS Listen Button */}
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-sky-100 hover:bg-sky-200 text-sky-800'
              }`}
              title={isSpeaking ? 'Dừng đọc' : 'Nghe giọng đọc tiếng Việt'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Dừng</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Nghe</span>
                </>
              )}
            </button>
          </div>

          <p className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed mt-1">
            {message}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2">
            <span className="text-sky-600 font-medium">Bấm vào tớ để nghe lời chào vui nhé!</span>
            <span className="text-amber-500 font-bold">✨ Cô giáo Thu Anh</span>
          </div>
        </div>
      )}
    </div>
  );
};
