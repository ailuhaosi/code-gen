import 'babel-polyfill'// 兼容IE

import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css

// import 'element-theme-dark'  //暗黑主题

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import global from '@/global'
Vue.prototype.$global = global
console.log(Vue.config)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (global['IS_MOCK']) {
  const {
    mockXHR
  } = require('../mock')
  mockXHR()
}
// ////////////////////////////////////

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// ////////////////////
import vRegion from 'v-region'
Vue.use(vRegion)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
