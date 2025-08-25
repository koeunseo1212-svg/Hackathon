import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'app_state_v1'

const defaultState = {
  auth: { isAuthenticated: false, user: null },
  category: null,
  basicInfo: null,
  sns: { channels: [], options: { backgroundMusic: false, trendHashtags: false, localKeywords: false } },
  prompt: { contentType: 'general', tone: 'friendly', content: '' },
  language: '',
  quotas: { freeGenerations: 2, freeRegenerations: 1 },
  feedbacks: []
}

const AppStateContext = createContext(null)

export function AppStateProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  const actions = useMemo(() => ({
    login(user) {
      setState(prev => ({ ...prev, auth: { isAuthenticated: true, user } }))
    },
    logout() {
      setState(prev => ({ ...prev, auth: { isAuthenticated: false, user: null } }))
    },
    setCategory(category) {
      setState(prev => ({ ...prev, category }))
    },
    setBasicInfo(basicInfo) {
      setState(prev => ({ ...prev, basicInfo }))
    },
    setSns(sns) {
      setState(prev => ({ ...prev, sns }))
    },
    setPrompt(prompt) {
      setState(prev => ({ ...prev, prompt }))
    },
    setLanguage(language) {
      setState(prev => ({ ...prev, language }))
    },
    useGeneration() {
      setState(prev => ({ ...prev, quotas: { ...prev.quotas, freeGenerations: Math.max(0, (prev.quotas?.freeGenerations ?? 0) - 1) } }))
    },
    useRegeneration() {
      setState(prev => ({ ...prev, quotas: { ...prev.quotas, freeRegenerations: Math.max(0, (prev.quotas?.freeRegenerations ?? 0) - 1) } }))
    },
    addFeedback(feedback) {
      const entry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        ...feedback
      }
      setState(prev => ({ ...prev, feedbacks: [...(prev.feedbacks || []), entry] }))
    }
  }), [])

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}


