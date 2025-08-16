import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BasicInfoForm.css'

function BasicInfoForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    introduction: '',
    userInfo: '',
    representativeMenu: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    // 모든 필수 필드가 입력되었는지 확인
    if (formData.companyName && formData.address && formData.introduction) {
      navigate('/sns-channel')
    }
  }

  const isFormValid = formData.companyName && formData.address && formData.introduction

  return (
    <div className="basic-info-page">
      <div className="form-container">
        <div className="left-section">
          <h1 className="main-title">기본정보 입력</h1>
        </div>
        
        <div className="right-section">
          <form className="info-form">
            <div className="form-group">
              <label htmlFor="companyName">상호명</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="상호명을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">주소</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="예시) 강원도 강릉시 금성로 21 성남동"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="introduction">소개</label>
              <textarea
                id="introduction"
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                placeholder="가게 또는 제품에 대한 설명"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="userInfo">사용자 정보</label>
              <input
                type="text"
                id="userInfo"
                name="userInfo"
                value={formData.userInfo}
                onChange={handleInputChange}
                placeholder="예시) 이름, 전화번호 010-1234-5678"
              />
            </div>

            <div className="form-group">
              <label htmlFor="representativeMenu">대표 메뉴/상품</label>
              <input
                type="text"
                id="representativeMenu"
                name="representativeMenu"
                value={formData.representativeMenu}
                onChange={handleInputChange}
                placeholder="콤마로 구분하여 입력하세요"
              />
            </div>

            <button 
              type="button"
              className="next-btn"
              onClick={handleNext}
              disabled={!isFormValid}
            >
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoForm
