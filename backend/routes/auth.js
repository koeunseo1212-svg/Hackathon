const express = require('express');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const {
  generateToken,
  blacklistToken,
  authenticateToken,
  validateRegistration
} = require('../middleware/auth');

const router = express.Router();

// Rate limiting 설정
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 15분당 최대 5번 시도
  message: {
    error: '너무 많은 로그인 시도가 있었습니다. 15분 후에 다시 시도해주세요.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 3, // 1시간당 최대 3번 시도
  message: {
    error: '너무 많은 회원가입 시도가 있었습니다. 1시간 후에 다시 시도해주세요.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 회원가입
router.post('/register', registerLimiter, validateRegistration, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 이메일 중복 확인
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ 
        error: '이미 사용 중인 이메일입니다.',
        code: 'EMAIL_EXISTS'
      });
    }

    // 사용자 생성
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // JWT 토큰 생성
    const token = generateToken(user._id, user.name, user.role);

    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ 
      error: '회원가입 중 오류가 발생했습니다.',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// 로그인
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 필드 확인
    if (!email || !password) {
      return res.status(400).json({ 
        error: '이메일과 비밀번호를 입력해주세요.',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // 사용자 조회 (이메일로 로그인)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ 
        error: '이메일 또는 비밀번호가 올바르지 않습니다.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: '비활성화된 계정입니다.',
        code: 'ACCOUNT_INACTIVE'
      });
    }
    

    // 비밀번호 검증
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: '이메일 또는 비밀번호가 올바르지 않습니다.',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // 마지막 로그인 시간 업데이트
    user.lastLogin = new Date();
    await user.save();

    // JWT 토큰 생성
    const token = generateToken(user._id, user.name, user.role);

    res.json({
      success: true,
      message: '로그인이 완료되었습니다.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ 
      error: '로그인 중 오류가 발생했습니다.',
      code: 'LOGIN_ERROR'
    });
  }
});

// 로그아웃
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 토큰을 블랙리스트에 추가
    await blacklistToken(token, req.user.id);

    res.json({
      success: true,
      message: '로그아웃이 완료되었습니다.'
    });
  } catch (error) {
    console.error('로그아웃 오류:', error);
    res.status(500).json({ 
      error: '로그아웃 중 오류가 발생했습니다.',
      code: 'LOGOUT_ERROR'
    });
  }
});

// 프로필 조회
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// 프로필 업데이트
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ 
        error: '업데이트할 정보를 입력해주세요.',
        code: 'NO_UPDATE_DATA'
      });
    }

    const updateData = {};

    // 이름 업데이트
    if (name) {
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ 
          error: '이름은 2-50자 사이여야 합니다.',
          code: 'INVALID_NAME'
        });
      }
      updateData.name = name;
    }

    // 이메일 업데이트
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: '유효한 이메일 주소를 입력해주세요.',
          code: 'INVALID_EMAIL'
        });
      }

      // 이메일 중복 확인 (자신의 이메일 제외)
      const existingEmail = await User.findOne({ 
        email, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingEmail) {
        return res.status(409).json({ 
          error: '이미 사용 중인 이메일입니다.',
          code: 'EMAIL_EXISTS'
        });
      }
      updateData.email = email;
    }

    // 프로필 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: '프로필이 업데이트되었습니다.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({ 
      error: '프로필 업데이트 중 오류가 발생했습니다.',
      code: 'UPDATE_ERROR'
    });
  }
});

// 비밀번호 변경
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: '현재 비밀번호와 새 비밀번호를 입력해주세요.',
        code: 'MISSING_PASSWORDS'
      });
    }

    // 새 비밀번호 검증
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: '새 비밀번호는 최소 8자 이상이어야 합니다.',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    if (!/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(newPassword)) {
      return res.status(400).json({ 
        error: '새 비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
        code: 'PASSWORD_TOO_WEAK'
      });
    }

    // 현재 비밀번호 확인
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        error: '사용자를 찾을 수 없습니다.',
        code: 'USER_NOT_FOUND'
      });
    }

    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: '현재 비밀번호가 올바르지 않습니다.',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // 새 비밀번호 설정
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: '비밀번호가 변경되었습니다.'
    });
  } catch (error) {
    console.error('비밀번호 변경 오류:', error);
    res.status(500).json({ 
      error: '비밀번호 변경 중 오류가 발생했습니다.',
      code: 'PASSWORD_UPDATE_ERROR'
    });
  }
});

module.exports = router;
