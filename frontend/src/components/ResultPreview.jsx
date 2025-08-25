import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ResultPreview.css'
import SummaryBar from './SummaryBar'
import { useAppState } from './AppStateContext'
import GeneratedContent from './GeneratedContent'

function ResultPreview() {
  const navigate = useNavigate()
  const { state, actions } = useAppState()
  const [selectedLanguage, setSelectedLanguage] = useState(state.language || '')
  const [freeRegenerations, setFreeRegenerations] = useState(state.quotas?.freeRegenerations ?? 1)

  const languages = ['영어', '중국어', '일본어']

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(prev => (prev === language ? '' : language));
  };

  const handleRegenerate = () => {
    if (freeRegenerations > 0) {
      setFreeRegenerations(prev => prev - 1)
      actions.useRegeneration()
    }
  }

  const handleEdit = () => {
    navigate('/content-prompt')
  }

  const handlePayment = () => {
    actions.setLanguage(selectedLanguage)
    navigate('/payment')
  }

  return (
    <div className="result-preview-page">
      <SummaryBar
        category={state.category}
        companyName={state.basicInfo?.companyName}
        snsChannels={state.sns?.channels}
        promptText={state.prompt?.content}
        language={state.language}
        onClickCategory={() => navigate('/basic-info')}
        onClickBasic={() => navigate('/basic-info')}
        onClickSns={() => navigate('/sns-channel')}
        onClickPrompt={() => navigate('/content-prompt')}
        onClickLanguage={() => {}}
      />
      <div className="preview-container">
        <div className="left-section">
          <h1 className="main-title">결과 미리보기</h1>
          
          <div className="language-section">
            <p className="language-question">다국어 버전이 필요하신가요? (선택)</p>
            <div className="language-buttons">
  <button
    className={`language-btn ${selectedLanguage === '' ? 'selected' : ''}`}
    onClick={() => setSelectedLanguage('')}
  >
    선택 안함
  </button>

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
                  <GeneratedContent type="instagram" state={state} language={selectedLanguage} />
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
                  <GeneratedContent type="naver-blog" state={state} language={selectedLanguage} />
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
