import { useNavigate } from 'react-router-dom'
import './ResultPreview.css'
import { useAppState } from './AppStateContext'

function ResultPreview() {
  const navigate = useNavigate()
  const { state } = useAppState()

  const handleEdit = () => {
    navigate('/content-prompt')
  }

  const handlePayment = () => {
    navigate('/payment')
  }

  return (
    <div className="result-preview-hero">
      <div className="hero-inner">
        <h1 className="preview-title">콘텐츠 미리보기</h1>
        <p className="preview-subtitle">입력하신 정보를 바탕으로 생성될 콘텐츠의 예시입니다</p>

        <div className="info-pill">
          <span className="info-dot">i</span>
          실제 생성 시 더욱 정교하고 개성 있는 콘텐츠가 만들어집니다
        </div>

        <div className="preview-callout">
          <h3 className="callout-title">미리보기가 마음에 드시나요?</h3>
          <p className="callout-desc">실제 생성 시에는 더욱 정교하고 개성 있는 콘텐츠를 받아보실 수 있습니다.</p>
          <div className="callout-actions">
            <button className="btn-secondary" onClick={handleEdit}>← 수정하러 가기</button>
            <button className="btn-primary" onClick={handlePayment}>실제 콘텐츠 생성하기</button>
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
