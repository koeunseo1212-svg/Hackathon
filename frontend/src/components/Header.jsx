import { useNavigate } from 'react-router-dom'
import './Header.css'
import { useAppState } from './AppStateContext'            // ✅ 추가

function Header() {
  const navigate = useNavigate()
  const { state, actions } = useAppState()                 // ✅ 추가

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
          {state?.auth?.isAuthenticated ? (                 // ✅ 로그인 여부에 따라 분기
            <>
              <span className="user-name">
                {(state.auth.user?.name || state.auth.user?.email) + ' 님'}
              </span>
              <button
                className="logout-btn"
                onClick={() => { actions.logout(); navigate('/'); }}  // ✅ 로그아웃 후 메인
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>로그인</button>
              <button className="signup-btn" onClick={() => navigate('/signup')}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
