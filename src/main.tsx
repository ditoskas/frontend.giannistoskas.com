import React from 'react'
import ReactDOM from 'react-dom/client'
import GiannisDesign from './GiannisDesign'
import './index.css'

// Mobile detection and redirection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*mobile)))/i.test(navigator.userAgent);

if (isMobile && !isTablet) {
  const mobileUrl = import.meta.env.VITE_MOBILE_URL;
  if (mobileUrl) {
    window.location.href = mobileUrl;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GiannisDesign />
  </React.StrictMode>
)