# AI API Backend

Node.js와 Express를 사용한 AI API 백엔드 서버입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`env.example` 파일을 복사하여 `.env` 파일을 생성하고 OpenAI API 키를 설정하세요:
```bash
cp env.example .env
```

`.env` 파일에서 다음을 설정하세요:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### 1. 헬스 체크
```
GET /api/health
```

### 2. AI 채팅
```
POST /api/ai/chat
```

**요청 본문:**
```json
{
  "message": "안녕하세요!",
  "systemPrompt": "당신은 도움이 되는 AI 어시스턴트입니다."
}
```

**응답:**
```json
{
  "success": true,
  "response": "안녕하세요! 무엇을 도와드릴까요?",
  "user_message": "안녕하세요!",
  "model": "gemini-pro"
}
```

### 3. 콘텐츠 생성
```
POST /api/ai/generate
```

**요청 본문:**
```json
{
  "prompt": "고양이에 대한 시를 써주세요",
  "type": "text"  // "text" 또는 "image"
}
```

### 4. 텍스트 분석
```
POST /api/ai/analyze
```

**요청 본문:**
```json
{
  "text": "분석할 텍스트",
  "analysis_type": "sentiment"  // "sentiment", "summary", "keywords"
}
```

### 5. 코드 생성
```
POST /api/ai/generate-code
```

**요청 본문:**
```json
{
  "description": "배열을 정렬하는 함수",
  "language": "javascript"
}
```

## 사용 예시

### cURL을 사용한 테스트

```bash
# 헬스 체크
curl http://localhost:5000/api/health

# AI 채팅
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "안녕하세요!"}'

# 텍스트 분석
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "오늘은 정말 좋은 날씨입니다!", "analysis_type": "sentiment"}'
```

### JavaScript/Node.js에서 사용

```javascript
// AI 채팅
const response = await fetch('http://localhost:5000/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: '안녕하세요!',
    systemPrompt: '당신은 도움이 되는 AI 어시스턴트입니다.'
  })
});

const data = await response.json();
console.log(data.response);
```

## 보안 고려사항

1. **API 키 보안**: `.env` 파일을 `.gitignore`에 추가하여 API 키가 노출되지 않도록 하세요.
2. **CORS 설정**: 프로덕션 환경에서는 적절한 CORS 설정을 하세요.
3. **요청 제한**: 필요에 따라 rate limiting을 추가하세요.
4. **입력 검증**: 모든 사용자 입력을 검증하세요.

## 에러 처리

모든 API 엔드포인트는 일관된 에러 응답 형식을 사용합니다:

```json
{
  "error": "에러 메시지",
  "details": "상세 에러 정보 (개발 모드에서만)"
}
```

## 라이센스

ISC
