import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // 로그인 로직 구현
    console.log('로그인 클릭')
    navigate('/category')  // 다음 페이지로 이동
  }

  const handleNaver = () => {
    // 네이버 로그인 로직 구현
    console.log('네이버 로그인 클릭')
  }

  const handleInstagram = () => {
    // 인스타그램 로그인 로직 구현
    console.log('인스타그램 로그인 클릭')
  }

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="main-title">AI 홍보 서비스</h1>
        <p className="description">사진과 키워드만으로 SNS 홍보 완성</p>
        
        <div className="button-group">
          <button className="btn btn-primary" onClick={handleLogin}>
            로그인
          </button>
          <div className="social-buttons">
            <button className="btn btn-naver" onClick={handleNaver}>
              네이버
            </button>
            <button className="btn btn-instagram" onClick={handleInstagram}>
              인스타그램
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
