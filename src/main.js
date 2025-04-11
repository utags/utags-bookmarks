import { mount } from 'svelte'
import App from './App.svelte'
import './tailwind.css'

// 初始化Google Analytics
globalThis.gtag('config', 'G-7FV6Z2SXHE', {
  // eslint-disable-next-line camelcase
  page_path: globalThis.location.pathname,
  // eslint-disable-next-line camelcase
  send_page_view: true,
})

const app = mount(App, { target: document.querySelector('#app') })

export default app

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => console.log('SW registered'))
      .catch((error) => console.log('SW registration failed'))
  })
}
