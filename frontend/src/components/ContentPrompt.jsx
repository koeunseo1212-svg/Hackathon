import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ContentPrompt.css'
import SummaryBar from './SummaryBar'
import { useAppState } from './AppStateContext'

function ContentPrompt() {
  const navigate = useNavigate()
  const { state, actions } = useAppState()
  const [formData, setFormData] = useState({
    contentType: 'general',
    tone: 'friendly',
    content: ''
  })

  useEffect(() => {
    if (state.prompt) {
      setFormData(prev => ({ ...prev, ...state.prompt }))
    }
  }, [])

  const contentTypes = [
    {
      id: 'general',
      name: '일반 홍보',
      description: '가게 소개 및 일반적인 홍보'
    },
    {
      id: 'event',
      name: '이벤트/할인',
      description: '특별 이벤트나 할인 정보'
    },
    {
      id: 'menu',
      name: '메뉴/상품 소개',
      description: '신메뉴나 인기 상품 소개'
    },
    {
      id: 'review',
      name: '후기 유도',
      description: '고객 후기나 방문 유도'
    },
    {
      id: 'trend',
      name: '계절/트렌드',
      description: '계절 맞춤이나 트렌드 활용'
    }
  ]

  const tones = [
    {
      id: 'friendly',
      name: '친근한',
      emoji: '😊'
    },
    {
      id: 'professional',
      name: '전문적인',
      emoji: '💼'
    },
    {
      id: 'trendy',
      name: '트렌디한',
      emoji: '✨'
    },
    {
      id: 'warm',
      name: '따뜻한',
      emoji: '🥰'
    },
    {
      id: 'energetic',
      name: '활기찬',
      emoji: '⚡'
    }
  ]

  const handleContentTypeSelect = (typeId) => {
    setFormData(prev => ({
      ...prev,
      contentType: typeId
    }))
  }

  const handleToneSelect = (toneId) => {
    setFormData(prev => ({
      ...prev,
      tone: toneId
    }))
  }

  const handleContentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.value
    }))
  }

  const handleGenerate = () => {
    if (formData.content.trim().length >= 10) {
      actions.setPrompt(formData)
      actions.useGeneration()
      navigate('/preview')
    }
  }

  const handlePrevious = () => {
    navigate('/sns-channel')
  }

  const charCount = formData.content.length
  const isContentValid = charCount >= 10

  return (
    <div className="content-prompt-page">
      {/* 진행 단계 헤더 */}
      <div className="progress-header">
        <div className="progress-step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">카테고리 설정</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">가게 정보</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">SNS 선택</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step active">
          <div className="step-icon">4</div>
          <span className="step-label">콘텐츠 생성</span>
        </div>
      </div>

      <SummaryBar
        category={state.category}
        companyName={state.basicInfo?.companyName}
        snsChannels={state.sns?.channels}
        promptText={undefined}
        language={undefined}
        onClickCategory={() => navigate('/basic-info')}
        onClickBasic={() => navigate('/basic-info')}
        onClickSns={() => navigate('/sns-channel')}
      />

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <div className="content-header">
          <h1 className="main-title">홍보 콘텐츠를 생성해보세요!</h1>
          <p className="description">어떤 내용으로 홍보하고 싶은지 자세히 적어주세요.</p>
        </div>

        {/* 콘텐츠 유형 선택 */}
        <div className="content-type-section">
          <h3 className="section-title">콘텐츠 유형</h3>
          <div className="content-type-grid">
            {contentTypes.map(type => (
              <div
                key={type.id}
                className={`content-type-card ${formData.contentType === type.id ? 'selected' : ''}`}
                onClick={() => handleContentTypeSelect(type.id)}
              >
                <h4 className="type-name">{type.name}</h4>
                <p className="type-description">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 글의 톤앤매너 선택 */}
        <div className="tone-section">
          <h3 className="section-title">글의 톤앤매너</h3>
          <div className="tone-grid">
            {tones.map(tone => (
              <div
                key={tone.id}
                className={`tone-card ${formData.tone === tone.id ? 'selected' : ''}`}
                onClick={() => handleToneSelect(tone.id)}
              >
                <div className="tone-emoji">{tone.emoji}</div>
                <span className="tone-name">{tone.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 구체적인 홍보 내용 입력 */}
        <div className="content-input-section">
          <h3 className="section-title">
            구체적인 홍보 내용 <span className="required">*</span>
          </h3>
          <div className="content-input-container">
            <textarea
              className="content-textarea"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="예: 이번 주에 신메뉴 '딸기 라떼'를 출시했어요. 달콤한 딸기와 부드러운 우유의 조화가 환상적입니다. 첫 주문 시 10% 할인 이벤트도 진행 중이에요. 많은 관심 부탁드립니다!"
              rows="6"
            />
            <div className="input-footer">
              <span className="char-limit">최소 10자 이상 입력해주세요</span>
              <span className="char-count">{charCount}/500</span>
            </div>
          </div>
        </div>

        {/* AI 콘텐츠 생성 버튼 */}
        <div className="generate-section">
          <button 
            className={`generate-btn ${isContentValid ? 'active' : 'disabled'}`}
            onClick={handleGenerate}
            disabled={!isContentValid}
          >
            <span className="cloud-icon">☁️</span>
            AI 콘텐츠 생성하기 (무료 2회 남음)
          </button>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="navigation-buttons">
          <button className="prev-btn" onClick={handlePrevious}>
            이전으로
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContentPrompt