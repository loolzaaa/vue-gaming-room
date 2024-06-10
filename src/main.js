import '../lib/sass/_index.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.BASE_URL
axios.interceptors.response.use(null, function (error) {
  if (error.response.status === 400 && error.response.data.message) {
    alert(error.response.data.message)
  }
  return Promise.reject(error)
})

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
