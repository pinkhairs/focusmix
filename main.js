import Vue from 'vue'
import App from './App'

import Editor from 'vue-editor-js/src'
Vue.use(Editor)


Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
