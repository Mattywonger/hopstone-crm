import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignupPage } from './components/SignupPage'
import { Home } from './components/Home'
import { LoginPage } from './components/LoginPage'
import { PrivateRoute } from './components/PrivateRoute'
import { UserPage } from './components/UserPage'
import { Toaster } from "./components/ui/toaster";
import { Users } from './components/Users'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
      </Routes>
      <Toaster />
    </BrowserRouter>

  )
}

export default App
