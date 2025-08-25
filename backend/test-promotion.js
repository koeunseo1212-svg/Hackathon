const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testPromotionPipeline() {
  try {
    console.log('🚀 프롬프트 파이프라인 테스트 시작...\n');

    // 먼저 로그인하여 토큰 획득
    console.log('1️⃣ 로그인하여 토큰 획득');
    const loginData = {
      email: 'test@example.com',
      password: 'Test123!'
    };

    let token;
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, loginData);
      token = loginResponse.data.token;
      console.log('✅ 로그인 성공, 토큰 획득');
    } catch (error) {
      // 로그인 실패 시 회원가입
      console.log('⚠️ 로그인 실패, 회원가입 시도');
      const registerData = {
        name: '테스트',
        email: 'test@example.com',
        password: 'Test123!',
        confirmPassword: 'Test123!'
      };
      
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
      token = registerResponse.data.token;
      console.log('✅ 회원가입 성공, 토큰 획득');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('');

    // 2단계: 업종 분석
    console.log('2️⃣ 업종 분석');
    const industryData = {
      industry: '카페'
    };

    const industryResponse = await axios.post(`${BASE_URL}/promotion/analyze-industry`, industryData, { headers });
    console.log('✅ 업종 분석 완료');
    console.log('분석 결과:', industryResponse.data.analysis);
    console.log('');

    // 3단계: 가게 정보 분석
    console.log('3️⃣ 가게 정보 분석');
    const storeData = {
      storeName: '스타벅스 강남점',
      industry: '카페',
      address: '서울특별시 강남구 테헤란로 123',
      detailedAddress: '456빌딩 1층',
      phoneNumber: '02-1234-5678',
      operatingHours: '07:00-22:00',
      industryAnalysis: industryResponse.data.analysis
    };

    const storeResponse = await axios.post(`${BASE_URL}/promotion/analyze-store-info`, storeData, { headers });
    console.log('✅ 가게 정보 분석 완료');
    console.log('분석 결과:', storeResponse.data.analysis);
    console.log('');

    // 4단계: 인스타그램 홍보글 생성
    console.log('4️⃣ 인스타그램 홍보글 생성');
    const instagramData = {
      platform: 'instagram',
      storeAnalysis: storeResponse.data.analysis,
      industryAnalysis: industryResponse.data.analysis,
      contentType: 'event-promotion',
      toneAndManner: 'friendly',
      promotionDetails: '신메뉴 출시 이벤트, 20% 할인 혜택',
      additionalInfo: '신메뉴 출시 예정, 친환경 포장재 사용'
    };

    const instagramResponse = await axios.post(`${BASE_URL}/promotion/generate-promotion`, instagramData, { headers });
    console.log('✅ 인스타그램 홍보글 생성 완료');
    console.log('홍보글:', instagramResponse.data.promotion);
    console.log('');

    // 5단계: 네이버 블로그 홍보글 생성
    console.log('5️⃣ 네이버 블로그 홍보글 생성');
    const blogData = {
      platform: 'naver-blog',
      storeAnalysis: storeResponse.data.analysis,
      industryAnalysis: industryResponse.data.analysis,
      contentType: 'brand-story',
      toneAndManner: 'professional',
      promotionDetails: '브랜드 스토리와 신메뉴 소개',
      additionalInfo: '신메뉴 출시 예정, 친환경 포장재 사용'
    };

    const blogResponse = await axios.post(`${BASE_URL}/promotion/generate-promotion`, blogData, { headers });
    console.log('✅ 네이버 블로그 홍보글 생성 완료');
    console.log('홍보글:', blogResponse.data.promotion);
    console.log('');

    // 6단계: 통합 파이프라인 테스트
    console.log('6️⃣ 통합 파이프라인 테스트');
    const completeData = {
      industry: '카페',
      storeName: '스타벅스 강남점',
      address: '서울특별시 강남구 테헤란로 123',
      detailedAddress: '456빌딩 1층',
      phoneNumber: '02-1234-5678',
      operatingHours: '07:00-22:00',
      platforms: ['instagram', 'naver-blog', 'facebook'],
      contentType: 'event-promotion',
      toneAndManner: 'energetic',
      promotionDetails: '신메뉴 출시 이벤트, 20% 할인 혜택, 친환경 포장재 사용',
      additionalInfo: '신메뉴 출시 예정, 친환경 포장재 사용, 24시간 주차 가능'
    };

    const completeResponse = await axios.post(`${BASE_URL}/promotion/complete-pipeline`, completeData, { headers });
    console.log('✅ 통합 파이프라인 완료');
    console.log('결과 요약:');
    console.log('- 업종:', completeResponse.data.pipeline.industry);
    console.log('- 가게명:', completeResponse.data.pipeline.storeInfo.storeName);
    console.log('- 생성된 플랫폼:', completeResponse.data.pipeline.platforms);
    console.log('- 생성 시간:', completeResponse.data.generatedAt);
    console.log('');

    console.log('🎉 모든 테스트가 성공적으로 완료되었습니다!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.response?.data || error.message);
  }
}

testPromotionPipeline();
