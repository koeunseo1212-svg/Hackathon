import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SnsChannelSelection.css'

function SnsChannelSelection() {
  const navigate = useNavigate()
  const [selectedChannels, setSelectedChannels] = useState([])

  const channels = [
    { id: 'naver-blog', name: '네이버 블로그', color: '#03c75a' },
    { id: 'instagram', name: '인스타그램', color: '#E4405F' }
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

  const handleNext = () => {
    if (selectedChannels.length > 0) {
      navigate('/content-prompt')
    }
  }

  return (
    <div className="sns-channel-page">
      <div className="channel-container">
        <div className="left-section">
          <h1 className="main-title">SNS 채널 선택</h1>
          <p className="description">채널별 최적화된 콘텐츠 자동 생성</p>
        </div>
        
        <div className="right-section">
          <h2 className="section-title">SNS 채널 선택</h2>
          <div className="channel-grid">
            {channels.map(channel => (
              <button
                key={channel.id}
                className={`channel-btn ${selectedChannels.includes(channel.id) ? 'selected' : ''}`}
                onClick={() => handleChannelClick(channel.id)}
                style={{
                  '--channel-color': channel.color
                }}
              >
                {channel.name}
              </button>
            ))}
          </div>
          
          <button 
            className="next-btn"
            onClick={handleNext}
            disabled={selectedChannels.length === 0}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}

export default SnsChannelSelection
