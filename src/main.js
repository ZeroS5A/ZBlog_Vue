// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.config.productionTip = false
Vue.use(ViewUI);
//引入公用js
import Request from './api'
Vue.prototype.Request = Request

/* eslint-disable no-new */
/* eslint-disable */ 
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// 路由守卫
router.beforeEach((to, from, next) => {
  window.document.title = 'ZBlog(测试)'
  // 获取token
  let token = localStorage.getItem('token')
  // token 存在且不为空则已登录 不存在或为空则未登录
  if (token !== null && token !== '') {
    next()
  } else {
    // 用户进入需要登录的页面，则跳转登录界面
    if (to.meta.requireLogin) {
      console.log("但是我没跳转")
      next({
        path: '/login'
      })
      ViewUI.Message.info('请登录')
    } else {
      next()
    }
  }
})
