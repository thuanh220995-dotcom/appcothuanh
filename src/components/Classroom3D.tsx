import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Download,
  Upload,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
} from 'lucide-react';
import { Student } from '../types';
import { audioService } from '../utils/audio';
import { exportStudentsToCSV } from '../utils/exportUtils';

interface Classroom3DProps {
  students: Student[];
  onUpdateStudents: (updated: Student[]) => void;
  isDemoMode: boolean;
}

export const Classroom3D: React.FC<Classroom3DProps> = ({
  students,
  onUpdateStudents,
  isDemoMode,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // New Student Form
  const [newName, setNewName] = useState<string>('');
  const [newGroup, setNewGroup] = useState<string>('Nhóm Sao Kim (Tổ 1)');
  const [newAvatar, setNewAvatar] = useState<string>('👦');

  // Teacher feedback notes modal/state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const groups = [
    'Nhóm Sao Kim (Tổ 1)',
    'Nhóm Sao Mai (Tổ 2)',
    'Nhóm Khám Phá (Tổ 3)',
    'Nhóm Sáng Tạo (Tổ 4)',
  ];

  const handleAddStudent = () => {
    if (!newName.trim()) return;
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      code: `HS-3D-${String(students.length + 1).padStart(2, '0')}`,
      name: newName.trim(),
      group: newGroup,
      avatar: newAvatar,
      completedTasksCount: 0,
      totalScore: 0,
      badges: ['Chiến binh mới'],
      needsSupport: false,
      notes: 'Học sinh mới tham gia lớp 3D.',
    };

    onUpdateStudents([...students, newStudent]);
    setNewName('');
    setIsAdding(false);
    audioService.playSound('celebrate');
  };

  const handleDeleteStudent = (id: string) => {
    onUpdateStudents(students.filter((s) => s.id !== id));
    audioService.playSound('pop');
  };

  const handleSaveEdit = () => {
    if (!editingStudent) return;
    onUpdateStudents(students.map((s) => (s.id === editingStudent.id ? editingStudent : s)));
    setEditingStudent(null);
    audioService.playSound('pop');
  };

  const filteredStudents = students.filter((s) => {
    const matchGroup = groupFilter === 'all' || s.group === groupFilter;
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGroup && matchName;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-700 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              👥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-teal-300 text-teal-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  Quản lý Lớp 3D • Sĩ số: {students.length} em
                </span>
                {isDemoMode && (
                  <span className="bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    Dữ liệu minh họa Lớp 3D
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Lớp Học Thông Minh 3D
              </h2>
              <p className="text-teal-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Trường Tiểu học Khoái Châu 1 • Giáo viên phụ trách: Nguyễn Hoàng Thu Anh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportStudentsToCSV(students)}
              className="flex items-center gap-1.5 bg-white text-teal-900 hover:bg-teal-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Xuất file CSV danh sách và kết quả học sinh"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Thêm học sinh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Collapse Form */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 border-2 border-teal-300 shadow-md space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-slate-800 text-base">Thêm Hồ Sơ Học Sinh Mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Họ và tên học sinh:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tổ / Nhóm học tập:</label>
              <select
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              >
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Biểu tượng đại diện:</label>
              <div className="flex items-center gap-2 pt-1">
                {['👦', '👧', '⭐', '🚀', '🐱', '🐶'].map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setNewAvatar(av)}
                    className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-lg cursor-pointer ${
                      newAvatar === av ? 'border-teal-600 bg-teal-50' : 'border-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleAddStudent}
              disabled={!newName.trim()}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-sm cursor-pointer disabled:opacity-50"
            >
              Lưu vào danh sách Lớp 3D
            </button>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên học sinh hoặc mã..."
            className="w-full text-xs md:text-sm font-semibold outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="all">Tất cả nhóm ({students.length})</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStudents.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{st.avatar}</span>
                <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  {st.code}
                </span>
              </div>

              <h4 className="font-extrabold text-base text-slate-900 mt-2">{st.name}</h4>
              <p className="text-xs text-teal-700 font-bold">{st.group}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Nhiệm vụ hoàn thành:</span>
                  <b className="text-slate-900">{st.completedTasksCount} bài</b>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tổng điểm:</span>
                  <b className="text-emerald-700">{st.totalScore} đ</b>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Tình trạng:</span>
                  {st.needsSupport ? (
                    <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      Cần hỗ trợ
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Tiến bộ tốt
                    </span>
                  )}
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-1">
                {st.badges.map((b, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full"
                  >
                    🏆 {b}
                  </span>
                ))}
              </div>

              {/* Notes */}
              {st.notes && (
                <p className="mt-2 text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                  "{st.notes}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setEditingStudent(st)}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Nhận xét</span>
              </button>

              <button
                onClick={() => handleDeleteStudent(st.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                title="Xóa học sinh"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Student Notes Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-800 text-base">
              Nhận Xét & Điều Chỉnh: {editingStudent.name}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Nhận xét của cô giáo Thu Anh:</label>
              <textarea
                rows={3}
                value={editingStudent.notes || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="supportCheck"
                checked={!!editingStudent.needsSupport}
                onChange={(e) => setEditingStudent({ ...editingStudent, needsSupport: e.target.checked })}
                className="rounded text-teal-600 cursor-pointer"
              />
              <label htmlFor="supportCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                Đánh dấu: Học sinh cần được cô giáo hỗ trợ thêm
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl text-xs shadow-sm cursor-pointer"
              >
                Lưu nhận xét
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
