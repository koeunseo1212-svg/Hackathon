import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ResultPreview.css'

function ResultPreview() {
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [freeRegenerations, setFreeRegenerations] = useState(1)

  const languages = ['영어', '중국어', '일본어']

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
  }

  const handleRegenerate = () => {
    if (freeRegenerations > 0) {
      setFreeRegenerations(prev => prev - 1)
      // 재생성 로직 구현
      console.log('콘텐츠 재생성')
    }
  }

  const handleEdit = () => {
    navigate('/content-prompt')
  }

  const handlePayment = () => {
    navigate('/payment')
  }

  return (
    <div className="result-preview-page">
      <div className="preview-container">
        <div className="left-section">
          <h1 className="main-title">결과 미리보기</h1>
          
          <div className="language-section">
            <p className="language-question">다국어 버전이 필요하신가요? (선택)</p>
            <div className="language-buttons">
              {languages.map(language => (
                <button
                  key={language}
                  className={`language-btn ${selectedLanguage === language ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(language)}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="regenerate-btn"
              onClick={handleRegenerate}
              disabled={freeRegenerations === 0}
            >
              다시 생성하기({freeRegenerations}회 무료)
            </button>
            <button className="edit-btn" onClick={handleEdit}>
              수정하기
            </button>
          </div>
        </div>
        
        <div className="right-section">
          <div className="preview-cards">
            <div className="preview-card instagram">
              <h3 className="card-title">인스타</h3>
              <p className="card-subtitle">미리보기 이미지</p>
              <div className="preview-content">
                <div className="image-placeholder">
                  <span>이미지 미리보기</span>
                </div>
                <div className="text-content">
                  <p>캡션 + 해시태그</p>
                </div>
              </div>
            </div>

            <div className="preview-card naver-blog">
              <h3 className="card-title">네이버 블로그</h3>
              <p className="card-subtitle">본문 + 가게 주소 링크</p>
              <div className="preview-content">
                <div className="image-placeholder">
                  <span>본문 미리보기</span>
                </div>
                <div className="text-content">
                  <button className="download-copy-btn">다운로드/복사 버튼</button>
                </div>
              </div>
            </div>
          </div>

          <button className="payment-btn" onClick={handlePayment}>
            결제 진행
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultPreview
