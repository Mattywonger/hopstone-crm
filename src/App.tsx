import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SignupPage } from './components/SignupPage'
import { LoginPage } from './components/LoginPage'
import { PrivateRoute } from './components/PrivateRoute'
import { UserPage } from './components/UserPage'
import { Toaster } from "./components/ui/toaster";
import { Users } from './components/Users'
import AddNewDeal from './components/AddNewDeal'
import Home from './components/Home'
import LiveDealsPage from './components/header-links/LiveDealsPage'
import PostInvestmentPage from './components/header-links/PostInvestmentPage'
import RejectedPage from './components/header-links/RejectedPage'
import StatisticsPage from './components/header-links/StatisticsPage'
import NewsPage from './components/header-links/NewsPage'




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<PrivateRoute><UserPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/add-new-deal" Component={AddNewDeal} />
        <Route path="/live-deals" Component={LiveDealsPage} />
        <Route path="/post-investment" Component={PostInvestmentPage}/>
        <Route path="/rejected" Component={RejectedPage}/>
        <Route path="/statistics" Component={StatisticsPage}/>
        <Route path="/news" Component={NewsPage}/>
      </Routes>
      <Toaster />
    </BrowserRouter>

  )
}

export default App
