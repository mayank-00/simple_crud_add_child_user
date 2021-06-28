import Vue from 'vue'
import VueRouter from 'vue-router'

import Cookies from "js-cookie"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: () => import(/* webpackChunkName: "/" */ '../views/LandingPage/index.vue')
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "users" */ '../views/Users/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let isToken = !!Cookies.get('token')
  if (to.fullPath === '/users') {
    if (!isToken) {
      next('/');
    }
  }
  if (to.fullPath === '/') {
    if (isToken) {
      next('/users');
    }
  }
  next();
});

export default router
