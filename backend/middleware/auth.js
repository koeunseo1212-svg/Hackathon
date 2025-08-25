const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');

// JWT 시크릿 키 (환경 변수에서 가져오기)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// JWT 토큰 생성
const generateToken = (userId, name, role) => {
  return jwt.sign(
    { 
      userId, 
      name, 
      role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// JWT 토큰 검증
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 토큰 블랙리스트에 추가 (로그아웃용)
const blacklistToken = async (token, userId) => {
  const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24시간 후

  try {
    const session = new Session({
      userId,
      tokenHash,
      expiresAt
    });
    await session.save();
    return session._id;
  } catch (error) {
    throw error;
  }
};

// 토큰이 블랙리스트에 있는지 확인
const isTokenBlacklisted = async (token) => {
  const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
  
  try {
    const session = await Session.findByTokenHash(tokenHash);
    return !!session;
  } catch (error) {
    throw error;
  }
};

// 인증 미들웨어
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: '액세스 토큰이 필요합니다.',
      code: 'TOKEN_MISSING'
    });
  }

  try {
    // 토큰이 블랙리스트에 있는지 확인
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ 
        error: '유효하지 않은 토큰입니다.',
        code: 'TOKEN_BLACKLISTED'
      });
    }

    // JWT 토큰 검증
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        error: '유효하지 않은 토큰입니다.',
        code: 'TOKEN_INVALID'
      });
    }

    // 사용자 정보 확인
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        error: '사용자를 찾을 수 없습니다.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: '비활성화된 계정입니다.',
        code: 'USER_INACTIVE'
      });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    return res.status(500).json({ 
      error: '인증 처리 중 오류가 발생했습니다.',
      code: 'AUTH_ERROR'
    });
  }
};

// 관리자 권한 확인 미들웨어
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: '관리자 권한이 필요합니다.',
      code: 'ADMIN_REQUIRED'
    });
  }
  next();
};

// 입력 검증 미들웨어
const validateRegistration = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  // 필수 필드 확인
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ 
      error: '모든 필드는 필수입니다.',
      code: 'MISSING_FIELDS'
    });
  }

  // 이름 검증 (2-50자)
  if (name.length < 2 || name.length > 50) {
    return res.status(400).json({ 
      error: '이름은 2-50자 사이여야 합니다.',
      code: 'INVALID_NAME'
    });
  }

  // 이메일 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: '유효한 이메일 주소를 입력해주세요.',
      code: 'INVALID_EMAIL'
    });
  }

  // 비밀번호 검증 (최소 8자, 영문/숫자/특수문자 포함)
  if (password.length < 8) {
    return res.status(400).json({ 
      error: '비밀번호는 최소 8자 이상이어야 합니다.',
      code: 'PASSWORD_TOO_SHORT'
    });
  }

  if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
    return res.status(400).json({ 
      error: '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
      code: 'PASSWORD_TOO_WEAK'
    });
  }

  // 비밀번호 확인 검증
  if (password !== confirmPassword) {
    return res.status(400).json({ 
      error: '비밀번호가 일치하지 않습니다.',
      code: 'PASSWORD_MISMATCH'
    });
  }

  next();
};

module.exports = {
  generateToken,
  verifyToken,
  blacklistToken,
  isTokenBlacklisted,
  authenticateToken,
  requireAdmin,
  validateRegistration,
  JWT_SECRET
};
