import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignupPage } from './components/signup'
import { Home } from './components/Home'
import { LoginPage } from './components/LoginPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
