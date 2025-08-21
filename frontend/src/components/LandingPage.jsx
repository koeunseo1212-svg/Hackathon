import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    // 로그인이 필요한 서비스이므로 로그인 페이지로 이동
    navigate('/login')
  }

  const handleLearnMore = () => {
    // 서비스 알아보기 로직
    console.log('서비스 알아보기 클릭')
  }

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="nav-logo">AI 홍보 서비스</div>
        <div className="nav-links">
          <a href="#" className="nav-link">서비스 특징</a>
          <a href="#" className="nav-link">이용 방법</a>
          <a href="#" className="nav-link">오늘안내</a>
        </div>
        <div className="nav-auth">
          <button className="login-btn" onClick={() => navigate('/login')}>로그인</button>
          <button className="signup-btn">회원가입</button>
        </div>
      </nav>

      <div className="landing-content">
        <div className="hero-section">
          <div className="hero-badge">AI 기반 자동 콘텐츠 생성</div>
          <h1 className="main-title">
            AI로 완성하는<br />
            <span className="highlight">맞춤형 홍보 콘텐츠</span>
          </h1>
          <p className="description">
            네이버 블로그, 인스타그램 등 다양한 SNS 플랫폼에 맞는 홍보 글을 AI가 자동으로 생성해드립니다.<br />
            가게 정보만 입력하면 전문적인 콘텐츠가 완성됩니다.
          </p>
          
          <div className="button-group">
            <button className="start-btn" onClick={handleStart}>
              무료로 시작하기
            </button>
            <button className="learn-more-btn" onClick={handleLearnMore}>
              서비스 알아보기
            </button>
          </div>
        </div>

        <div className="features">
          <div className="feature-item">
            <span className="check-icon">✓</span>
            무료 체험 2회
          </div>
          <div className="feature-item">
            <span className="check-icon">✓</span>
            다중 플랫폼 지원
          </div>
          <div className="feature-item">
            <span className="check-icon">✓</span>
            즉시 이용 가능
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
