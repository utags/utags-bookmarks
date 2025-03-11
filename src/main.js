import { mount } from 'svelte'
import App from './App.svelte'
import './tailwind.css'

// 初始化Google Analytics
window.gtag('config', 'G-7FV6Z2SXHE', {
  page_path: window.location.pathname,
  send_page_view: true,
})

const app = mount(App, { target: document.getElementById('app') })

export default app
