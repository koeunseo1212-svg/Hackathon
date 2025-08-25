import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './BasicInfoForm.css'
import { useAppState } from './AppStateContext'
import SummaryBar from './SummaryBar'

function BasicInfoForm() {
  const navigate = useNavigate()
  const { state, actions } = useAppState()
  const [formData, setFormData] = useState({
    companyName: '',      // 상호명
    businessType: '',     // 업종
    address: '',         // 주소
    detailAddress: '',   // 상세주소
    phone: '',          // 전화번호
    businessHours: '',   // 운영시간
    introduction: ''     // 가게 소개
  })

  useEffect(() => {
    if (state.basicInfo) {
      setFormData(prev => ({ ...prev, ...state.basicInfo }))
    }
  }, [state.basicInfo])

  // 필수 필드 유효성 검사
  const validateField = (name, value) => {
    switch (name) {
      case 'companyName':
        return value.trim().length > 0;
      case 'businessType':
        return value.trim().length > 0;
      case 'address':
        return value.trim().length > 0;
      case 'phone':
        // 전화번호 형식 검사 (숫자와 하이픈만 허용)
        return /^[\d-]{9,}$/.test(value.trim());
      case 'introduction':
        return value.trim().length >= 10; // 최소 10자 이상
      default:
        return true;
    }
  }

  const [fieldErrors, setFieldErrors] = useState({
    companyName: false,
    businessType: false,
    address: false,
    phone: false,
    introduction: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 입력 필드의 유효성을 실시간으로 검사
    setFieldErrors(prev => ({
      ...prev,
      [name]: !validateField(name, value)
    }));
  };

  const handleNext = () => {
    // 모든 필수 필드의 유효성 검사
    const isValid = ['companyName', 'businessType', 'address', 'phone', 'introduction']
      .every(field => validateField(field, formData[field]));

    if (isValid) {
      actions.setBasicInfo(formData)
      navigate('/sns-channel');
    } else {
      // 모든 필드의 유효성 상태 업데이트
      const newErrors = {};
      ['companyName', 'businessType', 'address', 'phone', 'introduction'].forEach(field => {
        newErrors[field] = !validateField(field, formData[field]);
      });
      setFieldErrors(newErrors);
    }
  };

  const isFormValid = ['companyName', 'businessType', 'address', 'phone', 'introduction']
    .every(field => validateField(field, formData[field]));

  return (
    <div className="basic-info-page">
      <div className="progress-header">
        <div className="progress-step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">카테고리 설정</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step active">
          <div className="step-icon">2</div>
          <span className="step-label">가게 정보</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="step-icon">3</div>
          <span className="step-label">SNS 선택</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="step-icon">4</div>
          <span className="step-label">콘텐츠 생성</span>
        </div>
      </div>

      <SummaryBar
        category={state.category}
        companyName={undefined}
        snsChannels={undefined}
        promptText={undefined}
        language={undefined}
        onClickCategory={() => navigate('/category')}
      />

      <div className="main-content">
        <h1 className="section-title">가게 정보를 입력해주세요</h1>
        <p className="subtitle">정확한 정보를 입력할수록 더 좋은 홍보 콘텐츠가 만들어집니다.</p>

        <div className="form-container">
          <form className="info-form">
            <div className="form-section">
              <h2>기본 정보</h2>
              <div className="form-group">
                <label htmlFor="companyName">상호명 <span className="required">*</span></label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="예: 맛있는 카페"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessType">업종 <span className="required">*</span></label>
                <input
                  type="text"
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  placeholder="예: 카페, 레스토랑, 미용실"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h2>위치 정보</h2>
              <div className="form-group">
                <label htmlFor="address">주소 <span className="required">*</span></label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="예: 서울시 성남구 대예로 123"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="detailAddress">상세 주소</label>
                <input
                  type="text"
                  id="detailAddress"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                  placeholder="예: 1층 101호"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>연락처 정보</h2>
              <div className="form-group">
                <label htmlFor="phone">전화번호 <span className="required">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="예: 02-1234-5678"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessHours">운영시간</label>
                <input
                  type="text"
                  id="businessHours"
                  name="businessHours"
                  value={formData.businessHours}
                  onChange={handleInputChange}
                  placeholder="예: 평일 09:00-18:00, 주말 10:00-17:00"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>가게 소개 및 특징</h2>
              <div className="form-group">
                <label htmlFor="introduction">가게 소개 및 특징 <span className="required">*</span></label>
                <textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={handleInputChange}
                  placeholder="가게만의 특별한 점, 대표 메뉴, 서비스 등을 자유롭게 작성해주세요. (최대 500자)"
                  rows="4"
                  maxLength={500}
                  required
                />
                <div className="char-count">{formData.introduction.length}/500</div>
              </div>
            </div>

            <div className="navigation-buttons">
              <button 
                type="button" 
                className="prev-btn"
                onClick={() => navigate('/category')}
              >
                이전으로
              </button>
              <button 
                type="button"
                className="next-btn"
                onClick={handleNext}
                disabled={!isFormValid}
              >
                다음 단계
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoForm
