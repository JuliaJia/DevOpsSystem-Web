import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/LoginView.vue'
import Home from '../views/HomeView.vue'
import Welcome from '../views/AboutView.vue'
import User from '../views/user/UserView.vue'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (localtion) {
  return originalPush.call(this, localtion).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  // {
  //   path: '/users',
  //   component: User
  // },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = window.localStorage.getItem('token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
