import Vue from "vue";
import ElementUI from 'element-ui'; // 组件库 
import 'element-ui/lib/theme-chalk/index.css'; // 样式
import App from "./App.vue";
import router from "./router";
import store from '@/store';

// 使用 ElementUI 
Vue.use(ElementUI);

import './permission'
// 生产环境为true，会占用体积，不提示错误，开发环境为false，有助于开发
Vue.config.productionTip = process.env.NODE_ENV === 'production';
// console.log(process.env.NODE_ENV) 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
