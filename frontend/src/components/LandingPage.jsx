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
          <a href="#features" className="nav-link">서비스 특징</a>
          <a href="#howto" className="nav-link">이용 방법</a>
          <a href="#cta" className="nav-link">오늘안내</a>
        </div>
        <div className="nav-auth">
          <button className="login-btn" onClick={() => navigate('/login')}>로그인</button>
          <button className="signup-btn" onClick={() => navigate('/signup')}>회원가입</button>
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
        {/* 왜 AI 홍보 서비스를 선택해야 할까요? */}
        <section id="features" className="why-section">
          <h2 className="section-heading">왜 AI 홍보 서비스를 선택해야 할까요?</h2>
          <p className="section-subheading">전문 마케터 수준의 콘텐츠를 누구나 쉽게 만들 수 있습니다</p>
          <div className="cards-grid">
            <div className="info-card">
              <div className="card-icon">⭐</div>
              <h3 className="card-title">AI 자동 생성</h3>
              <p className="card-desc">업종과 내용만 입력하면 AI가 완벽한 홍보 콘텐츠를 자동으로 생성합니다.</p>
            </div>
            <div className="info-card">
              <div className="card-icon">#</div>
              <h3 className="card-title">다중 플랫폼 최적화</h3>
              <p className="card-desc">인스타그램, 네이버 블로그 각 플랫폼에 맞춰 최적화합니다.</p>
            </div>
            <div className="info-card">
              <div className="card-icon">⏱️</div>
              <h3 className="card-title">빠른 생성 시간</h3>
              <p className="card-desc">3분 만에 전문적인 홍보 콘텐츠를 완성하여 시간을 절약하세요.</p>
            </div>
            <div className="info-card">
              <div className="card-icon">😊</div>
              <h3 className="card-title">다양한 톤앤매너</h3>
              <p className="card-desc">친근함, 전문적, 트렌디 등 원하는 톤으로 생성합니다.</p>
            </div>
            <div className="info-card">
              <div className="card-icon">📈</div>
              <h3 className="card-title">트렌드 해시태그</h3>
              <p className="card-desc">실시간 트렌드를 반영한 효과적인 해시태그를 추천합니다.</p>
            </div>
            <div className="info-card">
              <div className="card-icon">📊</div>
              <h3 className="card-title">성과 분석</h3>
              <p className="card-desc">생성된 콘텐츠의 성과를 분석해 다음 전략에 반영할 수 있습니다.</p>
            </div>
          </div>
        </section>

        {/* 간단한 3단계로 완성 */}
        <section id="howto" className="steps-section">
          <h2 className="section-heading">간단한 3단계로 완성</h2>
          <p className="section-subheading">복잡한 설정 없이 누구나 쉽게 사용할 수 있습니다</p>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-badge">1</div>
              <h3 className="step-title">업종 및 정보 입력</h3>
              <p className="step-desc">가게 정보와 홍보하고 싶은 내용을 간단히 입력하세요.</p>
            </div>
            <div className="step-item">
              <div className="step-badge">2</div>
              <h3 className="step-title">SNS 플랫폼 선택</h3>
              <p className="step-desc">원하는 플랫폼을 선택하세요.</p>
            </div>
            <div className="step-item">
              <div className="step-badge">3</div>
              <h3 className="step-title">AI 콘텐츠 생성</h3>
              <p className="step-desc">3분 후 전문적인 홍보 콘텐츠를 받아보세요!</p>
            </div>
          </div>
          <div className="cta-inline">
            <button className="btn-primary" onClick={handleStart}>지금 시작하기 →</button>
          </div>
        </section>

        {/* CTA 배너 + 푸터 */}
        <section id="cta" className="cta-banner">
          <h2 className="cta-title">지금 시작해서 첫 번째 홍보 콘텐츠를 만들어보세요</h2>
          <p className="cta-subtitle">무료 체험으로 AI 홍보 서비스의 효과를 직접 경험해보세요</p>
          <button className="cta-button" onClick={handleStart}>무료로 시작하기 →</button>
        </section>

        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">ai 홍보 서비스</div>
              <p className="footer-desc">AI 기술로 누구나 쉽게 전문적인 홍보 콘텐츠를 만들 수 있는 서비스입니다.</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">서비스</h4>
              <a className="footer-link" href="#">기능 소개</a>
              <a className="footer-link" href="#">가격</a>
              <a className="footer-link" href="#">사용 가이드</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">고객지원</h4>
              <a className="footer-link" href="#">고객센터</a>
              <a className="footer-link" href="#">FAQ</a>
              <a className="footer-link" href="#">1:1 문의</a>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">연결</h4>
              <div className="socials">🔗 🌐 📷 ▶️</div>
            </div>
          </div>
          <div className="footer-bottom">© 2025 AI 홍보 서비스. All rights reserved.</div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
