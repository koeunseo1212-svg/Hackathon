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

    // 2️⃣ 통합 파이프라인 실행하여 결과물 생성
    console.log('2️⃣ 통합 파이프라인 실행');
    const completeData = {
      industry: '카페',
      storeName: '스타벅스 강남점',
      address: '서울특별시 강남구 테헤란로 123',
      detailedAddress: '456빌딩 1층',
      phoneNumber: '02-1234-5678',
      operatingHours: '07:00-22:00',
      platforms: ['instagram', 'naver-blog'],
      contentType: 'event-promotion',
      toneAndManner: 'friendly',
      promotionDetails: '신메뉴 출시 이벤트, 20% 할인 혜택',
      additionalInfo: '신메뉴 출시 예정, 친환경 포장재 사용'
    };

    const completeResponse = await axios.post(`${BASE_URL}/promotion/complete-pipeline`, completeData, { headers });
    const resultId = completeResponse.data.resultId;
    console.log('✅ 통합 파이프라인 완료, 결과물 ID:', resultId);
    console.log('');

    // 3️⃣ 결과물 조회
    console.log('3️⃣ 결과물 조회');
    const resultResponse = await axios.get(`${BASE_URL}/promotion/result/${resultId}`, { headers });
    console.log('✅ 결과물 조회 완료');
    console.log('결과물 정보:', {
      industry: resultResponse.data.result.industry,
      storeName: resultResponse.data.result.storeInfo.storeName,
      platforms: resultResponse.data.result.platforms,
      status: resultResponse.data.result.status
    });
    console.log('');

    // 4️⃣ 사용자의 모든 결과물 조회
    console.log('4️⃣ 사용자의 모든 결과물 조회');
    const myResultsResponse = await axios.get(`${BASE_URL}/promotion/my-results`, { headers });
    console.log('✅ 결과물 목록 조회 완료');
    console.log('총 결과물 수:', myResultsResponse.data.results.length);
    myResultsResponse.data.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.storeInfo.storeName} (${result.industry}) - ${result.status}`);
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
