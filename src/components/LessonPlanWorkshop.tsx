import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  Printer,
  Save,
  RotateCcw,
  CheckCircle2,
  FileText,
  Sliders,
  Send,
  PlusCircle,
  Clock,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Subject, LessonPlanOutput, Lesson } from '../types';
import { audioService } from '../utils/audio';
import { callGeminiGenerate } from '../utils/geminiClient';
import { exportLessonPlanToWord, printCurrentElement } from '../utils/exportUtils';

interface LessonPlanWorkshopProps {
  onAddCustomLesson: (lesson: Lesson) => void;
}

export const LessonPlanWorkshop: React.FC<LessonPlanWorkshopProps> = ({ onAddCustomLesson }) => {
  const subjects: Subject[] = [
    'Toán',
    'Tiếng Việt',
    'Tự nhiên và Xã hội',
    'Đạo đức',
    'Hoạt động trải nghiệm',
    'Công nghệ',
    'Tin học',
    'Tiếng Anh',
  ];

  // Form State
  const [subject, setSubject] = useState<Subject>('Toán');
  const [lessonName, setLessonName] = useState<string>('Bảng nhân 8 và Ứng dụng thực tế');
  const [topic, setTopic] = useState<string>('Phép nhân và phép chia trong phạm vi 1000');
  const [bookSeries, setBookSeries] = useState<string>('Kết nối tri thức');
  const [duration, setDuration] = useState<string>('1 tiết (35 phút)');
  const [teachingMethod, setTeachingMethod] = useState<string>('Dạy học theo mô hình 5 trạm AI kết hợp làm việc nhóm và trò chơi');
  const [extraNotes, setExtraNotes] = useState<string>('Tập trung phát triển tư duy tính nhẩm nhanh và giải quyết tình huống cuộc sống.');

  // Generated Plan State
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlanOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!lessonName.trim()) return;
    setIsGenerating(true);
    setSaveStatus(null);
    audioService.playSound('pop');

    const prompt = `Bạn là chuyên gia giáo dục tiểu học Việt Nam am hiểu sâu sắc Chương trình GDPT 2018. Hãy tạo kế hoạch bài dạy chuẩn cho:
- Môn học: ${subject}
- Lớp: 3
- Tên bài: ${lessonName}
- Chủ đề: ${topic}
- Bộ sách: ${bookSeries}
- Thời lượng: ${duration}
- Phương pháp: ${teachingMethod}
- Ghi chú: ${extraNotes}
- Giáo viên thực hiện: Nguyễn Hoàng Thu Anh (Trường Tiểu học Khoái Châu 1, Lớp 3D).

Hãy trả về JSON thuần túy (không markdown) với cấu trúc sau:
{
  "id": "plan-${Date.now()}",
  "lessonName": "${lessonName}",
  "subject": "${subject}",
  "grade": 3,
  "bookSeries": "${bookSeries}",
  "duration": "${duration}",
  "objectives": {
    "knowledge": ["Yêu cầu cần đạt 1", "Yêu cầu cần đạt 2"],
    "competence": ["Năng lực tự chủ, hợp tác", "Năng lực đặc thù"],
    "qualities": ["Chăm chỉ, trách nhiệm", "Yêu thích môn học"]
  },
  "equipment": {
    "teacher": ["Máy chiếu/Laptop", "Phiếu bài tập số hóa", "Bộ thẻ tương tác"],
    "students": ["Vở bài tập", "Bút chì, thước kẻ"]
  },
  "activities": [
    {
      "step": "Trạm 1",
      "title": "Khởi động hứng thú",
      "time": "5 phút",
      "teacherAction": "Tổ chức trò chơi đố vui kích hoạt kiến thức",
      "studentAction": "Học sinh suy nghĩ, phát biểu hào hứng",
      "expectedProduct": "Tạo tâm thế tích cực cho bài mới"
    },
    {
      "step": "Trạm 2",
      "title": "Khám phá kiến thức mới",
      "time": "10 phút",
      "teacherAction": "Hướng dẫn quan sát mô hình và hình thành quy luật",
      "studentAction": "Học sinh ghi nhớ và chia sẻ trong nhóm",
      "expectedProduct": "Nắm vững nội dung bài học"
    },
    {
      "step": "Trạm 3",
      "title": "Nhiệm vụ luyện tập phân hóa",
      "time": "12 phút",
      "teacherAction": "Giao nhiệm vụ 3 mức độ (nền tảng, vận dụng, nâng cao)",
      "studentAction": "Học sinh thực hiện bài tập theo năng lực",
      "expectedProduct": "Kết quả bài tập được chấm điểm tự động"
    },
    {
      "step": "Trạm 4",
      "title": "Vận dụng và sáng tạo",
      "time": "5 phút",
      "teacherAction": "Gợi ý tình huống thực tế hoặc vẽ sơ đồ ý tưởng",
      "studentAction": "Học sinh thực hành sáng tạo sản phẩm",
      "expectedProduct": "Sản phẩm sáng tạo hoặc bài toán thực tế"
    },
    {
      "step": "Trạm 5",
      "title": "Phản hồi và Đánh giá",
      "time": "3 phút",
      "teacherAction": "Tổng kết, khen ngợi và động viên học sinh",
      "studentAction": "Học sinh tự đánh giá mức độ hiểu bài",
      "expectedProduct": "Phiếu tự đánh giá và cảm xúc"
    }
  ],
  "assessment": "Đánh giá thường xuyên qua quan sát, trả lời câu hỏi và sản phẩm học tập trên ứng dụng AI.",
  "differentiation": {
    "forStudentsNeedingSupport": "Tăng cường dùng trực quan que tính/hình vẽ, giao bài tập mức 1 và bạn cùng bàn hỗ trợ.",
    "forAdvancedStudents": "Giao bài toán tìm quy luật mở rộng và hướng dẫn các bạn khác trong nhóm."
  },
  "createdAt": "${new Date().toLocaleDateString('vi-VN')}"
}`;

    try {
      const { text } = await callGeminiGenerate({
        prompt,
        responseMimeType: 'application/json',
        temperature: 0.7,
      });

      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setGeneratedPlan(parsed);
      audioService.playSound('celebrate');
      confetti({ particleCount: 70, spread: 70 });
    } catch (e) {
      console.warn('Fallback to standard plan template:', e);
      // High quality fallback plan
      setGeneratedPlan({
        id: `plan-${Date.now()}`,
        lessonName,
        subject,
        grade: 3,
        bookSeries,
        duration,
        objectives: {
          knowledge: [
            `Biết cách tìm kết quả và hình thành nội dung bài: ${lessonName}.`,
            `Vận dụng giải quyết các bài toán và tình huống thực tiễn lớp 3.`,
          ],
          competence: [
            'Năng lực tư duy logic, hợp tác nhóm',
            'Năng lực tự chủ và tự học trên nền tảng công nghệ',
          ],
          qualities: [
            'Chăm chỉ, kiên trì, trung thực trong học tập',
            'Yêu thích môn học và yêu thương bạn bè',
          ],
        },
        equipment: {
          teacher: ['Ứng dụng AI Cùng Em', 'Máy chiếu tương tác', 'Bộ thẻ học liệu'],
          students: ['Vở ghi, bút chì, bảng con', 'Thiết bị học tập kết nối ứng dụng'],
        },
        activities: [
          {
            step: 'Trạm 1',
            title: 'Khởi động hứng thú',
            time: '5 phút',
            teacherAction: 'Tổ chức trò chơi đố vui bằng AI khơi mở chủ đề.',
            studentAction: 'Tham gia trả lời câu hỏi vui nhộn, đón nhận bài học mới.',
            expectedProduct: 'Tâm thế hào hứng, kích hoạt kiến thức nền.',
          },
          {
            step: 'Trạm 2',
            title: 'Khám phá tri thức',
            time: '10 phút',
            teacherAction: 'Dẫn dắt tìm hiểu quy luật qua sơ đồ tư duy và ví dụ thực tế.',
            studentAction: 'Tự tìm hiểu nội dung theo 3 cấp độ (cơ bản - vừa sức - mở rộng).',
            expectedProduct: 'Nắm chắc kiến thức trọng tâm bài học.',
          },
          {
            step: 'Trạm 3',
            title: 'Nhiệm vụ phân hóa',
            time: '12 phút',
            teacherAction: 'Giao bài tập phân hóa theo năng lực, hướng dẫn kịp thời.',
            studentAction: 'Học sinh làm bài, nhận gợi ý và phản hồi ngay lập tức.',
            expectedProduct: 'Phiếu bài tập hoàn thành với tỉ lệ cao.',
          },
          {
            step: 'Trạm 4',
            title: 'Sáng tạo & Thực hành',
            time: '5 phút',
            teacherAction: 'Tổ chức hoạt động vẽ tranh sơ đồ hoặc giải quyết tình huống.',
            studentAction: 'Thực hiện sản phẩm sáng tạo cá nhân hoặc theo nhóm.',
            expectedProduct: 'Bức tranh sơ đồ tư duy hoặc câu chuyện học tập.',
          },
          {
            step: 'Trạm 5',
            title: 'Phản hồi & Suy ngẫm',
            time: '3 phút',
            teacherAction: 'Nhận xét, động viên và ghi nhận tiến bộ của cả lớp.',
            studentAction: 'Chọn emoji cảm xúc và tự đánh giá mức độ nắm bài.',
            expectedProduct: 'Bảng tự đánh giá và lưu trữ tiến trình.',
          },
        ],
        assessment: 'Đánh giá vì sự tiến bộ của học sinh; kết hợp tự đánh giá và đánh giá của giáo viên.',
        differentiation: {
          forStudentsNeedingSupport: 'Sử dụng ví dụ quen thuộc, chia nhỏ thao tác và động viên liên tục.',
          forAdvancedStudents: 'Khuyến khích tìm ra nhiều cách giải khác nhau và sáng tạo thêm tình huống.',
        },
        createdAt: new Date().toLocaleDateString('vi-VN'),
      });
      audioService.playSound('celebrate');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePushTo5Stations = () => {
    if (!generatedPlan) return;

    // Convert plan to dynamic Lesson object
    const newLesson: Lesson = {
      id: `lesson-custom-${Date.now()}`,
      title: generatedPlan.lessonName,
      subject: generatedPlan.subject,
      grade: 3,
      unit: topic,
      bookSeries: bookSeries as any,
      objective: generatedPlan.objectives.knowledge.join('; '),
      competencies: [...generatedPlan.objectives.competence, ...generatedPlan.objectives.qualities],
      durationMinutes: 35,
      isCustom: true,
      station1: {
        warmupRiddle: {
          riddle: `Đố bạn biết tên bài này / Hôm nay cùng học hăng say từng giờ? / Môn ${generatedPlan.subject} thật hay / Khám phá tri thức đón chào tương lai!`,
          hint: 'Bài học: ' + generatedPlan.lessonName,
          answer: generatedPlan.lessonName,
          explanation: 'Chào mừng các bạn bước vào tiết học bổ ích hôm nay!',
        },
        observationGame: {
          title: 'Khởi động bài học ' + generatedPlan.lessonName,
          description: 'Học sinh cùng quan sát các đồ dùng học tập và tranh ảnh trên màn hình.',
          question: 'Em dự đoán bài học này sẽ giúp chúng ta rèn luyện năng lực nào?',
          options: ['Tư duy và tính toán', 'Cảm thụ và hợp tác', 'Sáng tạo và giải quyết vấn đề', 'Tất cả các ý trên'],
          correctIndex: 3,
          explanation: 'Chính xác! Bài học giúp phát triển toàn diện các năng lực phẩm chất.',
        },
        secretTile: {
          topic: 'Bí mật bài học ' + generatedPlan.lessonName,
          question: 'Lật 4 ô bí mật để đón nhận thông điệp tiết học:',
          tiles: [
            { id: 1, clue: 'Mục tiêu 1: Hiểu bài sâu', isRevealed: false },
            { id: 2, clue: 'Mục tiêu 2: Hăng hái hợp tác', isRevealed: false },
            { id: 3, clue: 'Mục tiêu 3: Rèn luyện chăm chỉ', isRevealed: false },
            { id: 4, clue: 'Mục tiêu 4: Tự tin sáng tạo', isRevealed: false },
          ],
          hiddenContent: '🌟 Lớp 3D chinh phục thành công bài học mới! 🌟',
          answer: generatedPlan.lessonName,
        },
      },
      station2: {
        summaryTitle: 'Khám phá bài học: ' + generatedPlan.lessonName,
        levels: {
          basic: {
            title: 'Kiến thức cốt lõi',
            content: `Bài học ${generatedPlan.lessonName} giúp các em hình thành kiến thức nền tảng vững chắc theo chương trình GDPT 2018.`,
            keyPoints: generatedPlan.objectives.knowledge,
          },
          standard: {
            title: 'Vận dụng vừa sức',
            content: `Các em hãy liên hệ bài học này với cuộc sống hàng ngày tại gia đình và trường học để ghi nhớ tốt nhất.`,
            keyPoints: generatedPlan.objectives.competence,
          },
          advanced: {
            title: 'Mở rộng sáng tạo',
            content: `Hãy tự đặt ra các câu hỏi mở và thử sức với những bài toán nâng cao để phát triển tư duy.`,
            keyPoints: generatedPlan.objectives.qualities,
          },
        },
        flashcards: [
          { front: 'Nội dung chính', back: generatedPlan.lessonName, example: 'Chương trình GDPT 2018 Lớp 3' },
          { front: 'Thời lượng tiết học', back: generatedPlan.duration, example: 'Phân phối 5 trạm AI' },
        ],
        mindMapNodes: [
          { id: 'root', label: generatedPlan.lessonName, color: 'bg-emerald-600 text-white' },
          { id: 'n1', label: 'Khám phá kiến thức', parentId: 'root', color: 'bg-blue-100 text-blue-800' },
          { id: 'n2', label: 'Luyện tập phân hóa', parentId: 'root', color: 'bg-pink-100 text-pink-800' },
          { id: 'n3', label: 'Vận dụng thực tế', parentId: 'root', color: 'bg-amber-100 text-amber-800' },
        ],
      },
      station3: {
        tasks: [
          {
            id: 'ct1',
            type: 'multiple-choice',
            level: 1,
            prompt: `Câu hỏi củng cố: Bài học hôm nay là gì?`,
            options: [generatedPlan.lessonName, 'Bài ôn tập', 'Kiểm tra 15 phút', 'Ngoại khóa'],
            correctAnswer: generatedPlan.lessonName,
            explanation: `Chính xác! Bài học của chúng ta là ${generatedPlan.lessonName}.`,
            hint: 'Nhìn vào tiêu đề bài giảng ở đầu bài nhé!',
          },
          {
            id: 'ct2',
            type: 'true-false',
            level: 2,
            prompt: `Đúng hay sai: Học sinh lớp 3D cần tích cực trao đổi, thảo luận nhóm khi học bài ${generatedPlan.lessonName}.`,
            options: ['Đúng', 'Sai'],
            correctAnswer: 'Đúng',
            explanation: 'Đúng! Tinh thần hợp tác giúp các bạn học tập tiến bộ nhanh hơn.',
          },
        ],
      },
      station4: {
        challengeTitle: `Sáng tạo cùng bài học ${generatedPlan.lessonName}`,
        prompt: `Em hãy vẽ một bức tranh sơ đồ hoặc viết vài câu cảm nhận về điều em ấn tượng nhất trong bài học hôm nay!`,
        creativeType: 'drawing',
        suggestedIdeas: [
          'Vẽ sơ đồ tư duy các ý chính',
          'Viết câu chuyện ngắn minh họa',
          'Sáng tác thơ 4 chữ vui nhộn',
        ],
      },
      station5: {
        reflectionQuestions: [
          { id: 'r1', question: `Cảm xúc của em sau khi học bài ${generatedPlan.lessonName}:`, type: 'emoji' },
          { id: 'r2', question: 'Tự đánh giá mức độ hiểu bài:', type: 'self-rate' },
          { id: 'r3', question: 'Điều em nhớ nhất trong bài học:', type: 'open-text' },
        ],
        teacherCheer: `Cô Thu Anh rất tự hào về tinh thần học tập của các em trong tiết học ${generatedPlan.lessonName}! 🌟`,
      },
    };

    onAddCustomLesson(newLesson);
    setSaveStatus('✅ Đã đưa bài học mới vào Hành trình 5 Trạm thành công!');
    audioService.playSound('celebrate');
    confetti({ particleCount: 80, spread: 70 });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              ✍️
            </div>
            <div>
              <span className="bg-emerald-300 text-emerald-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                Dành riêng cho Giáo viên • Lớp 3D
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Xưởng Sáng Tạo Bài Giảng AI
              </h2>
              <p className="text-emerald-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Soạn kế hoạch bài dạy chuẩn Chương trình GDPT 2018; phân hóa 3 mức độ, xuất Word và tích hợp ngay vào Hành trình 5 Trạm.
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-emerald-100 font-semibold">
            <div>GV: Nguyễn Hoàng Thu Anh</div>
            <div>Trường Tiểu học Khoái Châu 1</div>
          </div>
        </div>
      </div>

      {/* Main 2 Columns: Input Form & Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-800 text-base">Thông Số Soạn Giảng</h3>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Môn học:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm font-semibold outline-none cursor-pointer"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tên bài học:</label>
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="Ví dụ: Bảng nhân 8 và ứng dụng..."
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
            />
          </div>

          {/* Topic */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Chủ đề bài học:</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Chủ đề kiến thức..."
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
            />
          </div>

          {/* Book Series & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Bộ sách SGK:</label>
              <select
                value={bookSeries}
                onChange={(e) => setBookSeries(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-2.5 py-2 text-xs md:text-sm font-semibold outline-none"
              >
                <option value="Kết nối tri thức">Kết nối tri thức</option>
                <option value="Chân trời sáng tạo">Chân trời sáng tạo</option>
                <option value="Cánh diều">Cánh diều</option>
                <option value="Chung">Tích hợp chung</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Thời lượng:</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-2.5 py-2 text-xs md:text-sm font-semibold outline-none"
              />
            </div>
          </div>

          {/* Teaching Method */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Phương pháp & Mô hình tổ chức:</label>
            <input
              type="text"
              value={teachingMethod}
              onChange={(e) => setTeachingMethod(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs md:text-sm font-semibold outline-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Yêu cầu bổ sung:</label>
            <textarea
              rows={2}
              value={extraNotes}
              onChange={(e) => setExtraNotes(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl p-2.5 text-xs font-semibold outline-none"
            />
          </div>

          {/* Big Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !lessonName.trim()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl text-sm md:text-base shadow-lg shadow-emerald-200 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-5 h-5 text-amber-300 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'AI đang biên soạn kế hoạch...' : 'TẠO KẾ HOẠCH BÀI DẠY BẰNG AI'}</span>
          </button>
        </div>

        {/* Generated Lesson Plan Preview & Actions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-800 text-base">
                  Kế Hoạch Bài Dạy Chuẩn GDPT 2018
                </h3>
              </div>

              {generatedPlan && (
                <div className="flex items-center gap-2">
                  {/* Export Word */}
                  <button
                    onClick={() => exportLessonPlanToWord(generatedPlan)}
                    className="flex items-center gap-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl cursor-pointer shadow-sm"
                    title="Tải tệp Word (.doc) mở được trên máy tính"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất Word (.doc)</span>
                  </button>

                  {/* Print / PDF */}
                  <button
                    onClick={printCurrentElement}
                    className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl cursor-pointer"
                    title="In hoặc lưu dạng PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In / PDF</span>
                  </button>
                </div>
              )}
            </div>

            {/* Plan Body Preview */}
            {generatedPlan ? (
              <div className="mt-4 space-y-5 text-slate-800 text-sm max-h-[520px] overflow-y-auto pr-2">
                {/* School Header */}
                <div className="text-center border-b pb-3 border-slate-100">
                  <div className="text-xs font-bold text-slate-500 uppercase">
                    Trường Tiểu học Khoái Châu 1 • Lớp 3D
                  </div>
                  <div className="text-base md:text-lg font-black text-emerald-800 mt-1 uppercase">
                    {generatedPlan.lessonName}
                  </div>
                  <div className="text-xs text-slate-600">
                    Môn: {generatedPlan.subject} | Bộ sách: {generatedPlan.bookSeries} | Thời lượng: {generatedPlan.duration}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Giáo viên biên soạn: Nguyễn Hoàng Thu Anh
                  </div>
                </div>

                {/* Section I */}
                <div className="space-y-1">
                  <h4 className="font-black text-xs uppercase text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md">
                    I. Yêu cầu cần đạt
                  </h4>
                  <ul className="list-disc pl-5 text-xs text-slate-700 space-y-0.5">
                    {generatedPlan.objectives.knowledge.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                    {generatedPlan.objectives.competence.map((c, i) => (
                      <li key={i}>
                        <b>Năng lực:</b> {c}
                      </li>
                    ))}
                    {generatedPlan.objectives.qualities.map((q, i) => (
                      <li key={i}>
                        <b>Phẩm chất:</b> {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Section II: Equipment */}
                <div className="space-y-1">
                  <h4 className="font-black text-xs uppercase text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md">
                    II. Đồ dùng dạy học
                  </h4>
                  <p className="text-xs text-slate-700">
                    <b>Giáo viên:</b> {generatedPlan.equipment.teacher.join(', ')}
                  </p>
                  <p className="text-xs text-slate-700">
                    <b>Học sinh:</b> {generatedPlan.equipment.students.join(', ')}
                  </p>
                </div>

                {/* Section III: 5 AI Stations Activities */}
                <div className="space-y-2">
                  <h4 className="font-black text-xs uppercase text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md">
                    III. Các hoạt động dạy học theo mô hình 5 trạm AI
                  </h4>
                  <div className="space-y-2">
                    {generatedPlan.activities.map((act, i) => (
                      <div key={i} className="p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-extrabold text-slate-800">
                          <span className="text-emerald-700">
                            {act.step}: {act.title}
                          </span>
                          <span className="text-slate-400 font-semibold">{act.time}</span>
                        </div>
                        <div>
                          <b>Hoạt động của GV:</b> {act.teacherAction}
                        </div>
                        <div>
                          <b>Hoạt động của HS:</b> {act.studentAction}
                        </div>
                        <div className="text-slate-500 italic">
                          <b>Sản phẩm dự kiến:</b> {act.expectedProduct}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section IV: Assessment & Differentiation */}
                <div className="space-y-1">
                  <h4 className="font-black text-xs uppercase text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md">
                    IV. Đánh giá & Điều chỉnh sau bài dạy
                  </h4>
                  <p className="text-xs text-slate-700">
                    <b>Đánh giá:</b> {generatedPlan.assessment}
                  </p>
                  <p className="text-xs text-slate-700">
                    <b>Học sinh cần hỗ trợ:</b> {generatedPlan.differentiation.forStudentsNeedingSupport}
                  </p>
                  <p className="text-xs text-slate-700">
                    <b>Học sinh hoàn thành tốt:</b> {generatedPlan.differentiation.forAdvancedStudents}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-72 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300" />
                <p className="font-bold text-sm text-slate-500">
                  Chưa có kế hoạch bài dạy nào được tạo
                </p>
                <p className="text-xs max-w-sm">
                  Hãy điền thông tin bài học ở cột bên trái và bấm "Tạo Kế Hoạch Bài Dạy Bằng AI" để nhận bản giáo án chuẩn GDPT 2018 nhé!
                </p>
              </div>
            )}
          </div>

          {/* Action to Push Lesson into 5 Stations */}
          {generatedPlan && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              {saveStatus ? (
                <span className="text-xs font-bold text-emerald-700">{saveStatus}</span>
              ) : (
                <span className="text-xs text-slate-500">
                  Có thể tích hợp ngay bài học này vào giao diện 5 trạm cho học sinh
                </span>
              )}

              <button
                onClick={handlePushTo5Stations}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl text-xs md:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Đưa bài dạy vào Hành trình 5 Trạm ➔</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
