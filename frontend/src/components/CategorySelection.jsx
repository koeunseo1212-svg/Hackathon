import { useNavigate } from 'react-router-dom'
import { useAppState } from './AppStateContext'
import { useState } from 'react'
import './CategorySelection.css'

function CategorySelection() {
  const navigate = useNavigate()
  const { state, actions } = useAppState()
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categories = [
    {
      id: 'food',
      name: '음식점/카페',
      icon: '🍽️',
      description: '레스토랑, 카페, 베이커리 등'
    },
    {
      id: 'beauty',
      name: '뷰티/웰스',
      icon: '✂️',
      description: '미용실, 네일샵, 피부관리실 등'
    },
    {
      id: 'retail',
      name: '소매업',
      icon: '🛍️',
      description: '의류, 잡화, 편의점 등'
    },
    {
      id: 'service',
      name: '서비스업',
      icon: '🎧',
      description: '정수, 수리, 배달 등'
    },
    {
      id: 'education',
      name: '교육/학원',
      icon: '🎓',
      description: '학원, 교실, 온라인 강의 등'
    },
    {
      id: 'medical',
      name: '의료/건강',
      icon: '❤️',
      description: '병원, 약국, 클리닉 등'
    },
    {
      id: 'entertainment',
      name: '엔터테인먼트',
      icon: '🎮',
      description: '게임방, PC방, 노래방 등'
    },
    {
      id: 'accommodation',
      name: '숙박업',
      icon: '🏨',
      description: '호텔, 펜션, 게스트하우스 등'
    },
    {
      id: 'other',
      name: '기타',
      icon: '⋯',
      description: '위에 없는 다른 업종'
    }
  ]

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleNext = () => {
    if (selectedCategory) {
      actions.setCategory(selectedCategory)
      navigate('/basic-info')
    }
  }

  return (
    <div className="category-page">
      <div className="progress-header">
        <div className="progress-step active">
          <div className="step-icon">1</div>
          <span className="step-label">카테고리 설정</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="step-icon">2</div>
          <span className="step-label">가게 정보</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="step-icon">3</div>
          <span className="step-label">SNS 선택</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="step-icon">4</div>
          <span className="step-label">콘텐츠 생성</span>
        </div>
      </div>

      <div className="main-content">
        <h1>어떤 업종인가요?</h1>
        <p className="subtitle">귀하의 업종을 선택해주세요. AI가 맞춤형 홍보 콘텐츠를 생성합니다.</p>

        <div className="category-grid">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="card-content">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="navigation-buttons">
          <button className="prev-btn" onClick={() => navigate('/')}>
            이전으로
          </button>
          <button 
            className="next-btn" 
            onClick={handleNext}
            disabled={!selectedCategory}
          >
            다음 단계
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategorySelection
