// Introduce Windi CSS
import '@/plugins/windi.css'

// Import global SVG icons
import '@/plugins/svgIcon'

// Initialize multi -language
import { setupI18n } from '@/plugins/vueI18n'

// Introduce status management
import { setupStore } from '@/store'

// Global component
import { setupGlobCom } from '@/components'

// Introduce Element-Plus
import { setupElementPlus } from '@/plugins/elementPlus'

// Introduce global style
import '@/styles/index.less'

// Introduce animation
import '@/plugins/animate.css'

// routing
import { setupRouter } from './router'

// Authority
import { setupPermission } from './directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'
//event bus
import mitt from 'mitt';                  // Import mitt
const emitter = mitt();                   // Initialize mitt

// Create instance
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupRouter(app)

  setupPermission(app)

  app.mount('#app')
  app.provide('emitter', emitter);
}

setupAll()
