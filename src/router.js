import Vue from "vue";
import Router from "vue-router";
import Login from './views/login/index.vue';
import Layout from '@/components/Layout';
import Home from '@/views/home';
import Staff from '@/views/staff';
import Supplier from '@/views/supplier';
import Member from '@/views/member';
import Goods from '@/views/goods';
Vue.use(Router);

export default new Router({
    routes:[
      {
        path:'/login',
        name:'login',
        component:Login
      },
      {
        path:"/",
        name:'layout',
        component:Layout,
        redirect:'/home',
        children:[
          {
            path:'/home',
            component:Home,
            meta:{title:'首页'}
          }
        ]
      },
      {
        path:'/member',
        component:Layout,
        children:[
          {
            path:'/member/',
            component:Member,
            meta:{title:'会员管理'}
          }
        ]
      },
      {
        path:'/staff',
        component:Layout,
        children:[
          {
            path:'/staff/',
            component:Staff,
            meta:{title:'员工管理'}
          }
        ]
      },
      {
        path:'/supplier',
        component:Layout,
        children:[
          {
            path:'/supplier/',
            component:Supplier,
            meta:{title:'供应商管理'}
          }
        ]
      },
      {
        path:'/goods',
        component:Layout,
        children:[
          {
            path:'/goods/',
            component:Goods,
            meta:{title:'商品管理'}
          }
        ]
      }
    ]
});
