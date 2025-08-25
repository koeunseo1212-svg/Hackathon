import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './ResultPreview.css'
import { useAppState } from './AppStateContext'

function ResultPreview() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [generatedContent, setGeneratedContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // AI 콘텐츠 생성 함수
  const generateContent = async () => {
    setIsLoading(true)
    setError(null)
    
    // 인증 토큰 확인
    const token = localStorage.getItem('token')
    if (!token) {
      setError('로그인이 필요합니다. 먼저 로그인해주세요.')
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/promotion/complete-pipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: state.category,
          basicInfo: state.basicInfo,
          sns: state.sns,
          prompt: state.prompt,
          language: state.language || 'ko'
        })
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError('인증이 만료되었습니다. 다시 로그인해주세요.')
        } else if (response.status === 404) {
          setError('요청한 엔드포인트를 찾을 수 없습니다.')
        } else {
          setError(`서버 오류가 발생했습니다. (${response.status})`)
        }
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setGeneratedContent(data.pipeline)
      } else {
        setError(data.error || '콘텐츠 생성에 실패했습니다.')
      }
    } catch (err) {
      console.error('API 요청 오류:', err)
      setError('서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  // 컴포넌트 마운트 시 자동으로 콘텐츠 생성
  useEffect(() => {
    // 필요한 데이터가 모두 있는지 확인
    if (state.category && state.basicInfo && state.sns && state.prompt) {
      generateContent()
    } else {
      // 필요한 데이터가 없으면 에러 메시지 표시
      setError('필요한 정보가 누락되었습니다. 이전 단계에서 모든 정보를 입력해주세요.')
      setIsLoading(false)
    }
  }, [])

  const handleEdit = () => {
    navigate('/content-prompt')
  }

  const handlePayment = () => {
    navigate('/payment')
  }

  const handleRegenerate = () => {
    generateContent()
  }

  return (
    <div className="result-preview-hero">
      <div className="hero-inner">
        <h1 className="preview-title">콘텐츠 미리보기</h1>
        <p className="preview-subtitle">입력하신 정보를 바탕으로 생성된 콘텐츠입니다</p>

        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>AI가 콘텐츠를 생성하고 있습니다...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={handleRegenerate} className="retry-btn">다시 시도</button>
          </div>
        )}

        {generatedContent && (
          <div className="generated-content-container">
            <div className="content-header">
              <h3>생성된 홍보 콘텐츠</h3>
              <button onClick={handleRegenerate} className="regenerate-btn">🔄 다시 생성</button>
            </div>

            {Object.entries(generatedContent.promotions).map(([platform, content]) => (
              <div key={platform} className="platform-content">
                <div className="platform-header">
                  <h4>{platform === 'instagram' ? '📷 인스타그램' : '📝 네이버 블로그'}</h4>
                </div>
                
                <div className="content-card">
                  <div className="content-section">
                    <h5>제목</h5>
                    <p className="content-title">{content.title}</p>
                  </div>
                  
                  <div className="content-section">
                    <h5>본문</h5>
                    <p className="content-body">{content.content}</p>
                  </div>
                  
                  {content.hashtags && (
                    <div className="content-section">
                      <h5>해시태그</h5>
                      <p className="content-hashtags">{content.hashtags}</p>
                    </div>
                  )}
                  
                  {content.tips && (
                    <div className="content-section">
                      <h5>추가 팁</h5>
                      <p className="content-tips">{content.tips}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="info-pill">
          <span className="info-dot">i</span>
          실제 생성 시 더욱 정교하고 개성 있는 콘텐츠가 만들어집니다
        </div>

        <div className="preview-callout">
          <h3 className="callout-title">생성된 콘텐츠가 마음에 드시나요?</h3>
          <p className="callout-desc">결제 후 최종 결과물을 받아보실 수 있습니다.</p>
          <div className="callout-actions">
            <button className="btn-secondary" onClick={handleEdit}>← 수정하러 가기</button>
            <button className="btn-primary" onClick={handlePayment}>결제하고 최종 결과물 받기</button>
          </div>
        </div>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">✨</div>
            <h4 className="benefit-title">개성 있는 콘텐츠</h4>
            <p className="benefit-desc">가게만의 특색이 담긴 독창적인 콘텐츠를 생성합니다</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h4 className="benefit-title">플랫폼 최적화</h4>
            <p className="benefit-desc">각 SNS 플랫폼 특성에 맞게 최적화된 형태로 제작됩니다</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">✏️</div>
            <h4 className="benefit-title">자유로운 편집</h4>
            <p className="benefit-desc">생성된 후에도 언제든 수정하고 개선할 수 있습니다</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPreview
