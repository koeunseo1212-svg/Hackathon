const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL 인덱스
  }
}, {
  timestamps: true
});

// 토큰 해시로 세션 찾기
sessionSchema.statics.findByTokenHash = function(tokenHash) {
  return this.findOne({ tokenHash });
};

// 사용자의 모든 세션 삭제
sessionSchema.statics.deleteUserSessions = function(userId) {
  return this.deleteMany({ userId });
};

module.exports = mongoose.model('Session', sessionSchema);
