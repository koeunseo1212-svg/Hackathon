const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authenticateToken } = require('../middleware/auth');
const PromotionResult = require('../models/PromotionResult');

const router = express.Router();

// Gemini AI 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1단계: 카테고리 정보 분석
router.post('/analyze-category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ error: '카테고리 정보가 필요합니다.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 카테고리 ID를 한글 이름으로 변환
    const categoryNames = {
      'food': '음식점/카페',
      'beauty': '뷰티/웰스',
      'retail': '소매업',
      'service': '서비스업',
      'education': '교육/학원',
      'medical': '의료/건강',
      'entertainment': '엔터테인먼트',
      'accommodation': '숙박업',
      'other': '기타'
    };

    const categoryName = categoryNames[category] || category;

    const prompt = `
당신은 업종 분석 전문가입니다. 다음 업종에 대해 분석해주세요:

업종: ${categoryName}

다음 항목들을 분석해주세요:
1. 해당 업종의 주요 특징
2. 타겟 고객층
3. 홍보 시 강조해야 할 핵심 포인트
4. 경쟁업체와의 차별화 요소
5. 고객이 가장 관심을 가질 만한 서비스/제품 특징

JSON 형태로 응답해주세요:
{
  "category": "업종명",
  "characteristics": ["특징1", "특징2", "특징3"],
  "targetCustomers": ["타겟1", "타겟2"],
  "keyPoints": ["핵심포인트1", "핵심포인트2"],
  "differentiation": ["차별화요소1", "차별화요소2"],
  "customerInterests": ["고객관심사1", "고객관심사2"]
}
`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({
      success: true,
      analysis: analysis,
      category: category
    });

  } catch (error) {
    console.error('카테고리 분석 오류:', error);
    res.status(500).json({ 
      error: '카테고리 분석 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 2단계: 가게 정보 분석 및 학습
router.post('/analyze-store-info', authenticateToken, async (req, res) => {
  try {
    const { 
      companyName, 
      businessType, 
      address, 
      detailAddress, 
      phone, 
      businessHours,
      introduction,
      categoryAnalysis 
    } = req.body;

    if (!companyName || !businessType || !address) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
당신은 가게 정보 분석 및 홍보 전략 전문가입니다.

가게 정보:
- 상호명: ${companyName}
- 업종: ${businessType}
- 주소: ${address}
- 상세주소: ${detailAddress || '없음'}
- 전화번호: ${phone || '없음'}
- 운영시간: ${businessHours || '없음'}
- 가게 소개: ${introduction || '없음'}

카테고리 분석 정보:
${categoryAnalysis}

이 정보를 바탕으로 다음을 분석해주세요:

1. 가게의 핵심 가치 제안 (Unique Value Proposition)
2. 위치적 장점 분석
3. 운영시간의 장점
4. 고객에게 어필할 수 있는 서비스 특징
5. 홍보 시 강조할 수 있는 매력 포인트
6. 경쟁업체 대비 차별화 요소

JSON 형태로 응답해주세요:
{
  "companyName": "가게명",
  "coreValue": "핵심 가치 제안",
  "locationAdvantage": "위치적 장점",
  "operatingAdvantage": "운영시간 장점",
  "serviceFeatures": ["서비스특징1", "서비스특징2"],
  "appealPoints": ["매력포인트1", "매력포인트2"],
  "differentiation": ["차별화요소1", "차별화요소2"],
  "promotionStrategy": "전체적인 홍보 전략"
}
`;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({
      success: true,
      analysis: analysis,
      storeInfo: {
        companyName,
        businessType,
        address,
        detailAddress,
        phone,
        businessHours,
        introduction
      }
    });

  } catch (error) {
    console.error('가게 정보 분석 오류:', error);
    res.status(500).json({ 
      error: '가게 정보 분석 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 3단계: SNS별 홍보글 생성
router.post('/generate-promotion', authenticateToken, async (req, res) => {
  try {
    const { 
      platform, 
      storeAnalysis, 
      categoryAnalysis,
      contentType = 'general', // 콘텐츠 유형
      tone = 'friendly', // 톤앤매너
      content = '', // 구체적인 홍보 내용
      snsOptions = {} 
    } = req.body;

    if (!platform || !storeAnalysis || !categoryAnalysis) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 콘텐츠 유형별 프롬프트
    let contentTypePrompt = '';
    switch (contentType) {
      case 'general':
        contentTypePrompt = '일반적인 홍보글을 작성해주세요.';
        break;
      case 'event':
        contentTypePrompt = '이벤트나 할인 정보에 중점을 둔 홍보글을 작성해주세요.';
        break;
      case 'menu':
        contentTypePrompt = '메뉴나 상품 소개에 중점을 둔 홍보글을 작성해주세요.';
        break;
      case 'review':
        contentTypePrompt = '고객 후기나 방문 유도에 중점을 둔 홍보글을 작성해주세요.';
        break;
      case 'trend':
        contentTypePrompt = '계절이나 트렌드를 활용한 홍보글을 작성해주세요.';
        break;
      default:
        contentTypePrompt = '일반적인 홍보글을 작성해주세요.';
    }

    // 톤앤매너별 프롬프트
    let tonePrompt = '';
    switch (tone) {
      case 'friendly':
        tonePrompt = '친근하고 편안한 톤으로 작성해주세요.';
        break;
      case 'professional':
        tonePrompt = '전문적이고 신뢰감 있는 톤으로 작성해주세요.';
        break;
      case 'trendy':
        tonePrompt = '트렌디하고 세련된 톤으로 작성해주세요.';
        break;
      case 'warm':
        tonePrompt = '따뜻하고 공감되는 톤으로 작성해주세요.';
        break;
      case 'energetic':
        tonePrompt = '활기차고 에너지 넘치는 톤으로 작성해주세요.';
        break;
      default:
        tonePrompt = '친근한 톤으로 작성해주세요.';
    }

    let platformPrompt = '';
    
    switch (platform) {
      case 'instagram':
        platformPrompt = `
인스타그램 특성에 맞는 홍보글을 작성해주세요:
- 해시태그 활용 (관련성 높은 해시태그 10-15개)
- 이모지 적절히 사용
- 시각적 매력이 있는 문체
- 스토리텔링 요소 포함
- 인스타그램 사용자들의 관심을 끌 수 있는 내용
- 200-300자 내외의 간결한 문체
`;
        break;
      
      case 'naver-blog':
        platformPrompt = `
네이버 블로그 특성에 맞는 홍보글을 작성해주세요:
- 상세하고 정보가 풍부한 내용
- 키워드 최적화
- 신뢰성 있는 톤
- 블로그 독자들의 관심을 끌 수 있는 내용
- 500-800자 내외의 상세한 문체
- 카테고리별 분류 고려
`;
        break;
      
      case 'facebook':
        platformPrompt = `
페이스북 특성에 맞는 홍보글을 작성해주세요:
- 커뮤니티 중심의 내용
- 공유하기 좋은 내용
- 지역 기반 정보 강조
- 친근하고 소통하는 톤
- 300-500자 내외의 문체
`;
        break;
      
      default:
        platformPrompt = `
일반적인 홍보글을 작성해주세요:
- 명확하고 간결한 문체
- 핵심 정보 중심
- 200-400자 내외
`;
    }

    const prompt = `
당신은 ${platform} 플랫폼 전문 홍보 콘텐츠 작성자입니다.

가게 분석 정보:
${storeAnalysis}

카테고리 분석 정보:
${categoryAnalysis}

콘텐츠 유형: ${contentTypePrompt}

톤앤매너: ${tonePrompt}

구체적인 홍보 내용:
${content}

SNS 옵션:
- 배경음악 추천: ${snsOptions.backgroundMusic ? '포함' : '미포함'}
- 트렌드 해시태그: ${snsOptions.trendHashtags ? '포함' : '미포함'}
- 지역 키워드: ${snsOptions.localKeywords ? '포함' : '미포함'}

${platformPrompt}

다음 형식으로 응답해주세요:

제목: [매력적인 제목]

본문: [플랫폼에 최적화된 홍보글 내용]

해시태그: [플랫폼에 맞는 해시태그들]

추가 팁: [해당 플랫폼에서 더 효과적인 홍보를 위한 팁]
`;

    const result = await model.generateContent(prompt);
    const promotion = result.response.text();

    res.json({
      success: true,
      platform: platform,
      promotion: promotion,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('홍보글 생성 오류:', error);
    res.status(500).json({ 
      error: '홍보글 생성 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 4단계: 통합 파이프라인 (전체 과정을 한번에)
router.post('/complete-pipeline', authenticateToken, async (req, res) => {
  try {
    const { 
      category,
      basicInfo,
      sns,
      prompt,
      language = 'ko'
    } = req.body;

    if (!category || !basicInfo || !sns || !prompt) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 1단계: 카테고리 분석
    const categoryNames = {
      'food': '음식점/카페',
      'beauty': '뷰티/웰스',
      'retail': '소매업',
      'service': '서비스업',
      'education': '교육/학원',
      'medical': '의료/건강',
      'entertainment': '엔터테인먼트',
      'accommodation': '숙박업',
      'other': '기타'
    };

    const categoryName = categoryNames[category] || category;
    const categoryPrompt = `
카테고리 분석: ${categoryName}
이 업종의 특징, 타겟 고객, 홍보 포인트를 분석해주세요.
`;

    const categoryResult = await model.generateContent(categoryPrompt);
    const categoryAnalysis = categoryResult.response.text();

    // 2단계: 가게 정보 종합 분석
    const storePrompt = `
가게 정보 종합 분석:
- 상호명: ${basicInfo.companyName}
- 업종: ${basicInfo.businessType}
- 주소: ${basicInfo.address}
- 상세주소: ${basicInfo.detailAddress || '없음'}
- 전화번호: ${basicInfo.phone || '없음'}
- 운영시간: ${basicInfo.businessHours || '없음'}
- 가게 소개: ${basicInfo.introduction || '없음'}

카테고리 분석 결과:
${categoryAnalysis}

이 정보를 바탕으로 가게의 핵심 가치, 차별화 요소, 홍보 전략을 분석해주세요.
`;

    const storeResult = await model.generateContent(storePrompt);
    const storeAnalysis = storeResult.response.text();

    // 3단계: 각 플랫폼별 홍보글 생성
    const promotions = {};

    for (const platform of sns.channels) {
      // 콘텐츠 유형별 프롬프트
      let contentTypePrompt = '';
      switch (prompt.contentType) {
        case 'general':
          contentTypePrompt = '일반적인 홍보글을 작성해주세요.';
          break;
        case 'event':
          contentTypePrompt = '이벤트나 할인 정보에 중점을 둔 홍보글을 작성해주세요.';
          break;
        case 'menu':
          contentTypePrompt = '메뉴나 상품 소개에 중점을 둔 홍보글을 작성해주세요.';
          break;
        case 'review':
          contentTypePrompt = '고객 후기나 방문 유도에 중점을 둔 홍보글을 작성해주세요.';
          break;
        case 'trend':
          contentTypePrompt = '계절이나 트렌드를 활용한 홍보글을 작성해주세요.';
          break;
        default:
          contentTypePrompt = '일반적인 홍보글을 작성해주세요.';
      }

      // 톤앤매너별 프롬프트
      let tonePrompt = '';
      switch (prompt.tone) {
        case 'friendly':
          tonePrompt = '친근하고 편안한 톤으로 작성해주세요.';
          break;
        case 'professional':
          tonePrompt = '전문적이고 신뢰감 있는 톤으로 작성해주세요.';
          break;
        case 'trendy':
          tonePrompt = '트렌디하고 세련된 톤으로 작성해주세요.';
          break;
        case 'warm':
          tonePrompt = '따뜻하고 공감되는 톤으로 작성해주세요.';
          break;
        case 'energetic':
          tonePrompt = '활기차고 에너지 넘치는 톤으로 작성해주세요.';
          break;
        default:
          tonePrompt = '친근한 톤으로 작성해주세요.';
      }

      const promotionPrompt = `
${platform} 플랫폼용 홍보글 생성:

카테고리 분석: ${categoryAnalysis}
가게 분석: ${storeAnalysis}
콘텐츠 유형: ${contentTypePrompt}
톤앤매너: ${tonePrompt}
구체적인 홍보 내용: ${prompt.content}
SNS 옵션:
- 배경음악 추천: ${sns.options.backgroundMusic ? '포함' : '미포함'}
- 트렌드 해시태그: ${sns.options.trendHashtags ? '포함' : '미포함'}
- 지역 키워드: ${sns.options.localKeywords ? '포함' : '미포함'}

${platform} 특성에 맞는 홍보글을 작성해주세요.

다음 JSON 형식으로 응답해주세요:
{
  "title": "제목",
  "content": "본문 내용",
  "hashtags": "해시태그들",
  "tips": "추가 팁"
}
`;

      const promotionResult = await model.generateContent(promotionPrompt);
      const promotionText = promotionResult.response.text();
      
      // JSON 파싱 시도
      try {
        const promotionJson = JSON.parse(promotionText);
        promotions[platform] = promotionJson;
      } catch (e) {
        // JSON 파싱 실패 시 텍스트 그대로 저장
        promotions[platform] = {
          title: `${platform} 홍보글`,
          content: promotionText,
          hashtags: "",
          tips: ""
        };
      }
    }

    // 결과물을 데이터베이스에 저장
    const resultData = {
      userId: req.user.id,
      category,
      basicInfo,
      sns,
      prompt,
      language,
      generatedPromotions: promotions,
      paymentInfo: {
        amount: 3000, // 건당 결제 가격
        currency: 'KRW',
        paymentMethod: 'per-use',
        paidAt: new Date()
      },
      categoryAnalysis,
      storeAnalysis,
      status: 'completed'
    };

    const savedResult = await PromotionResult.create(resultData);

    res.json({
      success: true,
      resultId: savedResult._id,
      pipeline: {
        category: category,
        basicInfo: basicInfo,
        sns: sns,
        prompt: prompt,
        categoryAnalysis: categoryAnalysis,
        storeAnalysis: storeAnalysis,
        promotions: promotions,
        channels: sns.channels
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('파이프라인 실행 오류:', error);
    res.status(500).json({ 
      error: '파이프라인 실행 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 5단계: 결과물 저장 (결제 완료 후)
router.post('/save-result', authenticateToken, async (req, res) => {
  try {
    const { 
      category,
      basicInfo,
      sns,
      prompt,
      language,
      generatedPromotions,
      paymentInfo,
      feedbacks = []
    } = req.body;

    if (!category || !basicInfo || !sns || !prompt || !generatedPromotions) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    // 결과물을 데이터베이스에 저장
    const result = {
      userId: req.user.id, // JWT에서 가져온 사용자 ID
      category,
      basicInfo,
      sns,
      prompt,
      language: language || 'ko',
      generatedPromotions,
      paymentInfo,
      feedbacks,
      status: 'completed'
    };

    // MongoDB에 결과물 저장
    const savedResult = await PromotionResult.create(result);

    res.json({
      success: true,
      message: '결과물이 성공적으로 저장되었습니다.',
      resultId: savedResult._id,
      result: savedResult
    });

  } catch (error) {
    console.error('결과물 저장 오류:', error);
    res.status(500).json({ 
      error: '결과물 저장 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 6단계: 결과물 조회
router.get('/result/:resultId', authenticateToken, async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = req.user.id;

    // MongoDB에서 결과물 조회
    const result = await PromotionResult.findOne({ _id: resultId, userId });

    if (!result) {
      return res.status(404).json({ error: '결과물을 찾을 수 없습니다.' });
    }

    res.json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('결과물 조회 오류:', error);
    res.status(500).json({ 
      error: '결과물 조회 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 7단계: 사용자의 모든 결과물 조회
router.get('/my-results', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // MongoDB에서 사용자의 모든 결과물 조회
    const results = await PromotionResult.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('결과물 목록 조회 오류:', error);
    res.status(500).json({ 
      error: '결과물 목록 조회 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 8단계: 결과물 다운로드 (PDF 등)
router.get('/download/:resultId', authenticateToken, async (req, res) => {
  try {
    const { resultId } = req.params;
    const userId = req.user.id;

    // 여기서 결과물을 PDF나 다른 형식으로 변환하여 다운로드 제공
    // 실제 구현에서는 PDF 생성 라이브러리 사용

    res.json({
      success: true,
      message: '다운로드 준비 중입니다.',
      downloadUrl: `/api/promotion/download-file/${resultId}`
    });

  } catch (error) {
    console.error('결과물 다운로드 오류:', error);
    res.status(500).json({ 
      error: '결과물 다운로드 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

module.exports = router;
