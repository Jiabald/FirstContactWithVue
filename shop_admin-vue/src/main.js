// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from "vue";
import App from "./App";

//引入element
import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";

//引入公共样式

import "./assets/css/common.css";

// 引入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

Vue.use(VueQuillEditor /* { default global options } */);

//安装
Vue.use(ElementUI);
//导入路由
import router from "../src/router/router";

//处理axios 的三个问题 1、重复写基准地址 2、每次引入axios 3、每次都携带token
import axios from "axios";
//1、
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
//2、
Vue.prototype.$axios = axios;
//3、请求拦截器
// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    config.headers.Authorization = localStorage.getItem("token");
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  el: "#app",
  components: { App },
  template: "<App/>"
});
