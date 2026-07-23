import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { UserDataProvider } from './context/UserDataContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UserDataProvider>
        <App />
      </UserDataProvider>
    </AuthProvider>
  </React.StrictMode>,
)