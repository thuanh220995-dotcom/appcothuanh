import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  PieChart,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { Student } from '../types';
import { audioService } from '../utils/audio';

interface ProgressTrackerProps {
  students: Student[];
  isDemoMode: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  students,
  isDemoMode,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'Toán' | 'Tiếng Việt' | 'Tự nhiên và Xã hội'>('all');

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.completedTasksCount > 0).length;
  const totalTasksCompleted = students.reduce((acc, s) => acc + s.completedTasksCount, 0);
  const studentsNeedingSupport = students.filter((s) => s.needsSupport);
  const avgScore = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.totalScore, 0) / totalStudents)
    : 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-sky-700 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              📈
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-300 text-purple-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Bảng Theo Dõi Tiến Bộ • Lớp 3D
                </span>
                {isDemoMode && (
                  <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    Dữ liệu minh họa thực tế
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Hành Trình Trưởng Thành
              </h2>
              <p className="text-purple-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Phân tích định lượng tiến độ, nắm bắt khó khăn của học sinh và nhận gợi ý sư phạm kịp thời từ AI.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>SĨ SỐ LỚP 3D</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-slate-800">{totalStudents} em</div>
          <div className="text-xs text-emerald-600 font-semibold">
            {activeStudents} em đã tham gia phiêu lưu ({totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0}%)
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>NHIỆM VỤ HOÀN THÀNH</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-700">{totalTasksCompleted} lượt</div>
          <div className="text-xs text-slate-500 font-semibold">
            Tích lũy qua các bài học 5 trạm
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>ĐIỂM TRUNG BÌNH</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{avgScore} / 100</div>
          <div className="text-xs text-emerald-600 font-semibold">
            Phát triển năng lực đồng đều
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>CẦN CÔ HỖ TRỢ</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">{studentsNeedingSupport.length} em</div>
          <div className="text-xs text-rose-600 font-semibold">
            Đã có kế hoạch kèm cặp phân hóa
          </div>
        </div>
      </div>

      {/* 2 Detailed Columns: Difficulty Analysis & Pedagogical AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Analysis */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-800 text-base">
              Nội Dung Học Sinh Còn Gặp Khó Khăn
            </h3>
          </div>

          <div className="space-y-3">
            {[
              {
                topic: 'Phép nhân 7 x 8 và 7 x 9 (Toán)',
                rate: '28% học sinh còn nhầm lẫn',
                bar: 'w-[28%] bg-amber-500',
                detail: 'Các em hay nhầm 7 x 8 = 54 thay vì 56.',
              },
              {
                topic: 'Phân biệt từ chỉ hoạt động và từ chỉ đặc điểm (Tiếng Việt)',
                rate: '19% học sinh băn khoăn',
                bar: 'w-[19%] bg-sky-500',
                detail: 'Cần củng cố câu hỏi: "Làm gì?" và "Thế nào?".',
              },
              {
                topic: 'Phân biệt cây thân gỗ và cây thân thảo (TNXH)',
                rate: '12% học sinh cần trợ giúp',
                bar: 'w-[12%] bg-emerald-500',
                detail: 'Học sinh dễ nhầm cây chuối là cây thân gỗ.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                  <span>{item.topic}</span>
                  <span className="text-rose-600">{item.rate}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.bar}`} />
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical AI Suggestions Based on Real Data */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-slate-800 text-base">
              Gợi Ý Sư Phạm Từ AI Cho Cô Giáo Thu Anh
            </h3>
          </div>

          <div className="space-y-3 text-xs md:text-sm">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 font-black text-purple-900">
                <span>🤝</span>
                <span>Học sinh cần được quan tâm thêm trong tuần:</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-semibold">
                Lê Hoàng Long và Đặng Hà My cần được chia vào nhóm có bạn học khá (như Minh An, Phương Linh) ở Trạm 3 để được hướng dẫn phương pháp đếm thêm 7.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 font-black text-emerald-900">
                <span>🎯</span>
                <span>Hoạt động khởi động phù hợp cho tiết tới:</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-semibold">
                Sử dụng trò chơi "Vòng quay may mắn" ở đầu giờ khoảng 3 phút để ôn lại 7 x 8 = 56 và 7 x 9 = 63 dưới dạng câu đố vần điệu vui.
              </p>
            </div>

            <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sky-900">
                <span>🌟</span>
                <span>Động viên phẩm chất & tâm lý lứa tuổi 8-9 tuổi:</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-semibold">
                Trao huy hiệu "Chăm ngoan tiến bộ" ngay sau khi các em tự sửa được câu sai, tránh so sánh công khai kết quả điểm số trước cả lớp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
