// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

/*import 'static/ueditor/ueditor.config.js'

import 'static/ueditor/ueditor.all.js'

import 'static/ueditor/lang/zh-cn/zh-cn.js'

import 'static/ueditor/ueditor.parse.min.js'*/
// rxjs use
import VueRx from 'vue-rx'
Vue.use(VueRx)

import VueQuillEditor from 'vue-quill-editor'
import "babel-polyfill"
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(VueQuillEditor)

import './assets/css/ele.css';

Vue.use(Vuex)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
