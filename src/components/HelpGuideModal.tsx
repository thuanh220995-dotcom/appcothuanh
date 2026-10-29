import React from 'react';
import { X, HelpCircle, BookOpen, Compass, Bot, CheckCircle2, Sparkles } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] shadow-2xl border-2 border-slate-200 flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-300" />
            <h3 className="font-extrabold text-base md:text-lg">
              Hướng Dẫn Sử Dụng • AI Cùng Em Lớp 3
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 text-sky-700">
              <Compass className="w-4 h-4" />
              <span>1. Dành cho Học sinh: Hành trình 5 Trạm Phiêu lưu</span>
            </h4>
            <div className="space-y-1.5 pl-6 border-l-2 border-sky-300 text-slate-600">
              <p><b>Trạm 1 (Khởi động):</b> Trả lời câu đố vui, lật 4 ô bí mật để mở ra quy tắc cốt lõi.</p>
              <p><b>Trạm 2 (Khám phá):</b> Đọc kiến thức, lật thẻ ghi nhớ Flashcard. Nếu chưa hiểu, bấm nút <i>"Nhờ AI giải thích lại"</i> để nghe ví dụ siêu gần gũi.</p>
              <p><b>Trạm 3 (Nhiệm vụ):</b> Làm bài trắc nghiệm, điền số, ghép đôi nối thẻ. Sau khi nộp bài sẽ có giải thích chi tiết.</p>
              <p><b>Trạm 4 (Sáng tạo):</b> Tự tay vẽ tranh trên bảng vẽ trực tuyến, lưu ảnh PNG về máy hoặc viết câu chuyện vui.</p>
              <p><b>Trạm 5 (Phản hồi):</b> Chọn biểu tượng cảm xúc, tự đánh giá mức độ hiểu bài và nhận huy hiệu Dũng Sĩ Tri Thức Lớp 3!</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 text-emerald-700">
              <BookOpen className="w-4 h-4" />
              <span>2. Dành cho Giáo viên: Xưởng Bài Giảng & Kho Học Liệu</span>
            </h4>
            <div className="space-y-1.5 pl-6 border-l-2 border-emerald-300 text-slate-600">
              <p><b>Soạn giáo án:</b> Điền môn học, tên bài, bộ sách; AI tự động sinh Kế hoạch bài dạy chuẩn 10 mục GDPT 2018.</p>
              <p><b>Xuất Word (.doc):</b> Bấm nút "Xuất Word (.doc)" để tải tệp giáo án mở ngay trên máy tính mà không bị lỗi dấu tiếng Việt.</p>
              <p><b>Tạo theo lô:</b> Vào "Kho Học Liệu" để tạo hàng loạt phiếu bài tập theo 3 mức độ phân hóa.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-900 text-sm flex items-center gap-2 text-cyan-700">
              <Bot className="w-4 h-4" />
              <span>3. Trợ lý Robot Tri Thức & Bảo mật học sinh</span>
            </h4>
            <div className="space-y-1.5 pl-6 border-l-2 border-cyan-300 text-slate-600">
              <p>Robot Tri Thức luôn kiên nhẫn gợi mở từng bước, không làm bài tập hộ học sinh.</p>
              <p>Hệ thống tuân thủ nghiêm ngặt chuẩn bảo vệ an toàn trẻ em: không hỏi địa chỉ nhà, mật khẩu hay số điện thoại.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-2 rounded-xl text-xs md:text-sm cursor-pointer"
          >
            Đã hiểu, bắt đầu thôi! ✨
          </button>
        </div>
      </div>
    </div>
  );
};
