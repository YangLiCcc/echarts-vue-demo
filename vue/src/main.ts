import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局引用echarts
import * as echarts from 'echarts'
// 引入全局的样式
import './assets/style/global.scss'
// 引入字体文件
import './assets/font/iconfont.css'
import axios from 'axios'
// 引用主题文件
require('echarts/theme/chalk')
require('echarts/theme/vintage')

const app = createApp(App)
app.use(store).use(router).mount('#app')
app.config.globalProperties.$echarts = echarts // 全局使用this.$echarts
// 请求基准路径的配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api'
// 将axios挂载到Vue的原型对象上
app.config.globalProperties.$http = axios
