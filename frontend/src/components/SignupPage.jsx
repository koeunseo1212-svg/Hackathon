import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { useAppState } from './AppStateContext';

function SignupPage() {
  const navigate = useNavigate();
  const { actions } = useAppState();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
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
    // 회원가입 로직 구현
    console.log('Signup attempt:', formData);
    // 임시: 회원가입 성공 가정 후 다음 단계로 이동
    actions.login({ email: formData.email, name: formData.name });
    navigate('/category');
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="header-section">
          <h1 className="service-logo">
            <span className="ai-text">AI</span> 홍보 서비스
          </h1>
          <h2 className="signup-title">새 계정 만들기</h2>
          <p className="login-link-text">
            이미 계정이 있으신가요? <Link to="/login" className="login-link">로그인하기</Link>
          </p>
        </div>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

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

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <div className="terms-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <span className="checkbox-custom"></span>
              서비스 이용약관 및 개인정보처리방침에 동의합니다
            </label>
          </div>

          <button type="submit" className="signup-button">
            계정 만들기
          </button>
        </form>


      </div>
    </div>
  );
}

export default SignupPage;
