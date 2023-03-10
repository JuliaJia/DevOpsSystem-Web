import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

Vue.config.productionTip = false

// 这是vue脚手架产生文件的入口

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
