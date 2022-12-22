import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/main.css'
import axios from 'axios'

axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + window.localStorage.getItem('token')
  return config
})

axios.interceptors.response.use(function (response) {
  if (response.data.code && response.data.code < 100) {
    router.push('/login')
  } else {
    return response
  }
})
Vue.config.productionTip = false
axios.defaults.baseURL = '/api/v1/'
Vue.prototype.$http = axios
// 这是vue脚手架产生文件的入口

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
