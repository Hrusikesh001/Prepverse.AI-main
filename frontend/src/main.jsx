import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { QuizProvider } from './context/QuizContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SocketProvider } from './context/socketContext.jsx'

const CLIENT_ID = "721789191107-rp78o6lefk1652q0go3vokje2hd1pcgs.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthProvider>
        <SocketProvider>
          <QuizProvider>
            <App />
          </QuizProvider>
        </SocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
)
