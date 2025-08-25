const mongoose = require('mongoose');

const promotionResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 카테고리 정보 (CategorySelection)
  category: {
    type: String,
    enum: ['food', 'beauty', 'retail', 'service', 'education', 'medical', 'entertainment', 'accommodation', 'other'],
    required: true
  },
  // 기본 정보 (BasicInfoForm)
  basicInfo: {
    companyName: {
      type: String,
      required: true
    },
    businessType: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    detailAddress: String,
    phone: {
      type: String,
      required: true
    },
    businessHours: String,
    introduction: {
      type: String,
      required: true
    }
  },
  // SNS 채널 정보 (SnsChannelSelection)
  sns: {
    channels: [{
      type: String,
      enum: ['naver-blog', 'instagram'],
      required: true
    }],
    options: {
      backgroundMusic: {
        type: Boolean,
        default: false
      },
      trendHashtags: {
        type: Boolean,
        default: false
      },
      localKeywords: {
        type: Boolean,
        default: false
      }
    }
  },
  // 콘텐츠 프롬프트 정보 (ContentPrompt)
  prompt: {
    contentType: {
      type: String,
      enum: ['general', 'event', 'menu', 'review', 'trend'],
      default: 'general'
    },
    tone: {
      type: String,
      enum: ['friendly', 'professional', 'trendy', 'warm', 'energetic'],
      default: 'friendly'
    },
    content: {
      type: String,
      required: true
    }
  },
  // 언어 설정
  language: {
    type: String,
    default: 'ko'
  },
  // 생성된 홍보 콘텐츠
  generatedPromotions: {
    type: Map,
    of: {
      title: String,
      content: String,
      hashtags: String,
      tips: String
    }
  },
  // 결제 정보 (Payment)
  paymentInfo: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'KRW'
    },
    paymentMethod: {
      type: String,
      enum: ['per-use', 'monthly'],
      required: true
    },
    paidAt: {
      type: Date,
      default: Date.now
    }
  },
  // 상태 정보
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  // AI 분석 결과
  industryAnalysis: String,
  storeAnalysis: String,
  // 피드백 정보
  feedbacks: [{
    id: String,
    timestamp: Date,
    type: String,
    status: String,
    method: String
  }]
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

// 인덱스 추가 (조회 성능 향상)
promotionResultSchema.index({ userId: 1, createdAt: -1 });
promotionResultSchema.index({ status: 1 });
promotionResultSchema.index({ category: 1 });

// JSON 변환 시 민감한 정보 제외
promotionResultSchema.methods.toJSON = function() {
  const resultObject = this.toObject();
  delete resultObject.__v;
  return resultObject;
};

module.exports = mongoose.model('PromotionResult', promotionResultSchema);
