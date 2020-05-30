import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: r => require.ensure([], () => r(require('@/pages/Home.vue')), 'demo')
    },
    {
      path:'/blog/:id',
      name:"blog",
      component: r => require.ensure([], () => r(require('@/pages/Blog.vue')), 'demo')
    },
    {
      path:'/login',
      name:"login",
      component: r => require.ensure([], () => r(require('@/pages/Login.vue')), 'demo')
    },
    //管理页面的路由以及子路由
    {
      path:'/admin/:page',
      name:"admin",
      component: r => require.ensure([], () => r(require('@/pages/Admin.vue')), 'demo'),
      //子路由
      children:[
        {
          path:'/admin/userInformation',
          name:"userInformation",
          component: r => require.ensure([], () => r(require('@/components/background/userinformation.vue')), 'demo'),
          meta:{
            requireLogin:true
          }
        },{
          path:'/admin/newBlog',
          name:"newBlog",
          component: r => require.ensure([], () => r(require('@/components/background/newBlog.vue'),), 'demo'),
          meta:{
            requireLogin:true
          }
        },{
          path:'/admin/editBlog/:id',
          name:"editBlog",
          component: r => require.ensure([], () => r(require('@/components/background/newBlog.vue')), 'demo'),
          meta:{
            requireLogin:true
          }
        },{
          path:'/admin/recover',
          name:"recover",
          component: r => require.ensure([], () => r(require('@/components/background/recover.vue')), 'demo'),
          meta:{
            requireLogin:true
          }
        },{
          path:'/admin/sended',
          name:"sended",
          component: r => require.ensure([], () => r(require('@/components/background/sended.vue')), 'demo'),
          meta:{
            requireLogin:true
          }
        },{
          path:'/admin/userSecurty',
          name:"userSecurty",
          component: r => require.ensure([], () => r(require('@/components/background/userSecurty.vue')), 'demo'),
          meta:{
            requireLogin:true
          }
        }
      ],
      meta:{
        requireLogin:true //需要登录
      }
    },
    //空白跳转
    {
      path: "*",
      redirect: "/"
    }

  ]
})
