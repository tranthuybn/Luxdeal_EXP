import Launcher from './Launcher.vue'

import emitter from './emitter'

const defaultComponentName = 'BeautifulChat'
let installed = false
let componentName = ''
const VueBeatifulChat = {
  install(app, options = {}) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (installed) {
      return
    }

    installed = true
    app.config.globalProperties.$event = emitter

    componentName = options['componentName'] || defaultComponentName

    app.component(componentName, Launcher)
  }
}

export default VueBeatifulChat
