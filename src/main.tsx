import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Firebase } from './providers/user.ts'
import { FirebaseIsLoaded } from './components/FirebaseIsLoaded.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Firebase.Provider>
      <FirebaseIsLoaded>
        <App />
      </FirebaseIsLoaded>
    </Firebase.Provider>
  </React.StrictMode>,
)
