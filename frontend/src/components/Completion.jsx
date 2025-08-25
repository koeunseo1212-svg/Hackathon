import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Completion.css'

function Completion() {
  const navigate = useNavigate()
  const location = useLocation()
  const [finalResult, setFinalResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // URL 파라미터에서 resultId 가져오기
  const resultId = new URLSearchParams(location.search).get('resultId')

  useEffect(() => {
    if (resultId) {
      fetchFinalResult()
    } else {
      setIsLoading(false)
    }
  }, [resultId])

  const fetchFinalResult = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/promotion/result/${resultId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFinalResult(data.result)
      }
    } catch (error) {
      console.error('결과물 조회 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareToSns = () => {
    // SNS 공유 로직 구현
    console.log('SNS로 공유')
  }

  const handleSave = () => {
    // 저장 로직 구현
    console.log('콘텐츠 저장')
  }

  const handleCreateNew = () => {
    navigate('/category')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('클립보드에 복사되었습니다!')
  }

  if (isLoading) {
    return (
      <div className="completion-page">
        <div className="completion-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>결과물을 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="completion-page">
      <div className="completion-container">
        <div className="completion-content">
          <h1 className="main-title">🎉 완료!</h1>
          <p className="completion-message">AI 홍보 콘텐츠 생성이 완료되었습니다.</p>
          
          {finalResult && (
            <div className="final-result-container">
              <div className="result-header">
                <h2>생성된 홍보 콘텐츠</h2>
                <p className="result-subtitle">
                  {finalResult.basicInfo?.companyName} - {finalResult.category}
                </p>
              </div>

              {Object.entries(finalResult.generatedPromotions).map(([platform, content]) => (
                <div key={platform} className="platform-result">
                  <div className="platform-title">
                    <h3>{platform === 'instagram' ? '📷 인스타그램' : '📝 네이버 블로그'}</h3>
                  </div>
                  
                  <div className="content-result">
                    <div className="content-block">
                      <h4>제목</h4>
                      <div className="content-text">
                        <p>{content.title}</p>
                        <button 
                          onClick={() => copyToClipboard(content.title)}
                          className="copy-btn"
                        >
                          복사
                        </button>
                      </div>
                    </div>
                    
                    <div className="content-block">
                      <h4>본문</h4>
                      <div className="content-text">
                        <p>{content.content}</p>
                        <button 
                          onClick={() => copyToClipboard(content.content)}
                          className="copy-btn"
                        >
                          복사
                        </button>
                      </div>
                    </div>
                    
                    {content.hashtags && (
                      <div className="content-block">
                        <h4>해시태그</h4>
                        <div className="content-text">
                          <p>{content.hashtags}</p>
                          <button 
                            onClick={() => copyToClipboard(content.hashtags)}
                            className="copy-btn"
                          >
                            복사
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {content.tips && (
                      <div className="content-block">
                        <h4>추가 팁</h4>
                        <div className="content-text">
                          <p>{content.tips}</p>
                          <button 
                            onClick={() => copyToClipboard(content.tips)}
                            className="copy-btn"
                          >
                            복사
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="action-buttons">
            <button className="share-btn" onClick={handleShareToSns}>
              SNS로 공유
            </button>
            <button className="save-btn" onClick={handleSave}>
              저장
            </button>
          </div>
          
          <button className="create-new-btn" onClick={handleCreateNew}>
            다른 콘텐츠 만들기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Completion
