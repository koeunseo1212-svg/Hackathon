import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Payment.css'

function Payment() {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('')
  const [freeUses, setFreeUses] = useState(2)

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method)
  }

  const handlePayment = () => {
    if (paymentMethod) {
      navigate('/completion')
    }
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="left-section">
          <h1 className="main-title">결제</h1>
          <div className="payment-info">
            <div className="info-item">
              <span className="info-label">결제</span>
            </div>
            <div className="info-item">
              <span className="info-label">건당 결제:</span>
              <span className="info-value">3000원</span>
            </div>
            <div className="info-item">
              <span className="info-label">월정액:</span>
              <span className="info-value">19900원</span>
            </div>
          </div>
        </div>
        
        <div className="right-section">
          <div className="payment-form">
            <div className="form-group">
              <label>남은 무료 사용 횟수</label>
              <input
                type="text"
                value={`${freeUses}회`}
                readOnly
                className="free-uses-input"
              />
            </div>

            <div className="form-group">
              <label>결제 방식 선택</label>
              <div className="payment-method-buttons">
                <button
                  className={`method-btn ${paymentMethod === 'per-use' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('per-use')}
                >
                  건당 결제
                </button>
                <button
                  className={`method-btn ${paymentMethod === 'monthly' ? 'selected' : ''}`}
                  onClick={() => handlePaymentMethodSelect('monthly')}
                >
                  월정액
                </button>
              </div>
            </div>

            <button 
              className="payment-submit-btn"
              onClick={handlePayment}
              disabled={!paymentMethod}
            >
              결제
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
