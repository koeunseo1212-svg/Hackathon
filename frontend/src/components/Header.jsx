import { useNavigate } from 'react-router-dom'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  return (
    <header className="site-navbar">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => navigate('/')}>AI 홍보 서비스</div>
        <nav className="nav-links">
          <a href="/#features" className="nav-link">서비스 특징</a>
          <a href="/#howto" className="nav-link">이용 방법</a>
          <a href="/#cta" className="nav-link">오늘안내</a>
        </nav>
        <div className="nav-auth">
          <button className="login-btn" onClick={() => navigate('/login')}>로그인</button>
          <button className="signup-btn" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </div>
    </header>
  )
}

export default Header


