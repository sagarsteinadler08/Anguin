import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CustomCursor } from './components/ui/CustomCursor'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <CustomCursor />
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
