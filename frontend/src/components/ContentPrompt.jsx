import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ContentPrompt.css'

function ContentPrompt() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    promotionTarget: '',
    tone: '',
    targetAudience: '',
    imageUpload: null,
    bgmMood: '',
    hashtagCount: '',
    blogLength: '',
    additionalNotes: ''
  })

  const targetAudienceOptions = ['전체', '10대', '2030대', '4050대', '관광객', '기타']
  const bgmMoodOptions = ['잔잔', '경쾌', '레트로', '트렌디']
  const hashtagCountOptions = ['3개', '5개', '10개']
  const blogLengthOptions = ['짧게', '보통', '길게']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageUpload: file
      }))
    }
  }

  const handleGenerate = () => {
    // 필수 필드 검증
    if (formData.promotionTarget && formData.tone && formData.targetAudience) {
      navigate('/preview')
    }
  }

  const isFormValid = formData.promotionTarget && formData.tone && formData.targetAudience

  return (
    <div className="content-prompt-page">
      <div className="prompt-container">
        <div className="left-section">
          <h1 className="main-title">콘텐츠 생성 프롬프트</h1>
        </div>
        
        <div className="right-section">
          <form className="prompt-form">
            <div className="form-group">
              <label>무엇을 홍보하시겠습니까?</label>
              <input
                type="text"
                name="promotionTarget"
                value={formData.promotionTarget}
                onChange={handleInputChange}
                placeholder="단답으로 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label>말투(홍보컨셉)</label>
              <input
                type="text"
                name="tone"
                value={formData.tone}
                onChange={handleInputChange}
                placeholder="예시) 친근하게, 전문적으로"
                required
              />
            </div>

            <div className="form-group">
              <label>타겟 고객층</label>
              <div className="option-buttons">
                {targetAudienceOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`option-btn ${formData.targetAudience === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect('targetAudience', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>이미지 업로드</label>
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="imageUpload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="imageUpload" className="image-upload-label">
                  {formData.imageUpload ? formData.imageUpload.name : '이미지를 선택하세요'}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>BGM 분위기 선택</label>
              <div className="option-buttons">
                {bgmMoodOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`option-btn ${formData.bgmMood === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect('bgmMood', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>해시태그 개수 선택</label>
              <div className="option-buttons">
                {hashtagCountOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`option-btn ${formData.hashtagCount === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect('hashtagCount', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>블로그용 문단 길이 선택</label>
              <div className="option-buttons">
                {blogLengthOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`option-btn ${formData.blogLength === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect('blogLength', option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>추가 사항 (선택)</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="추가 요청 사항을 작성해주세요"
                rows="4"
              />
            </div>

            <button 
              type="button"
              className="generate-btn"
              onClick={handleGenerate}
              disabled={!isFormValid}
            >
              생성
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContentPrompt
