import { useNavigate } from 'react-router-dom'
import './Completion.css'

function Completion() {
  const navigate = useNavigate()

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

  return (
    <div className="completion-page">
      <div className="completion-container">
        <div className="completion-content">
          <h1 className="main-title">완료</h1>
          <p className="completion-message">콘텐츠 생성이 완료되었습니다.</p>
          
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
