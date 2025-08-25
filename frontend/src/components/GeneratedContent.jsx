function translateText(text, language) {
  if (!language) return text
  const prefix = language === '영어' ? '[EN] ' : language === '일본어' ? '[JP] ' : language === '중국어' ? '[ZH] ' : ''
  return prefix + text
}

function buildContent({ type, state }) {
  const name = state.basicInfo?.companyName || '우리 가게'
  const category = state.category || '업종'
  const tone = state.prompt?.tone || 'friendly'
  const base = state.prompt?.content || `${name}의 새로운 소식을 전해드립니다!`

  if (type === 'instagram') {
    const hashTags = ['#'+(category || '홍보'), '#추천', '#핫플'].join(' ')
    return `${base}\n\n${hashTags}`
  }
  if (type === 'naver-blog') {
    const address = state.basicInfo?.address ? `\n\n주소: ${state.basicInfo.address}` : ''
    return `${base}${address}\n\n방문을 기다릴게요!`
  }
  return base
}

function GeneratedContent({ type, state, language }) {
  const text = buildContent({ type, state })
  const translated = translateText(text, language)
  return (
    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>{translated}</pre>
  )
}

export default GeneratedContent


