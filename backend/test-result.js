const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testResultAPIs() {
  try {
    console.log('🚀 결과물 API 테스트 시작...\n');

    // 1️⃣ 로그인하여 토큰 획득
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

    // 2️⃣ 통합 파이프라인 실행하여 결과물 생성 (자동 저장)
    console.log('2️⃣ 통합 파이프라인 실행');
    const completeData = {
      category: 'food',
      basicInfo: {
        companyName: '맛있는 카페',
        businessType: '카페',
        address: '서울특별시 강남구 테헤란로 123',
        detailAddress: '456빌딩 1층',
        phone: '02-1234-5678',
        businessHours: '07:00-22:00',
        introduction: '신선한 원두로 내린 커피와 수제 케이크를 제공하는 따뜻한 카페입니다.'
      },
      sns: {
        channels: ['instagram', 'naver-blog'],
        options: {
          backgroundMusic: false,
          trendHashtags: true,
          localKeywords: true
        }
      },
      prompt: {
        contentType: 'event',
        tone: 'friendly',
        content: '이번 주에 신메뉴 딸기 라떼를 출시했어요! 첫 주문 시 10% 할인 이벤트도 진행 중입니다.'
      },
      language: 'ko'
    };

    const completeResponse = await axios.post(`${BASE_URL}/promotion/complete-pipeline`, completeData, { headers });
    const resultId = completeResponse.data.resultId;
    console.log('✅ 통합 파이프라인 완료, 결과물 ID:', resultId);
    console.log('생성된 홍보글:', completeResponse.data.pipeline.promotions);
    console.log('');

    // 3️⃣ 결과물 조회
    console.log('3️⃣ 결과물 조회');
    const resultResponse = await axios.get(`${BASE_URL}/promotion/result/${resultId}`, { headers });
    console.log('✅ 결과물 조회 완료');
    console.log('결과물 정보:', {
      category: resultResponse.data.result.category,
      companyName: resultResponse.data.result.basicInfo.companyName,
      channels: resultResponse.data.result.sns.channels,
      status: resultResponse.data.result.status
    });
    console.log('');

    // 4️⃣ 사용자의 모든 결과물 조회
    console.log('4️⃣ 사용자의 모든 결과물 조회');
    const myResultsResponse = await axios.get(`${BASE_URL}/promotion/my-results`, { headers });
    console.log('✅ 결과물 목록 조회 완료');
    console.log('총 결과물 수:', myResultsResponse.data.results.length);
    myResultsResponse.data.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.basicInfo.companyName} (${result.category}) - ${result.status}`);
    });
    console.log('');

    // 5️⃣ 결과물 다운로드 준비
    console.log('5️⃣ 결과물 다운로드 준비');
    const downloadResponse = await axios.get(`${BASE_URL}/promotion/download/${resultId}`, { headers });
    console.log('✅ 다운로드 준비 완료');
    console.log('다운로드 URL:', downloadResponse.data.downloadUrl);
    console.log('');

    console.log('🎉 모든 결과물 API 테스트가 성공적으로 완료되었습니다!');

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.response?.data || error.message);
  }
}

testResultAPIs();
