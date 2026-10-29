import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Download,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  EyeOff,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Student } from '../types';
import { OFFICIAL_STUDENTS_3D } from '../data/sampleStudents';
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
  const [genderFilter, setGenderFilter] = useState<'all' | 'Nam' | 'Nữ'>('all');
  const [supportFilter, setSupportFilter] = useState<'all' | 'needsSupport' | 'good'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showContactDetails, setShowContactDetails] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // New Student Form
  const [newName, setNewName] = useState<string>('');
  const [newGroup, setNewGroup] = useState<string>('Nhóm Sao Kim (Tổ 1)');
  const [newAvatar, setNewAvatar] = useState<string>('👦');
  const [newGender, setNewGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [newBirthDate, setNewBirthDate] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('Thông Quan - KC');
  const [newPhone, setNewPhone] = useState<string>('');

  // Editing student modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const groups = [
    'Nhóm Sao Kim (Tổ 1)',
    'Nhóm Sao Mai (Tổ 2)',
    'Nhóm Khám Phá (Tổ 3)',
    'Nhóm Sáng Tạo (Tổ 4)',
  ];

  // Stats
  const totalCount = students.length;
  const femaleCount = students.filter((s) => s.gender === 'Nữ' || s.avatar === '👧').length;
  const maleCount = totalCount - femaleCount;
  const needSupportCount = students.filter((s) => s.needsSupport).length;

  const handleAddStudent = () => {
    if (!newName.trim()) return;
    const newStudent: Student = {
      id: `s-${Date.now()}`,
      code: `HS-3D-${String(students.length + 1).padStart(2, '0')}`,
      name: newName.trim(),
      birthDate: newBirthDate || '2018',
      gender: newGender,
      ethnicity: 'Kinh',
      address: newAddress,
      parentPhone: newPhone,
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
    setNewBirthDate('');
    setNewPhone('');
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

  const handleResetToOfficialRoster = () => {
    if (confirm('Khôi phục danh sách đầy đủ 33 học sinh chính thức Lớp 3D (Năm học 2026 - 2027)?')) {
      onUpdateStudents(OFFICIAL_STUDENTS_3D);
      audioService.playSound('celebrate');
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchGroup = groupFilter === 'all' || s.group === groupFilter;
    const matchGender =
      genderFilter === 'all' ||
      s.gender === genderFilter ||
      (genderFilter === 'Nữ' && s.avatar === '👧') ||
      (genderFilter === 'Nam' && s.avatar === '👦');
    const matchSupport =
      supportFilter === 'all' ||
      (supportFilter === 'needsSupport' && s.needsSupport) ||
      (supportFilter === 'good' && !s.needsSupport);
    const matchName =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.address && s.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.parentPhone && s.parentPhone.includes(searchTerm));
    return matchGroup && matchGender && matchSupport && matchName;
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-teal-300 text-teal-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                  DANH SÁCH HỌC SINH LỚP 3D • NĂM HỌC 2026 – 2027
                </span>
                <span className="bg-white/20 text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                  Sĩ số: {totalCount} học sinh
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Lớp Học Thông Minh 3D
              </h2>
              <p className="text-teal-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Trường Tiểu học Khoái Châu 1 • Giáo viên chủ nhiệm & giảng dạy: Nguyễn Hoàng Thu Anh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetToOfficialRoster}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Khôi phục danh sách đầy đủ 33 học sinh Lớp 3D"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nạp 33 HS gốc</span>
            </button>

            <button
              onClick={() => exportStudentsToCSV(students)}
              className="flex items-center gap-1.5 bg-white text-teal-900 hover:bg-teal-50 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Xuất file CSV danh sách và kết quả học sinh"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV (Excel)</span>
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

      {/* Class Statistics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Tổng Sĩ Số</div>
            <div className="text-2xl font-black text-slate-800">{totalCount} em</div>
            <div className="text-[11px] text-teal-600 font-semibold">100% tham gia học tập</div>
          </div>
          <span className="text-3xl">🎒</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Cơ Cấu Giới Tính</div>
            <div className="text-xl font-black text-pink-600">{femaleCount} Nữ <span className="text-slate-400 font-normal">/</span> <span className="text-blue-600">{maleCount} Nam</span></div>
            <div className="text-[11px] text-slate-500 font-semibold">
              Nữ: {totalCount > 0 ? Math.round((femaleCount / totalCount) * 100) : 0}% • Nam: {totalCount > 0 ? Math.round((maleCount / totalCount) * 100) : 0}%
            </div>
          </div>
          <span className="text-3xl">👫</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Địa Bàn Cư Trú</div>
            <div className="text-sm font-black text-slate-800">Thông Quan & Phố Phủ</div>
            <div className="text-[11px] text-slate-500 font-semibold">
              100% Dân tộc Kinh (Khoái Châu)
            </div>
          </div>
          <span className="text-3xl">🏡</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase">Hỗ Trợ Phân Hóa</div>
            <div className="text-2xl font-black text-amber-600">{needSupportCount} em</div>
            <div className="text-[11px] text-slate-500 font-semibold">
              Được kèm cặp riêng ở Trạm 3
            </div>
          </div>
          <span className="text-3xl">🤝</span>
        </div>
      </div>

      {/* Add Student Form Collapse */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 border-2 border-teal-300 shadow-md space-y-4 animate-fadeIn">
          <h3 className="font-extrabold text-slate-800 text-base">Thêm Hồ Sơ Học Sinh Mới Vào Lớp 3D</h3>
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
              <label className="text-xs font-bold text-slate-700">Ngày sinh (ngày/tháng/năm):</label>
              <input
                type="text"
                value={newBirthDate}
                onChange={(e) => setNewBirthDate(e.target.value)}
                placeholder="Ví dụ: 12/10/2018"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Giới tính:</label>
              <select
                value={newGender}
                onChange={(e) => {
                  const g = e.target.value as 'Nam' | 'Nữ';
                  setNewGender(g);
                  setNewAvatar(g === 'Nam' ? '👦' : '👧');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
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
              <label className="text-xs font-bold text-slate-700">Chỗ ở hiện tại:</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Ví dụ: Thông Quan - KC"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">SĐT liên hệ CMHS:</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Ví dụ: 0963420869"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
              />
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

      {/* Filter & View Switcher Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, mã HS, SĐT CMHS..."
            className="w-full text-xs md:text-sm font-semibold outline-none bg-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />

          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="all">Tất cả 4 tổ ({students.length})</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="Nữ">Nữ ({femaleCount})</option>
            <option value="Nam">Nam ({maleCount})</option>
          </select>

          {/* Support Filter */}
          <select
            value={supportFilter}
            onChange={(e) => setSupportFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="all">Tất cả tình trạng</option>
            <option value="needsSupport">Cần hỗ trợ ({needSupportCount})</option>
            <option value="good">Tiến bộ tốt ({totalCount - needSupportCount})</option>
          </select>

          {/* Privacy Toggle: Show/Hide Phone */}
          <button
            onClick={() => setShowContactDetails(!showContactDetails)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
            title="Ẩn/Hiện số điện thoại phụ huynh và địa chỉ"
          >
            {showContactDetails ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5 text-teal-600" />}
            <span className="hidden md:inline">{showContactDetails ? 'Ẩn SĐT CMHS' : 'Hiện SĐT CMHS'}</span>
          </button>

          {/* View Mode Toggle: Table vs Cards */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Xem dạng Bảng hồ sơ chi tiết"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-teal-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Xem dạng Thẻ học sinh"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Table Mode (Detailed Class Roster) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <th className="py-3.5 px-4 text-center w-12">STT</th>
                  <th className="py-3.5 px-4">Mã HS</th>
                  <th className="py-3.5 px-4">Họ và tên học sinh</th>
                  <th className="py-3.5 px-4 text-center">Giới tính</th>
                  <th className="py-3.5 px-4 text-center">Ngày sinh</th>
                  <th className="py-3.5 px-4">Chỗ ở hiện tại</th>
                  {showContactDetails && <th className="py-3.5 px-4">SĐT liên hệ CMHS</th>}
                  <th className="py-3.5 px-4">Tổ / Nhóm</th>
                  <th className="py-3.5 px-4 text-center">Hoàn thành</th>
                  <th className="py-3.5 px-4 text-center">Điểm số</th>
                  <th className="py-3.5 px-4">Tình trạng</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st, idx) => {
                  const isFemale = st.gender === 'Nữ' || st.avatar === '👧';
                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-teal-50/50 transition-colors font-medium text-slate-700"
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        {st.code}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{st.avatar}</span>
                          <span>{st.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isFemale ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isFemale ? 'Nữ' : 'Nam'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-semibold whitespace-nowrap">
                        {st.birthDate || '2018'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{st.address || 'Thông Quan - KC'}</span>
                        </div>
                      </td>
                      {showContactDetails && (
                        <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {st.parentPhone ? (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-teal-600" />
                              <span>{st.parentPhone}</span>
                            </div>
                          ) : (
                            <span className="text-slate-300">--</span>
                          )}
                        </td>
                      )}
                      <td className="py-3 px-4 font-bold text-teal-800 whitespace-nowrap">
                        {st.group}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {st.completedTasksCount} bài
                      </td>
                      <td className="py-3 px-4 text-center font-black text-emerald-700">
                        {st.totalScore} đ
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {st.needsSupport ? (
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[11px] border border-amber-200">
                            Cần hỗ trợ
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                            Tiến bộ tốt
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingStudent(st)}
                            className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded-lg cursor-pointer"
                            title="Ghi nhận xét của cô giáo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(st.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg cursor-pointer"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alternative View: Cards Grid Mode */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{st.avatar}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        st.gender === 'Nữ' || st.avatar === '👧'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {st.gender || 'Học sinh'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {st.code}
                  </span>
                </div>

                <h4 className="font-extrabold text-base text-slate-900 mt-2">{st.name}</h4>
                <p className="text-xs text-teal-700 font-bold">{st.group}</p>

                {/* Birth & Contact details */}
                <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                  {st.birthDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Sinh ngày: {st.birthDate}</span>
                    </div>
                  )}
                  {st.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{st.address}</span>
                    </div>
                  )}
                  {showContactDetails && st.parentPhone && (
                    <div className="flex items-center gap-1 text-teal-800 font-mono font-semibold">
                      <Phone className="w-3 h-3 text-teal-600" />
                      <span>{st.parentPhone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Nhiệm vụ:</span>
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
      )}

      {/* Edit Student Notes Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-slate-800 text-base">
              Hồ Sơ & Nhận Xét: {editingStudent.name} ({editingStudent.code})
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tổ / Nhóm học tập:</label>
              <select
                value={editingStudent.group}
                onChange={(e) => setEditingStudent({ ...editingStudent, group: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              >
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
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
                Lưu hồ sơ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
