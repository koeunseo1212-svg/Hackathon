import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CategorySelection.css'

function CategorySelection() {
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])

  const categories = [
    { id: 'restaurant', name: '음식점', icon: '🍽️' },
    { id: 'cafe', name: '카페', icon: '☕' },
    { id: 'production', name: '제작/체험', icon: '🔧' },
    { id: 'festival', name: '축제/행사', icon: '🎉' },
    { id: 'performance', name: '공연', icon: '🎤' },
    { id: 'other', name: '기타', icon: '📌' }
  ]

  const handleCategoryClick = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const handleNext = () => {
    if (selectedCategories.length > 0) {
      navigate('/basic-info')
    }
  }

  return (
    <div className="category-page">
      <div className="category-container">
        <div className="left-section">
          <h1 className="main-title">카테고리 설정</h1>
          <p className="instruction">홍보할 카테고리를 선택하세요</p>
        </div>
        
        <div className="right-section">
          <h2 className="section-title">카테고리 선택</h2>
          <div className="category-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
          
          <button 
            className="next-btn"
            onClick={handleNext}
            disabled={selectedCategories.length === 0}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategorySelection
