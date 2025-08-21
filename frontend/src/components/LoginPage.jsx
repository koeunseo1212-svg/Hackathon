import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log('Login attempt:', formData);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="logo">AI 홍보 서비스</h1>
        <h2 className="login-title">계정에 로그인</h2>
        <p className="login-subtitle">또는 <Link to="/signup" className="signup-link">새 계정 만들기</Link></p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일 주소</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <div className="form-check">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              로그인 상태 유지
            </label>
            <Link to="/forgot-password" className="forgot-password">비밀번호를 잊으셨나요?</Link>
          </div>

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="divider">
          <span>또는</span>
        </div>

        <div className="social-login">
          <button className="social-button google">
            <img src="/google-icon.png" alt="Google" />
            구글
          </button>
          <button className="social-button kakao">
            <img src="/kakao-icon.png" alt="Kakao" />
            카카오
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
