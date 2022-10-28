import Launcher from './Launcher.vue'

import emitter from './emitter'

const defaultComponentName = 'BeautifulChat'

const VueBeatifulChat = {
  install(app, options = {}) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed) {
      return
    }

    this.installed = true
    app.config.globalProperties.$event = emitter

    this.componentName = options.componentName || defaultComponentName

    app.component(this.componentName, Launcher)
  }
}

export default VueBeatifulChat
