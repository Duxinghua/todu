import '@babel/polyfill'
import promise from 'es6-promise'
promise.polyfill()
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import moment from 'moment'
ElementUI.Dialog.props.closeOnClickModal.default = false;
Vue.use(mavonEditor)
Vue.use(ElementUI, { size: 'mini', zIndex: 3000 })
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD HH:mm:ss')
})
Vue.directive('focus', function(el, option) {
  var defClass = 'el-input'
  var defTag = 'input'
  var value = option.value || true
  if (typeof value === 'boolean') {
    value = { cls: defClass, tag: defTag, foc: value }
  } else {
    value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false }
  }
  if (el.classList.contains(value.cls) && value.foc) {
    el.getElementsByTagName(value.tag)[0].focus()
  }
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
