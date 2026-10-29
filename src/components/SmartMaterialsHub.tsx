import React, { useState } from 'react';
import {
  FolderKanban,
  Sparkles,
  FileText,
  HelpCircle,
  Layers,
  BookOpen,
  Printer,
  Download,
  PlusCircle,
  Volume2,
  RefreshCw,
  Search,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Subject, LearningMaterial } from '../types';
import { audioService } from '../utils/audio';
import { callGeminiGenerate } from '../utils/geminiClient';
import { printCurrentElement } from '../utils/exportUtils';

export const SmartMaterialsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'worksheet' | 'bank' | 'reading' | 'batch'>('worksheet');

  // Worksheet generator state
  const [worksheetSubject, setWorksheetSubject] = useState<Subject>('Toán');
  const [worksheetTitle, setWorksheetTitle] = useState<string>('Phiếu luyện tập Phép nhân 7 và 8');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isGeneratingWorksheet, setIsGeneratingWorksheet] = useState<boolean>(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any | null>(null);

  // Reading generator state
  const [readingTopic, setReadingTopic] = useState<string>('Tình bạn tuổi thơ dưới mái trường Khoái Châu');
  const [isGeneratingReading, setIsGeneratingReading] = useState<boolean>(false);
  const [generatedReading, setGeneratedReading] = useState<any | null>(null);

  // Batch Generation State
  const [batchSubject, setBatchSubject] = useState<Subject>('Toán');
  const [batchPrompt, setBatchPrompt] = useState<string>('Tạo 3 bộ phiếu học tập rèn luyện bảng nhân và chia lớp 3, mỗi phiếu 5 câu chia theo 3 mức độ.');
  const [batchProgress, setBatchProgress] = useState<number>(0);
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [batchResults, setBatchResults] = useState<any[]>([]);

  // Default question bank items
  const [questionBank, setQuestionBank] = useState<any[]>([
    {
      id: 'qb1',
      subject: 'Toán',
      level: 'Mức 1',
      prompt: 'Tìm x biết: x : 7 = 6',
      answer: 'x = 42',
      explanation: 'Số bị chia = Thương x Số chia => 6 x 7 = 42.',
    },
    {
      id: 'qb2',
      subject: 'Toán',
      level: 'Mức 2',
      prompt: 'Một cửa hàng có 56 mét vải, đã bán 1/7 số vải đó. Hỏi cửa hàng đã bán bao nhiêu mét vải?',
      answer: '8 mét vải',
      explanation: 'Số mét vải đã bán là: 56 : 7 = 8 (mét).',
    },
    {
      id: 'qb3',
      subject: 'Tiếng Việt',
      level: 'Mức 1',
      prompt: 'Tìm từ chỉ âm thanh trong câu: "Tiếng suối trong như tiếng hát xa."',
      answer: 'tiếng hát, róc rách',
      explanation: 'Gợi tả âm thanh tiếng suối êm đềm.',
    },
    {
      id: 'qb4',
      subject: 'Tự nhiên và Xã hội',
      level: 'Mức 2',
      prompt: 'Nêu 2 lý do vì sao chúng ta cần tưới nước cho cây xanh đều đặn?',
      answer: 'Cung cấp nước cho cây quang hợp và hút khoáng chất',
      explanation: 'Nước giúp cây xanh tươi tốt và duy trì sự sống.',
    },
  ]);

  const [bankSearch, setBankSearch] = useState<string>('');
  const [bankSubjectFilter, setBankSubjectFilter] = useState<string>('all');

  // Handle Worksheet Generation
  const handleGenerateWorksheet = async () => {
    setIsGeneratingWorksheet(true);
    audioService.playSound('pop');

    const prompt = `Bạn là trợ lý giáo viên lớp 3 (Trường Tiểu học Khoái Châu 1). Tạo một phiếu học tập gồm ${questionCount} câu hỏi môn ${worksheetSubject} cho học sinh lớp 3 với chủ đề "${worksheetTitle}".
Phân chia câu hỏi thành 3 mức độ (Mức 1 Nền tảng, Mức 2 Vận dụng, Mức 3 Nâng cao).
Kèm theo đáp án và biểu điểm chi tiết dành cho giáo viên.
Trả về JSON thuần túy (không markdown) với cấu trúc:
{
  "title": "${worksheetTitle}",
  "subject": "${worksheetSubject}",
  "totalQuestions": ${questionCount},
  "questions": [
    {
      "number": 1,
      "level": "Mức 1",
      "question": "Nội dung câu hỏi...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "Đáp án đúng",
      "explanation": "Hướng dẫn chấm"
    }
  ]
}`;

    try {
      const { text } = await callGeminiGenerate({
        prompt,
        responseMimeType: 'application/json',
      });
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setGeneratedWorksheet(parsed);
      audioService.playSound('celebrate');
      confetti({ particleCount: 60, spread: 60 });
    } catch (e) {
      // Fallback worksheet
      const fallback = {
        title: worksheetTitle,
        subject: worksheetSubject,
        totalQuestions: questionCount,
        questions: Array.from({ length: Math.min(questionCount, 10) }, (_, i) => ({
          number: i + 1,
          level: i < 4 ? 'Mức 1' : i < 8 ? 'Mức 2' : 'Mức 3',
          question: `Câu ${i + 1}: Bài tập rèn luyện kĩ năng số ${i + 1} (${worksheetSubject} Lớp 3D)`,
          options: ['A. 21', 'B. 35', 'C. 42', 'D. 49'],
          answer: 'C. 42',
          explanation: 'Quy tắc tính toán chuẩn mực theo chương trình GDPT 2018.',
        })),
      };
      setGeneratedWorksheet(fallback);
      audioService.playSound('celebrate');
    } finally {
      setIsGeneratingWorksheet(false);
    }
  };

  // Handle Reading Material Generation
  const handleGenerateReading = async () => {
    setIsGeneratingReading(true);
    audioService.playSound('pop');

    const prompt = `Hãy sáng tác 1 đoạn văn đọc hiểu ngắn nguyên bản (khoảng 120-150 từ) rất phù hợp cho học sinh lớp 3 về chủ đề: "${readingTopic}".
Kèm theo 4 câu hỏi đọc hiểu:
1. Câu hỏi nội dung trực tiếp
2. Câu hỏi từ ngữ gợi cảm
3. Câu hỏi suy luận ý nghĩa
4. Câu hỏi liên hệ thực tế bản thân
Và đáp án gợi ý chi tiết.
Trả về JSON thuần túy (không markdown) với cấu trúc:
{
  "title": "${readingTopic}",
  "passage": "Nội dung đoạn văn...",
  "questions": [
    {"q": "Câu hỏi 1", "type": "Nội dung", "answer": "Đáp án 1"},
    {"q": "Câu hỏi 2", "type": "Từ ngữ", "answer": "Đáp án 2"},
    {"q": "Câu hỏi 3", "type": "Suy luận", "answer": "Đáp án 3"},
    {"q": "Câu hỏi 4", "type": "Liên hệ", "answer": "Đáp án 4"}
  ]
}`;

    try {
      const { text } = await callGeminiGenerate({
        prompt,
        responseMimeType: 'application/json',
      });
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      setGeneratedReading(JSON.parse(cleaned));
      audioService.playSound('celebrate');
      confetti({ particleCount: 60, spread: 60 });
    } catch (e) {
      setGeneratedReading({
        title: readingTopic,
        passage:
          'Dưới bóng râm của hàng xà cừ cổ thụ Trường Tiểu học Khoái Châu 1, các bạn học sinh Lớp 3D ríu rít cười đùa trong giờ ra chơi. Trên tay mỗi bạn là một cuốn truyện tranh bổ ích hoặc một chiếc bảng vẽ thông minh. Những nụ cười rạng rỡ và tinh thần đoàn kết chan hòa đã biến ngôi trường thân thương thành ngôi nhà thứ hai đầy ắp niềm vui.',
        questions: [
          { q: 'Giờ ra chơi diễn ra ở đâu?', type: 'Nội dung', answer: 'Dưới bóng râm hàng xà cừ Trường TH Khoái Châu 1.' },
          { q: 'Từ ngữ nào miêu tả không khí vui tươi của các bạn?', type: 'Từ ngữ', answer: 'Ríu rít, rạng rỡ, chan hòa.' },
          { q: 'Vì sao ngôi trường được gọi là ngôi nhà thứ hai?', type: 'Suy luận', answer: 'Vì nơi đây chan hòa tình thầy cô, bạn bè ấm áp như gia đình.' },
          { q: 'Em sẽ làm gì để trường lớp mình luôn vui vẻ và sạch đẹp?', type: 'Liên hệ', answer: 'Giữ gìn vệ sinh, hòa đồng, giúp đỡ bạn bè.' },
        ],
      });
      audioService.playSound('celebrate');
    } finally {
      setIsGeneratingReading(false);
    }
  };

  // Handle Batch Generation with Progress
  const handleBatchGenerate = async () => {
    setIsBatchGenerating(true);
    setBatchProgress(10);
    audioService.playSound('pop');

    // Simulate real batch chunks with updates
    setTimeout(() => setBatchProgress(35), 600);
    setTimeout(() => setBatchProgress(70), 1200);

    const prompt = `Tạo 3 phiếu học tập khác nhau theo lô cho môn ${batchSubject} lớp 3: "${batchPrompt}".
Trả về JSON mảng gồm 3 phiếu:
[
  { "id": 1, "title": "Phiếu 1", "level": "Cơ bản", "itemsCount": 5, "description": "Luyện tập nền tảng" },
  { "id": 2, "title": "Phiếu 2", "level": "Vừa sức", "itemsCount": 5, "description": "Vận dụng tính nhẩm" },
  { "id": 3, "title": "Phiếu 3", "level": "Nâng cao", "itemsCount": 5, "description": "Giải toán thực tế" }
]`;

    try {
      const { text } = await callGeminiGenerate({
        prompt,
        responseMimeType: 'application/json',
      });
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setBatchResults(Array.isArray(parsed) ? parsed : [parsed]);
    } catch (e) {
      setBatchResults([
        { id: 1, title: 'Phiếu A: Củng cố phép tính', level: 'Cơ bản', itemsCount: 5, description: 'Rèn luyện phản xạ tính nhẩm' },
        { id: 2, title: 'Phiếu B: Vận dụng tình huống', level: 'Vừa sức', itemsCount: 5, description: 'Toán có lời văn gắn với thực tế' },
        { id: 3, title: 'Phiếu C: Thử thách tư duy', level: 'Nâng cao', itemsCount: 5, description: 'Tìm ẩn số và quy luật dãy số' },
      ]);
    } finally {
      setBatchProgress(100);
      setIsBatchGenerating(false);
      audioService.playSound('celebrate');
      confetti({ particleCount: 90, spread: 80 });
    }
  };

  const filteredQuestions = questionBank.filter((q) => {
    const matchSub = bankSubjectFilter === 'all' || q.subject === bankSubjectFilter;
    const matchSearch = q.prompt.toLowerCase().includes(bankSearch.toLowerCase()) || q.answer.toLowerCase().includes(bankSearch.toLowerCase());
    return matchSub && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-sky-600 to-blue-700 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              📁
            </div>
            <div>
              <span className="bg-indigo-300 text-indigo-950 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                Kho Học Liệu Thông Minh • Lớp 3D
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Tạo Học Liệu Tự Động Bằng AI
              </h2>
              <p className="text-indigo-100 text-xs md:text-sm mt-0.5 max-w-xl">
                Tạo phiếu học tập, ngân hàng câu hỏi, bài đọc hiểu ngữ liệu mới và tạo nội dung hàng loạt theo lô.
              </p>
            </div>
          </div>

          {/* Quick Tab Selector */}
          <div className="bg-white/15 p-1.5 rounded-2xl flex flex-wrap items-center gap-1 border border-white/20">
            <button
              onClick={() => setActiveTab('worksheet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'worksheet' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              📝 Phiếu học tập
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'reading' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              📖 Bài đọc hiểu
            </button>
            <button
              onClick={() => setActiveTab('bank')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'bank' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              🗃️ Ngân hàng câu hỏi
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'batch' ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-100 hover:text-white'
              }`}
            >
              ⚡ Tạo hàng loạt AI
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Phiếu học tập (Worksheet) */}
      {activeTab === 'worksheet' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-slate-800 text-base">Cấu hình Phiếu học tập</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Môn học:</label>
              <select
                value={worksheetSubject}
                onChange={(e) => setWorksheetSubject(e.target.value as Subject)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
              >
                <option value="Toán">Toán</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tiêu đề phiếu:</label>
              <input
                type="text"
                value={worksheetTitle}
                onChange={(e) => setWorksheetTitle(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Số lượng câu hỏi:</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      questionCount === num
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {num} câu
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateWorksheet}
              disabled={isGeneratingWorksheet}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-2xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isGeneratingWorksheet ? 'animate-spin' : ''}`} />
              <span>{isGeneratingWorksheet ? 'AI đang tạo phiếu...' : 'Tạo phiếu học tập mới'}</span>
            </button>
          </div>

          {/* Worksheet Preview & Print Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-base">Xem trước & Xuất phiếu</h3>
              {generatedWorksheet && (
                <button
                  onClick={printCurrentElement}
                  className="flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-black text-white px-3.5 py-1.5 rounded-xl cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In phiếu học tập</span>
                </button>
              )}
            </div>

            {generatedWorksheet ? (
              <div className="space-y-5 text-slate-800 text-sm max-h-[500px] overflow-y-auto pr-2">
                <div className="text-center border-b pb-3 border-slate-100">
                  <div className="text-xs font-bold uppercase text-slate-500">
                    Trường Tiểu học Khoái Châu 1 • Lớp 3D
                  </div>
                  <div className="text-lg font-black text-indigo-900 mt-1 uppercase">
                    {generatedWorksheet.title}
                  </div>
                  <div className="text-xs text-slate-600">
                    Môn: {generatedWorksheet.subject} • Quy mô: {generatedWorksheet.totalQuestions} câu • Giáo viên: Nguyễn Hoàng Thu Anh
                  </div>
                </div>

                <div className="space-y-4">
                  {generatedWorksheet.questions.map((q: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs md:text-sm space-y-2">
                      <div className="flex items-center justify-between font-extrabold text-slate-800">
                        <span className="text-indigo-800">Câu {q.number || i + 1} ({q.level})</span>
                        <span className="text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded">
                          Đáp án: {q.answer}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800">{q.question}</p>
                      {q.options && (
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                          {q.options.map((opt: string, optIdx: number) => (
                            <div key={optIdx} className="bg-white p-2 rounded-lg border border-slate-100">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.explanation && (
                        <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                          <b>Hướng dẫn chấm:</b> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <FileText className="w-10 h-10 text-slate-300 mb-2" />
                <p className="font-bold text-sm text-slate-500">Chưa có phiếu bài tập</p>
                <p className="text-xs">Bấm "Tạo phiếu học tập mới" để AI sinh phiếu bài tập theo yêu cầu.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Reading Comprehension */}
      {activeTab === 'reading' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Tạo Bài Đọc Hiểu Nguyên Bản</h3>
              <p className="text-xs text-slate-500">AI tự viết ngữ liệu ngắn nguyên bản và 4 câu hỏi đọc hiểu chuẩn mực</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={readingTopic}
                onChange={(e) => setReadingTopic(e.target.value)}
                placeholder="Nhập chủ đề đọc hiểu..."
                className="bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-1.5 text-xs md:text-sm font-semibold outline-none w-64"
              />
              <button
                onClick={handleGenerateReading}
                disabled={isGeneratingReading}
                className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingReading ? 'Đang viết...' : 'Tạo bài đọc mới'}</span>
              </button>
            </div>
          </div>

          {generatedReading && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sky-900 text-lg uppercase tracking-wide">
                    {generatedReading.title}
                  </h4>
                  <button
                    onClick={() => audioService.speak(generatedReading.passage)}
                    className="flex items-center gap-1 text-xs font-bold bg-white text-sky-800 px-3 py-1.5 rounded-xl border border-sky-200 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Nghe đọc bài</span>
                  </button>
                </div>
                <p className="text-slate-800 text-base leading-relaxed font-semibold font-['Quicksand'] bg-white p-5 rounded-xl border border-sky-100">
                  {generatedReading.passage}
                </p>
              </div>

              {/* 4 Reading questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedReading.questions?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-indigo-700">Câu {idx + 1} ({item.type})</span>
                      <button
                        onClick={() => audioService.speak(item.q)}
                        className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{item.q}</p>
                    <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <b>Gợi ý đáp án:</b> {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Ngân hàng câu hỏi */}
      {activeTab === 'bank' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base">Ngân Hàng Câu Hỏi Lớp 3</h3>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  placeholder="Tìm câu hỏi..."
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold outline-none"
                />
              </div>

              <select
                value={bankSubjectFilter}
                onChange={(e) => setBankSubjectFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
              >
                <option value="all">Tất cả môn</option>
                <option value="Toán">Toán</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                      {q.subject}
                    </span>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                      {q.level}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{q.prompt}</p>
                  <p className="text-xs text-emerald-700 font-semibold">
                    <b>Đáp án:</b> {q.answer}
                  </p>
                </div>

                <button
                  onClick={() => audioService.speak(`${q.prompt}. Đáp án là ${q.answer}`)}
                  className="p-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl cursor-pointer"
                  title="Nghe câu hỏi"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Batch Generation (Tạo nhiều học liệu bằng AI) */}
      {activeTab === 'batch' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6">
          <div className="max-w-2xl">
            <span className="bg-amber-100 text-amber-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Chức năng tạo hàng loạt theo lô
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-2">
              TẠO NHIỀU HỌC LIỆU BẰNG AI CÙNG LÚC
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Giáo viên có thể yêu cầu tạo hàng loạt phiếu bài tập theo nhiều mức độ chỉ với một cú nhấp chuột.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Yêu cầu tạo theo lô:</label>
              <textarea
                rows={3}
                value={batchPrompt}
                onChange={(e) => setBatchPrompt(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 focus:border-amber-400 rounded-xl p-3 text-xs md:text-sm font-semibold outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Môn:</span>
                <select
                  value={batchSubject}
                  onChange={(e) => setBatchSubject(e.target.value as Subject)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold"
                >
                  <option value="Toán">Toán</option>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Tự nhiên và Xã hội">Tự nhiên và Xã hội</option>
                </select>
              </div>

              <button
                onClick={handleBatchGenerate}
                disabled={isBatchGenerating}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-6 py-2.5 rounded-xl text-xs md:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isBatchGenerating ? 'Đang thực hiện theo lô...' : 'TẠO NHIỀU HỌC LIỆU BẰNG AI'}</span>
              </button>
            </div>

            {/* Batch Progress Bar */}
            {isBatchGenerating && (
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Tiến độ thực hiện theo lô:</span>
                  <span>{batchProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${batchProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Batch Results Output */}
          {batchResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-800">
                Kết quả đã tạo theo lô ({batchResults.length} sản phẩm):
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {batchResults.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-900">{item.title}</span>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                        {item.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{item.description}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">{item.itemsCount} câu</span>
                      <button
                        onClick={printCurrentElement}
                        className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>In phiếu</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
