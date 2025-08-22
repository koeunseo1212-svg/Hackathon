import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SnsChannelSelection.css'

function SnsChannelSelection() {
  const navigate = useNavigate()
  const [selectedChannels, setSelectedChannels] = useState([])
  const [additionalOptions, setAdditionalOptions] = useState({
    backgroundMusic: false,
    trendHashtags: false,
    localKeywords: false
  })

  const channels = [
    {
      id: 'naver-blog',
      name: '네이버 블로그',
      icon: 'N',
      description: '검색 노출에 강한 블로그 포스팅',
      features: ['SEO 최적화', '긴 형태 콘텐츠', '이미지 포함']
    },
    {
      id: 'instagram',
      name: '인스타그램',
      icon: '📷',
      description: '시각적 임팩트가 강한 SNS',
      features: ['해시태그 최적화', '이미지 중심', '스토리 활용']
    },
    {
      id: 'facebook',
      name: '페이스북',
      icon: 'f',
      description: '다양한 연령층에게 어필',
      features: ['공유 확산', '이벤트 홍보', '커뮤니티 구축']
    },
    {
      id: 'youtube',
      name: '유튜브',
      icon: '▶️',
      description: '동영상 콘텐츠 및 쇼츠',
      features: ['영상 스크립트', '썸네일 제안', '쇼츠 아이디어']
    },
    {
      id: 'kakao-story',
      name: '카카오스토리',
      icon: '💬',
      description: '지역 커뮤니티 중심',
      features: ['지역 타겟팅', '간편 공유', '친구 추천']
    },
    {
      id: 'tiktok',
      name: '틱톡',
      icon: '🎵',
      description: '젊은 층 타겟 숏폼',
      features: ['트렌드 활용', '챌린지 제안', '음악 추천']
    }
  ]

  const handleChannelClick = (channelId) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelId)) {
        return prev.filter(id => id !== channelId)
      } else {
        return [...prev, channelId]
      }
    })
  }

  const handleOptionChange = (option) => {
    setAdditionalOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  const handleNext = () => {
    if (selectedChannels.length > 0) {
      navigate('/content-prompt')
    }
  }

  const handlePrevious = () => {
    navigate('/basic-info')
  }

  return (
    <div className="sns-channel-page">
      {/* 진행 단계 헤더 */}
      <div className="progress-header">
        <div className="progress-step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">1단계</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step completed">
          <div className="step-icon">✓</div>
          <span className="step-label">2단계</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step active">
          <div className="step-icon">3</div>
          <span className="step-label">3단계</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="step-icon">4</div>
          <span className="step-label">4단계</span>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <div className="content-header">
          <h1 className="main-title">어떤 SNS에 올릴까요?</h1>
          <p className="description">원하는 SNS 플랫폼을 선택해주세요. 여러 개를 선택할 수 있습니다.</p>
        </div>

        {/* SNS 플랫폼 선택 */}
        <div className="sns-grid">
          {channels.map(channel => (
            <div
              key={channel.id}
              className={`sns-card ${selectedChannels.includes(channel.id) ? 'selected' : ''}`}
              onClick={() => handleChannelClick(channel.id)}
            >
              <div className="sns-icon">{channel.icon}</div>
              <h3 className="sns-name">{channel.name}</h3>
              <p className="sns-description">{channel.description}</p>
              <div className="sns-features">
                {channel.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="check-icon">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 추가 옵션 */}
        <div className="additional-options">
          <h3 className="options-title">추가 옵션</h3>
          <div className="options-grid">
            <label className="option-item">
              <input
                type="checkbox"
                checked={additionalOptions.backgroundMusic}
                onChange={() => handleOptionChange('backgroundMusic')}
              />
              <span className="option-text">어울리는 배경음악 추천 (유튜브, 틱톡용)</span>
            </label>
            <label className="option-item">
              <input
                type="checkbox"
                checked={additionalOptions.trendHashtags}
                onChange={() => handleOptionChange('trendHashtags')}
              />
              <span className="option-text">트렌드 해시태그 포함</span>
            </label>
            <label className="option-item">
              <input
                type="checkbox"
                checked={additionalOptions.localKeywords}
                onChange={() => handleOptionChange('localKeywords')}
              />
              <span className="option-text">지역 기반 키워드 추가</span>
            </label>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="navigation-footer">
        <button className="prev-btn" onClick={handlePrevious}>
          이전으로
        </button>
        <button 
          className="next-btn"
          onClick={handleNext}
          disabled={selectedChannels.length === 0}
        >
          다음 단계
        </button>
      </div>
    </div>
  )
}

export default SnsChannelSelection
