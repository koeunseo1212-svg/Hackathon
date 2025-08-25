import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import CategorySelection from './components/CategorySelection'
import BasicInfoForm from './components/BasicInfoForm'
import SnsChannelSelection from './components/SnsChannelSelection'
import ContentPrompt from './components/ContentPrompt'
import ResultPreview from './components/ResultPreview'
import Payment from './components/Payment'
import Completion from './components/Completion'
import { AppStateProvider } from './components/AppStateContext'

function App() {
  return (
    <AppStateProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/category" element={<CategorySelection />} />
            <Route path="/basic-info" element={<BasicInfoForm />} />
            <Route path="/sns-channel" element={<SnsChannelSelection />} />
            <Route path="/content-prompt" element={<ContentPrompt />} />
            <Route path="/preview" element={<ResultPreview />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/completion" element={<Completion />} />
          </Routes>
        </div>
      </Router>
    </AppStateProvider>
  )
}

export default App
