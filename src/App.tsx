import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignupPage } from './components/SignupPage'
import { Home } from './components/Home'
import { LoginPage } from './components/LoginPage'
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>

  )
}

export default App
