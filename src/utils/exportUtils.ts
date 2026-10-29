/**
 * Utility functions for exporting real Word (.doc), CSV, JSON backups, and PDF printing
 */

import { LessonPlanOutput, Student, LearningMaterial } from '../types';

export function exportLessonPlanToWord(plan: LessonPlanOutput) {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${plan.lessonName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.4; margin: 20mm; }
        .header { text-align: center; margin-bottom: 20px; font-weight: bold; }
        .school-title { font-size: 12pt; text-transform: uppercase; }
        .doc-title { font-size: 16pt; color: #1e3a8a; text-transform: uppercase; margin-top: 15px; }
        .subtitle { font-size: 13pt; font-style: italic; }
        h2 { font-size: 14pt; color: #1e40af; border-bottom: 1px solid #93c5fd; padding-bottom: 4px; margin-top: 18px; }
        h3 { font-size: 13pt; color: #1f2937; margin-top: 10px; }
        table { border-collapse: collapse; width: 100%; margin-top: 12px; }
        th, td { border: 1px solid #374151; padding: 8px; text-align: left; font-size: 12pt; vertical-align: top; }
        th { background-color: #f3f4f6; font-weight: bold; }
        ul { margin-top: 4px; margin-bottom: 6px; padding-left: 20px; }
        .footer-sign { width: 100%; margin-top: 35px; }
        .sign-box { width: 45%; float: right; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="school-title">PHÒNG GD&ĐT KHOÁI CHÂU - TRƯỜNG TIỂU HỌC KHOÁI CHÂU 1</div>
        <div>GIÁO VIÊN: NGUYỄN HOÀNG THU ANH - LỚP 3D</div>
        <div class="doc-title">KẾ HOẠCH BÀI DẠY (THEO CT GDPT 2018)</div>
        <div class="subtitle">Môn: ${plan.subject} | Lớp 3 | Bộ sách: ${plan.bookSeries} | Thời lượng: ${plan.duration}</div>
        <div style="font-size: 14pt; margin-top: 6px; color: #b91c1c;">BÀI: ${plan.lessonName.toUpperCase()}</div>
      </div>

      <h2>I. YÊU CẦU CẦN ĐẠT</h2>
      <h3>1. Năng lực đặc thù</h3>
      <ul>
        ${plan.objectives.knowledge.map((k) => `<li>${k}</li>`).join('')}
      </ul>
      <h3>2. Năng lực chung và Phẩm chất chủ yếu</h3>
      <ul>
        ${plan.objectives.competence.map((c) => `<li><b>Năng lực:</b> ${c}</li>`).join('')}
        ${plan.objectives.qualities.map((q) => `<li><b>Phẩm chất:</b> ${q}</li>`).join('')}
      </ul>

      <h2>II. ĐỒ DÙNG DẠY HỌC</h2>
      <ul>
        <li><b>Giáo viên:</b> ${plan.equipment.teacher.join(', ')}</li>
        <li><b>Học sinh:</b> ${plan.equipment.students.join(', ')}</li>
      </ul>

      <h2>III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU (THEO MÔ HÌNH 5 TRẠM AI)</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 20%;">Hoạt động / Thời lượng</th>
            <th style="width: 40%;">Hoạt động của Giáo viên</th>
            <th style="width: 25%;">Hoạt động của Học sinh</th>
            <th style="width: 15%;">Sản phẩm dự kiến</th>
          </tr>
        </thead>
        <tbody>
          ${plan.activities
            .map(
              (act) => `
            <tr>
              <td><b>${act.step}</b><br/>${act.title}<br/><i>(${act.time})</i></td>
              <td>${act.teacherAction}</td>
              <td>${act.studentAction}</td>
              <td>${act.expectedProduct}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <h2>IV. PHƯƠNG ÁN ĐÁNH GIÁ VÀ ĐIỀU CHỈNH SAU BÀI DẠY</h2>
      <p><b>Phương thức đánh giá:</b> ${plan.assessment}</p>
      <p><b>Hỗ trợ học sinh cần quan tâm:</b> ${plan.differentiation.forStudentsNeedingSupport}</p>
      <p><b>Bồi dưỡng học sinh hoàn thành tốt:</b> ${plan.differentiation.forAdvancedStudents}</p>

      <div class="footer-sign">
        <div class="sign-box">
          <div><i>Khoái Châu, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}</i></div>
          <div style="font-weight: bold; margin-top: 5px;">GIÁO VIÊN BỘ MÔN</div>
          <div style="height: 60px;"></div>
          <div style="font-weight: bold; color: #1e3a8a;">Nguyễn Hoàng Thu Anh</div>
        </div>
        <div style="clear: both;"></div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ke_hoach_bai_day_${plan.lessonName.replace(/[^a-zA-Z0-9]/g, '_')}_Lop3D.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportStudentsToCSV(students: Student[]) {
  const headers = ['Mã học sinh', 'Họ và tên', 'Tổ / Nhóm', 'Số nhiệm vụ hoàn thành', 'Tổng điểm', 'Huy hiệu đạt được', 'Tình trạng'];
  const rows = students.map((s) => [
    s.code,
    `"${s.name}"`,
    `"${s.group}"`,
    s.completedTasksCount,
    s.totalScore,
    `"${s.badges.join('; ')}"`,
    s.needsSupport ? 'Cần hỗ trợ thêm' : 'Tiến bộ tốt',
  ]);

  const csvContent = '\ufeff' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Danh_sach_hoc_sinh_Lop_3D_Khoai_Chau_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportBackupJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printCurrentElement() {
  window.print();
}
