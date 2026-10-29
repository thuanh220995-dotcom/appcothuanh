import React, { useState } from 'react';
import {
  X,
  Settings,
  HelpCircle,
  Download,
  Upload,
  Globe,
  ShieldCheck,
  Volume2,
  Terminal,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { audioService } from '../utils/audio';
import { exportBackupJSON } from '../utils/exportUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  fullAppState: any;
  onRestoreState: (state: any) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  fullAppState,
  onRestoreState,
  isDemoMode,
  setIsDemoMode,
}) => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'backup' | 'accessibility'>('vercel');
  const [hasVoice, setHasVoice] = useState<boolean>(audioService.hasVietnameseVoice());

  if (!isOpen) return null;

  const handleBackup = () => {
    exportBackupJSON(fullAppState, `Sao_luu_AI_Cung_Em_Lop3D_${new Date().toISOString().slice(0, 10)}`);
    audioService.playSound('celebrate');
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onRestoreState(json);
        audioService.playSound('celebrate');
        alert('Phục hồi dữ liệu sao lưu thành công!');
      } catch (err) {
        alert('Tệp sao lưu không hợp lệ. Vui lòng kiểm tra lại!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border-2 border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base md:text-lg">
              Cài Đặt & Hướng Dẫn Triển Khai Vercel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`px-4 py-3 text-xs md:text-sm font-extrabold border-b-2 cursor-pointer ${
              activeTab === 'vercel'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🚀 Triển khai Vercel
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-3 text-xs md:text-sm font-extrabold border-b-2 cursor-pointer ${
              activeTab === 'backup'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💾 Sao lưu & Phục hồi
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-4 py-3 text-xs md:text-sm font-extrabold border-b-2 cursor-pointer ${
              activeTab === 'accessibility'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔊 Giọng đọc & Trợ năng
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed flex-1">
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-950 font-semibold space-y-2">
                <div className="font-black text-sm flex items-center gap-1.5 text-indigo-900">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Quy trình triển khai ứng dụng lên Vercel:</span>
                </div>
                <p>
                  Ứng dụng đã được tối ưu hóa toàn diện cho môi trường Vercel (Next.js/React SPA + Express API serverless).
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <b className="text-slate-900">Bước 1: Đẩy mã nguồn lên GitHub</b>
                  <p className="text-slate-600">
                    Khởi tạo kho lưu trữ GitHub và đẩy toàn bộ mã nguồn của dự án lên nhánh <code className="bg-slate-200 px-1 py-0.5 rounded">main</code>.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <b className="text-slate-900">Bước 2: Kết nối tài khoản Vercel</b>
                  <p className="text-slate-600">
                    Truy cập Vercel dashboard, bấm <b>Add New Project</b> và chọn kho lưu trữ GitHub tương ứng.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <b className="text-slate-900">Bước 3: Cấu hình biến môi trường (Environment Variables)</b>
                  <p className="text-slate-600">
                    Thêm biến môi trường: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> với giá trị khóa API của bạn từ Google AI Studio.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <b className="text-slate-900">Bước 4: Build Command</b>
                  <p className="text-slate-600">
                    Build Command: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">npm run build</code>. Thư mục đầu ra (Output Directory): <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">dist</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <p>
                Giáo viên có thể xuất toàn bộ dữ liệu bài học, kết quả học sinh và minh chứng ra tệp JSON để lưu trữ trên máy tính hoặc chuyển sang thiết bị khác mà không sợ mất dữ liệu.
              </p>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-emerald-900 text-sm">Xuất bản sao lưu dữ liệu (.json)</h4>
                  <p className="text-xs text-slate-500">Tải về toàn bộ bài học và kết quả Lớp 3D</p>
                </div>
                <button
                  onClick={handleBackup}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải bản sao lưu</span>
                </button>
              </div>

              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sky-900 text-sm">Nhập dữ liệu từ bản sao lưu</h4>
                  <p className="text-xs text-slate-500">Phục hồi lại dữ liệu đã lưu trước đó</p>
                </div>
                <label className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn tệp JSON</span>
                  <input type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <b className="text-purple-950 font-extrabold">Trạng thái giọng đọc tiếng Việt (vi-VN):</b>
                  {hasVoice ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ✓ Đã nhận diện giọng đọc Tiếng Việt
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      Tự động gán mã ngôn ngữ vi-VN
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Ứng dụng sử dụng chuẩn Web Speech API quốc tế. Trình duyệt Edge/Chrome trên Windows, macOS, Android và iOS đều hỗ trợ giọng đọc tiếng Việt mượt mà.
                </p>
                <button
                  onClick={() => audioService.speak('Xin chào các bạn nhỏ lớp 3D Trường Tiểu học Khoái Châu 1!')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Thử giọng đọc mẫu</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Chế độ trải nghiệm</h4>
                  <p className="text-xs text-slate-500">
                    Chuyển đổi giữa chế độ Demo (dữ liệu mẫu) và Chế độ thực tế của giáo viên
                  </p>
                </div>
                <button
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    isDemoMode ? 'bg-amber-400 text-amber-950' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isDemoMode ? 'Đang bật Demo' : 'Đang ở Thực tế'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl text-xs md:text-sm cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
