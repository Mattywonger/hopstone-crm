import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { User } from './providers/user.ts'
import { AuthIsLoaded } from './components/AuthIsLoaded.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <User.Provider>
      <AuthIsLoaded>
        <App />
      </AuthIsLoaded>
    </User.Provider>
  </React.StrictMode>,
)
