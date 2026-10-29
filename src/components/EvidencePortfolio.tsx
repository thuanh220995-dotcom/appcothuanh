import React, { useState } from 'react';
import {
  Award,
  FileCheck2,
  FolderOpen,
  PlusCircle,
  Download,
  Printer,
  Sparkles,
  Calendar,
  CheckCircle2,
  Tag,
  BookOpen,
} from 'lucide-react';
import { PortfolioEvidence } from '../types';
import { SAMPLE_EVIDENCE } from '../data/sampleStudents';
import { audioService } from '../utils/audio';
import { printCurrentElement } from '../utils/exportUtils';

export const EvidencePortfolio: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<PortfolioEvidence[]>(SAMPLE_EVIDENCE);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // New Evidence Form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<any>('Học liệu AI');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('Minh chứng mới');

  const categories = [
    'Thực trạng',
    'Giải pháp 5 trạm',
    'Kế hoạch triển khai',
    'Học liệu AI',
    'Sản phẩm học sinh',
    'Kết quả đánh giá',
    'Khả năng nhân rộng',
  ];

  const handleAddEvidence = () => {
    if (!newTitle.trim()) return;
    const item: PortfolioEvidence = {
      id: `ev-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Minh chứng bổ sung thực tế trong quá trình dạy học.',
      date: `Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      tags: [newTag, 'Lớp 3D'],
      author: 'Nguyễn Hoàng Thu Anh',
    };

    setEvidenceList([item, ...evidenceList]);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
    audioService.playSound('celebrate');
  };

  const filteredEvidence = activeCategory === 'all'
    ? evidenceList
    : evidenceList.filter((e) => e.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              🏅
            </div>
            <div>
              <span className="bg-rose-300 text-rose-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                Hồ Sơ Sản Phẩm & Minh Chứng • GDPT 2018
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Minh Chứng Ứng Dụng AI Trong Dạy Học
              </h2>
              <p className="text-rose-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Báo cáo sáng kiến sư phạm: "Mô hình 5 Trạm Phiêu Lưu AI Phát Triển Năng Lực Học Sinh Lớp 3" - Cô giáo Nguyễn Hoàng Thu Anh (Trường Tiểu học Khoái Châu 1).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={printCurrentElement}
              className="flex items-center gap-1.5 bg-white text-rose-900 hover:bg-rose-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In báo cáo</span>
            </button>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm minh chứng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-2 overflow-x-auto shadow-sm">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          Tất cả mục ({evidenceList.length})
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === c
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Add Evidence Modal / Collapse */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 border-2 border-rose-300 shadow-md space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-slate-800 text-base">Thêm Minh Chứng Dạy Học Mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tên minh chứng / Hoạt động:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Phiếu nhận xét giờ học Trạm 4..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Chuyên mục hồ sơ:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Mô tả chi tiết minh chứng:</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Ghi chú bối cảnh, đối tượng học sinh, số liệu thực tế..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleAddEvidence}
              disabled={!newTitle.trim()}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-sm cursor-pointer disabled:opacity-50"
            >
              Lưu vào Hồ sơ Minh chứng
            </button>
          </div>
        </div>
      )}

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvidence.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-rose-400 transition-all shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                  {ev.category}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {ev.date}
                </span>
              </div>

              <h4 className="font-extrabold text-base md:text-lg text-slate-900 leading-snug">
                {ev.title}
              </h4>

              <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-semibold">
                {ev.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {ev.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <span className="text-xs font-bold text-indigo-700">GV: {ev.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
