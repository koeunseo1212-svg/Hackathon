import './SummaryBar.css'

function SummaryBar({ category, companyName, snsChannels, promptText, language, onClickCategory, onClickBasic, onClickSns, onClickPrompt, onClickLanguage }) {
  if (!category && !companyName && (!snsChannels || snsChannels.length === 0) && !promptText && !language) {
    return null
  }

  return (
    <div className="summary-bar">
      {category && (
        <button type="button" className="summary-item as-button" onClick={onClickCategory}>
          <span className="label">카테고리</span>
          <span className="value">{category}</span>
        </button>
      )}
      {companyName && (
        <button type="button" className="summary-item as-button" onClick={onClickBasic}>
          <span className="label">상호명</span>
          <span className="value">{companyName}</span>
        </button>
      )}
      {snsChannels && snsChannels.length > 0 && (
        <button type="button" className="summary-item as-button" onClick={onClickSns}>
          <span className="label">SNS</span>
          <span className="value">{snsChannels.join(', ')}</span>
        </button>
      )}
      {promptText && (
        <button type="button" className="summary-item as-button" onClick={onClickPrompt}>
          <span className="label">프롬프트</span>
          <span className="value ellipsis">{promptText}</span>
        </button>
      )}
      {language && (
        <button type="button" className="summary-item as-button" onClick={onClickLanguage}>
          <span className="label">언어</span>
          <span className="value">{language}</span>
        </button>
      )}
    </div>
  )
}

export default SummaryBar


