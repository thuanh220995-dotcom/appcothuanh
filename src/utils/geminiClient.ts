/**
 * Gemini Client helper that calls server-side endpoints
 * With intelligent pedagogical fallback if server or API key is not ready
 */

export interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  responseMimeType?: string;
  schema?: any;
  temperature?: number;
}

export async function callGeminiGenerate(options: GenerateOptions): Promise<{ text: string; isAi: boolean }> {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return { text: data.text, isAi: true };
      }
    }
  } catch (err) {
    console.warn('API call error, switching to pedagogical local generator:', err);
  }

  // Smart pedagogical fallback
  return {
    text: generatePedagogicalFallback(options.prompt),
    isAi: false,
  };
}

export async function callGeminiChat(
  messages: { role: string; content: string }[],
  currentSubject: string = 'Toán',
  studentName: string = 'bạn nhỏ'
): Promise<{ reply: string; isAi: boolean }> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, currentSubject, studentName }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return { reply: data.reply, isAi: true };
      }
    }
  } catch (err) {
    console.warn('Chat API error, fallback to tutor heuristic:', err);
  }

  const lastUserMessage = messages[messages.length - 1]?.content || '';
  return {
    reply: generateTutorFallbackReply(lastUserMessage, currentSubject, studentName),
    isAi: false,
  };
}

function generatePedagogicalFallback(prompt: string): string {
  // If JSON is requested
  if (prompt.toLowerCase().includes('json') || prompt.includes('{')) {
    return JSON.stringify({
      title: "Bài tập rèn luyện năng lực Lớp 3",
      items: [
        {
          question: "Tính kết quả phép nhân: 7 x 6 = ?",
          options: ["36", "42", "48", "49"],
          answer: "42",
          explanation: "7 x 6 = 42. Học sinh có thể đếm thêm 7 đơn vị từ 7 x 5 = 35."
        },
        {
          question: "Trong câu 'Bầy chim hót líu lo đón bình minh', từ nào chỉ hoạt động?",
          options: ["Bầy chim", "hót líu lo", "hót", "bình minh"],
          answer: "hót",
          explanation: "'Hót' là từ chỉ hoạt động của bầy chim."
        }
      ]
    });
  }

  return `### Kế hoạch hoạt động học tập Lớp 3 (GDPT 2018)
1. **Khởi động**: Trò chơi đố vui kích hoạt trí tò mò của học sinh lớp 3D.
2. **Khám phá**: Quan sát tranh ảnh thực tế, phát hiện quy luật kiến thức.
3. **Thực hành**: Bài tập 3 cấp độ (Nền tảng - Vận dụng - Thử thách).
4. **Sáng tạo**: Vẽ sơ đồ tư duy hoặc giải quyết tình huống thực tế.
5. **Đánh giá**: Tự đánh giá mức độ hiểu bài và chia sẻ cảm xúc.`;
}

function generateTutorFallbackReply(prompt: string, subject: string, name: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('chào') || p.includes('hello') || p.includes('hi')) {
    return `Chào ${name} yêu quý! 🤖 Mình là Robot Tri Thức của Lớp 3D đây! Hôm nay chúng mình cùng khám phá môn ${subject} thật vui nhé. Bạn đang muốn tìm hiểu bài nào nè? ✨`;
  }

  if (p.includes('nhân') || p.includes('toán') || p.includes('+') || p.includes('-') || p.includes('x') || p.includes(':')) {
    return `Hay lắm ${name} ơi! 🌟 Với bài Toán này, bạn hãy nhớ lại quy tắc chúng mình đã học nhé. Bạn thử nêu cho mình biết: Đề bài cho chúng ta biết điều gì trước tiên nào? Hãy cùng gỡ từng bước nhé! 📐`;
  }

  if (p.includes('tiếng việt') || p.includes('từ') || p.includes('câu') || p.includes('đoạn văn')) {
    return `Tuyệt vời! 📖 Trong Tiếng Việt lớp 3, để tìm được câu trả lời chính xác, bạn thử đọc kĩ lại câu văn đó một lần nữa xem từ ngữ nào gợi tả rõ nét nhất nhé. Bạn nghĩ từ đó là gì nè? 🌸`;
  }

  if (p.includes('cây') || p.includes('lá') || p.includes('tự nhiên')) {
    return `Một câu hỏi rất hay về thế giới tự nhiên quanh em! 🌿 Cây xanh quanh chúng mình có rễ, thân, lá và hoa quả đấy. Bạn thử quan sát cây gần nhà bạn xem rễ của nó cắm sâu vào đâu nhé! 🪴`;
  }

  return `Robot Tri Thức đã nghe ${name} nói rồi nè! 🤖 Đây là một câu hỏi rất thú vị. Bạn thử suy nghĩ xem bước đầu tiên chúng mình cần làm là gì? Mình luôn ở đây để cổ vũ và gợi ý cho bạn từng bước nhé! ⭐`;
}
