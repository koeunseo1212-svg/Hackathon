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
JWT_SECRET=your-super-secret-jwt-key-change-in-production
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

### 인증 API

#### 1. 회원가입
```
POST /api/auth/register
```

**요청 본문:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Password123!"
}
```

**응답:**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. 로그인
```
POST /api/auth/login
```

**요청 본문:**
```json
{
  "username": "testuser",
  "password": "Password123!"
}
```

#### 3. 로그아웃
```
POST /api/auth/logout
```
**헤더:** `Authorization: Bearer <token>`

#### 4. 프로필 조회
```
GET /api/auth/profile
```
**헤더:** `Authorization: Bearer <token>`

#### 5. 프로필 업데이트
```
PUT /api/auth/profile
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "email": "newemail@example.com"
}
```

#### 6. 비밀번호 변경
```
PUT /api/auth/change-password
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword456!"
}
```

### AI API (인증 필요)

#### 1. 헬스 체크
```
GET /api/health
```

#### 2. AI 채팅
```
POST /api/ai/chat
```
**헤더:** `Authorization: Bearer <token>`

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

#### 3. 콘텐츠 생성
```
POST /api/ai/generate
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "prompt": "고양이에 대한 시를 써주세요",
  "type": "text"  // "text" 또는 "image"
}
```

#### 4. 텍스트 분석
```
POST /api/ai/analyze
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "text": "분석할 텍스트",
  "analysis_type": "sentiment"  // "sentiment", "summary", "keywords"
}
```

#### 5. 코드 생성
```
POST /api/ai/generate-code
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "description": "배열을 정렬하는 함수",
  "language": "javascript"
}
```

### 프롬프트 파이프라인 API

#### 1. 업종 분석
```
POST /api/promotion/analyze-industry
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "industry": "카페"
}
```

#### 2. 가게 정보 분석
```
POST /api/promotion/analyze-store-info
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "storeName": "스타벅스 강남점",
  "industry": "카페",
  "address": "서울특별시 강남구 테헤란로 123",
  "detailedAddress": "456빌딩 1층",
  "phoneNumber": "02-1234-5678",
  "operatingHours": "07:00-22:00",
  "industryAnalysis": "업종 분석 결과"
}
```

#### 3. SNS별 홍보글 생성
```
POST /api/promotion/generate-promotion
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "platform": "instagram",  // "instagram", "naver-blog", "facebook"
  "storeAnalysis": "가게 분석 결과",
  "industryAnalysis": "업종 분석 결과",
  "contentType": "event-promotion",  // "product-intro", "event-promotion", "brand-story", "customer-review", "update-news", "tips-info"
  "toneAndManner": "friendly",  // "friendly", "professional", "funny", "sophisticated", "warm", "energetic"
  "promotionDetails": "신메뉴 출시 이벤트, 20% 할인 혜택",
  "additionalInfo": "추가 정보"
}
```

#### 4. 통합 파이프라인 (전체 과정)
```
POST /api/promotion/complete-pipeline
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "industry": "카페",
  "storeName": "스타벅스 강남점",
  "address": "서울특별시 강남구 테헤란로 123",
  "detailedAddress": "456빌딩 1층",
  "phoneNumber": "02-1234-5678",
  "operatingHours": "07:00-22:00",
  "platforms": ["instagram", "naver-blog", "facebook"],
  "contentType": "event-promotion",
  "toneAndManner": "energetic",
  "promotionDetails": "신메뉴 출시 이벤트, 20% 할인 혜택",
  "additionalInfo": "신메뉴 출시 예정, 친환경 포장재 사용"
}
```

**응답:**
```json
{
  "success": true,
  "resultId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "pipeline": {
    "industry": "카페",
    "storeInfo": { ... },
    "industryAnalysis": "...",
    "storeAnalysis": "...",
    "promotions": { ... },
    "platforms": ["instagram", "naver-blog"]
  },
  "generatedAt": "2024-01-01T12:00:00.000Z"
}
```

#### 5. 결과물 저장
```
POST /api/promotion/save-result
```
**헤더:** `Authorization: Bearer <token>`

**요청 본문:**
```json
{
  "industry": "카페",
  "storeName": "스타벅스 강남점",
  "address": "서울특별시 강남구 테헤란로 123",
  "detailedAddress": "456빌딩 1층",
  "phoneNumber": "02-1234-5678",
  "operatingHours": "07:00-22:00",
  "platforms": ["instagram", "naver-blog"],
  "contentType": "event-promotion",
  "toneAndManner": "friendly",
  "promotionDetails": "신메뉴 출시 이벤트, 20% 할인 혜택",
  "additionalInfo": "신메뉴 출시 예정, 친환경 포장재 사용",
  "generatedPromotions": {
    "instagram": { ... },
    "naver-blog": { ... }
  },
  "paymentInfo": {
    "amount": 15000,
    "currency": "KRW",
    "paymentMethod": "card"
  }
}
```

#### 6. 결과물 조회
```
GET /api/promotion/result/:resultId
```
**헤더:** `Authorization: Bearer <token>`

**응답:**
```json
{
  "success": true,
  "result": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "industry": "카페",
    "storeInfo": {
      "storeName": "스타벅스 강남점",
      "address": "서울특별시 강남구 테헤란로 123",
      "detailedAddress": "456빌딩 1층",
      "phoneNumber": "02-1234-5678",
      "operatingHours": "07:00-22:00"
    },
    "platforms": ["instagram", "naver-blog"],
    "contentType": "event-promotion",
    "toneAndManner": "friendly",
    "promotionDetails": "신메뉴 출시 이벤트, 20% 할인 혜택",
    "additionalInfo": "신메뉴 출시 예정, 친환경 포장재 사용",
    "generatedPromotions": {
      "instagram": {
        "title": "스타벅스 강남점 신메뉴 출시! 🎉",
        "content": "안녕하세요! 스타벅스 강남점에서 새로운 메뉴가 출시되었습니다...",
        "hashtags": "#스타벅스 #강남점 #신메뉴 #카페 #커피",
        "tips": "인스타그램에서 더 많은 팔로워를 얻으려면..."
      },
      "naver-blog": {
        "title": "[스타벅스 강남점] 신메뉴 출시 이벤트 상세 후기",
        "content": "안녕하세요! 오늘은 스타벅스 강남점에서 진행 중인 신메뉴 출시 이벤트에 대해 자세히 알아보겠습니다...",
        "hashtags": "#스타벅스 #강남점 #신메뉴 #카페 #커피 #이벤트",
        "tips": "네이버 블로그에서 더 많은 방문자를 유도하려면..."
      }
    },
    "paymentInfo": {
      "amount": 15000,
      "currency": "KRW",
      "paymentMethod": "card",
      "paidAt": "2024-01-01T12:00:00.000Z"
    },
    "status": "completed",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

#### 7. 사용자의 모든 결과물 조회
```
GET /api/promotion/my-results
```
**헤더:** `Authorization: Bearer <token>`

**응답:**
```json
{
  "success": true,
  "results": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "industry": "카페",
      "storeInfo": {
        "storeName": "스타벅스 강남점"
      },
      "platforms": ["instagram", "naver-blog"],
      "contentType": "event-promotion",
      "status": "completed",
      "createdAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

#### 8. 결과물 다운로드
```
GET /api/promotion/download/:resultId
```
**헤더:** `Authorization: Bearer <token>`

**응답:**
```json
{
  "success": true,
  "message": "다운로드 준비 중입니다.",
  "downloadUrl": "/api/promotion/download-file/64f8a1b2c3d4e5f6a7b8c9d0"
}
```

## 테스트 방법

```bash
# 프롬프트 파이프라인 테스트
node test-promotion.js

# 결과물 API 테스트
node test-result.js
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
