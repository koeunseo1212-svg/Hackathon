const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

// 데이터베이스 초기화
const connectDB = require('./database');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Gemini AI 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 미들웨어 설정
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 라우터 가져오기
const authRoutes = require('./routes/auth');
const promotionRoutes = require('./routes/promotion');

// 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/promotion', promotionRoutes);

// 헬스 체크 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'AI API is running',
    timestamp: new Date().toISOString()
  });
});

// 인증 미들웨어 가져오기
const { authenticateToken } = require('./middleware/auth');

// AI 채팅 엔드포인트 (인증 필요)
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message, systemPrompt = "당신은 도움이 되는 AI 어시스턴트입니다." } = req.body;

    if (!message) {
      return res.status(400).json({ error: '메시지가 필요합니다.' });
    }

    // Gemini 모델 초기화
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 채팅 시작
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    // 시스템 프롬프트와 사용자 메시지 결합
    const fullPrompt = `${systemPrompt}\n\n사용자: ${message}`;
    
    const result = await chat.sendMessage(fullPrompt);
    const aiResponse = result.response.text();

    res.json({
      success: true,
      response: aiResponse,
      user_message: message,
      model: "gemini-pro"
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'AI 서비스에 문제가 발생했습니다.',
      details: error.message 
    });
  }
});

// 콘텐츠 생성 엔드포인트 (인증 필요)
app.post('/api/ai/generate', authenticateToken, async (req, res) => {
  try {
    const { prompt, type = 'text' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: '프롬프트가 필요합니다.' });
    }

    let result;

    if (type === 'image') {
      // Gemini Pro Vision을 사용한 이미지 생성 (텍스트 기반)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const imagePrompt = `다음 프롬프트에 대한 이미지를 상세히 설명해주세요: ${prompt}`;
      
      const result = await model.generateContent(imagePrompt);
      result = result.response.text();
    } else {
      // 텍스트 생성
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });
      result = result.response.text();
    }

    res.json({
      success: true,
      result: result,
      type: type,
      prompt: prompt
    });

  } catch (error) {
    console.error('Generate API Error:', error);
    res.status(500).json({ 
      error: '콘텐츠 생성에 실패했습니다.',
      details: error.message 
    });
  }
});

// 텍스트 분석 엔드포인트 (인증 필요)
app.post('/api/ai/analyze', authenticateToken, async (req, res) => {
  try {
    const { text, analysis_type = 'sentiment' } = req.body;

    if (!text) {
      return res.status(400).json({ error: '분석할 텍스트가 필요합니다.' });
    }

    let prompt;
    switch (analysis_type) {
      case 'sentiment':
        prompt = `다음 텍스트의 감정을 분석해주세요: ${text}`;
        break;
      case 'summary':
        prompt = `다음 텍스트를 요약해주세요: ${text}`;
        break;
      case 'keywords':
        prompt = `다음 텍스트에서 주요 키워드를 추출해주세요: ${text}`;
        break;
      default:
        prompt = `다음 텍스트를 분석해주세요: ${text}`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.3,
      },
    });

    const analysis_result = result.response.text();

    res.json({
      success: true,
      analysis: analysis_result,
      analysis_type: analysis_type,
      original_text: text
    });

  } catch (error) {
    console.error('Analyze API Error:', error);
    res.status(500).json({ 
      error: '텍스트 분석에 실패했습니다.',
      details: error.message 
    });
  }
});

// 코드 생성 엔드포인트 (인증 필요)
app.post('/api/ai/generate-code', authenticateToken, async (req, res) => {
  try {
    const { description, language = 'javascript' } = req.body;

    if (!description) {
      return res.status(400).json({ error: '코드 설명이 필요합니다.' });
    }

    const prompt = `${language}로 다음 기능을 구현하는 코드를 작성해주세요: ${description}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent({
      contents: [
        { 
          role: "user", 
          parts: [{ text: `당신은 ${language} 전문 개발자입니다. 깔끔하고 효율적인 코드를 작성해주세요.\n\n${prompt}` }] 
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.3,
      },
    });

    const code = result.response.text();

    res.json({
      success: true,
      code: code,
      language: language,
      description: description
    });

  } catch (error) {
    console.error('Code Generation API Error:', error);
    res.status(500).json({ 
      error: '코드 생성에 실패했습니다.',
      details: error.message 
    });
  }
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ error: '요청한 엔드포인트를 찾을 수 없습니다.' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 API 엔드포인트: http://localhost:${PORT}/api`);
});

