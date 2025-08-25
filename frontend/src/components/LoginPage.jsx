import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useAppState } from './AppStateContext';

function LoginPage() {
  const navigate = useNavigate();
  const { state, actions } = useAppState();
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
    // 임시: 로그인 성공 가정 후 다음 단계로 이동
    actions.login({ email: formData.email });
    navigate('/');
  };

  const handleStart = () => {
    if (state?.auth?.isAuthenticated) {
      navigate('/category')  // 로그인 상태면 다음 단계로
    } else {
      navigate('/login')     // 비로그인 상태면 로그인으로
    }
  }

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
            <button type="button" className="forgot-password" onClick={() => alert('비밀번호 찾기 기능은 준비 중입니다.')}>비밀번호를 잊으셨나요?</button>
          </div>

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>


        
      </div>
    </div>
  );
}

export default LoginPage;
