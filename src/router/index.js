import Vue from 'vue'
import VueRouter from 'vue-router'

import Cookies from "js-cookie"

import LandingPage from '../views/LandingPage/index.vue'
import Users from '../views/Users/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
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
