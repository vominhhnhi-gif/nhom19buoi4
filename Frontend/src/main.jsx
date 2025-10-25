import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { setAuthFromLocalStorage } from './lib/api'

// initialize axios auth header from saved token (if any)
setAuthFromLocalStorage();

// Global handler for unhandled promise rejections to aid debugging in dev
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // log full reason to console and show a gentle message to the dev
    // This helps track down where 'Uncaught (in promise) undefined' comes from
    // in development.
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection:', event.reason);
  });
}

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>,
)
