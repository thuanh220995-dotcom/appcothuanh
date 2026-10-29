import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client (using recommended headers)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    app: 'AI Cùng Em - Phiêu Lưu Tri Thức Lớp 3',
    teacher: 'Nguyễn Hoàng Thu Anh',
    school: 'Trường Tiểu học Khoái Châu 1',
    classroom: 'Lớp 3D',
  });
});

// Server-side Gemini API generate proxy
app.post('/api/gemini/generate', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Chưa cấu hình GEMINI_API_KEY phía máy chủ. Hệ thống sẽ sử dụng bộ dữ liệu chuẩn mực và tạo tương tác thông minh tại chỗ.',
        fallback: true,
      });
    }

    const { prompt, systemInstruction, responseMimeType, schema, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Thiếu nội dung yêu cầu (prompt)' });
    }

    const config: any = {
      systemInstruction: systemInstruction || 'Bạn là trợ lý giáo dục tiểu học Việt Nam chuyên sâu cho học sinh lớp 3 theo Chương trình GDPT 2018.',
      temperature: Number(temperature),
    };

    if (responseMimeType) {
      config.responseMimeType = responseMimeType;
    }
    if (schema) {
      config.responseSchema = schema;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config,
    });

    const text = response.text || '';
    res.json({ success: true, text });
  } catch (error: any) {
    console.error('Gemini Generate Error:', error?.message || error);
    res.status(500).json({
      error: error?.message || 'Lỗi khi gọi trí tuệ nhân tạo Gemini',
      fallback: true,
    });
  }
});

// Chatbot endpoint for "Robot Tri Thức - Bạn Đồng Hành Lớp 3D"
app.post('/api/gemini/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'Chưa cấu hình GEMINI_API_KEY. Vui lòng thử lại sau hoặc chuyển sang chế độ hướng dẫn gợi ý.',
        fallback: true,
      });
    }

    const { messages, currentSubject = 'Toán', studentName = 'bạn nhỏ' } = req.body;

    const systemInstruction = `Bạn là "Robot Tri Thức" - người bạn robot màu xanh trắng thân thiện, thông minh, luôn đồng hành cùng các bạn học sinh Lớp 3D, Trường Tiểu học Khoái Châu 1 của cô giáo Nguyễn Hoàng Thu Anh.
Học sinh lớp 3 ở độ tuổi 8-9 tuổi. Ngôn ngữ của bạn phải:
1. Thân thiện, vui vẻ, xưng "mình" gọi "bạn" hoặc gọi theo tên "${studentName}".
2. Dùng từ ngữ đơn giản, trong sáng, khích lệ, nhiều biểu tượng cảm xúc vui tươi (✨, 🤖, ⭐, 🌿).
3. ĐẶC BIỆT: Không giải hộ bài tập ngay lập tức! Hãy kiên nhẫn gợi mở từng bước, đặt câu hỏi dẫn dắt để học sinh tự suy nghĩ và tìm ra lời giải.
4. Tuyệt đối an toàn: Không bao giờ hỏi hoặc yêu cầu học sinh cung cấp số điện thoại, địa chỉ nhà, mật khẩu hay thông tin cá nhân.
5. Nếu gặp nội dung khó hoặc băn khoăn, luôn khuyến khích học sinh trao đổi với cô giáo Thu Anh hoặc bố mẹ.
6. Môn học đang tìm hiểu: ${currentSubject}.`;

    const contents = Array.isArray(messages)
      ? messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }))
      : [{ role: 'user', parts: [{ text: req.body.prompt || 'Xin chào!' }] }];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    res.json({ success: true, reply: text });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error?.message || error);
    res.status(500).json({
      error: error?.message || 'Lỗi khi trò chuyện với Robot Tri Thức',
      fallback: true,
    });
  }
});

// Setup Vite in Dev or Static in Production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (prod=${isProd})`);
  });
}

startServer();
