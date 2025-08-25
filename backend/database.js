const mongoose = require('mongoose');

// MongoDB 연결 URI (환경 변수에서 가져오기)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-api-db';

// MongoDB 연결
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB 데이터베이스에 연결되었습니다.');
  } catch (error) {
    console.error('MongoDB 연결 오류:', error.message);
    process.exit(1);
  }
};

// 연결 상태 모니터링
mongoose.connection.on('error', (err) => {
  console.error('MongoDB 연결 오류:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB 연결이 끊어졌습니다.');
});

// 프로세스 종료 시 연결 종료
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB 연결이 종료되었습니다.');
  process.exit(0);
});

module.exports = connectDB;
