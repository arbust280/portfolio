import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/* Arm the reveal animation only when we can actually un-reveal it.
   The hidden state lives behind this class, so if the script never runs,
   IntersectionObserver is missing, or the page is printed or crawled,
   content stays visible instead of being stuck at opacity 0. Set before
   render so there is no flash of visible-then-hidden content. */
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-ready');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
