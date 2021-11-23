import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import TeamApp from '../views/TeamApp.vue'
import MemberManager from '../views/MemberManager.vue'
import Dashboard from '../views/Dashboard.vue'
import NotFound from '../views/404.vue'
import Login from '../views/Login.vue'
import MemberReq from '../views/MemberReq.vue'
import { userService } from '../services/userService'

Vue.use(VueRouter)



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/team',
    name: 'Team',
    component: TeamApp,
    
  },
  {
    path: '/member',
    name: 'Member',
    component: MemberManager
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/request',
    name: 'Request',
    component: MemberReq
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const loggedinUser = userService.getUser()
  if (to.name !== 'Login' && to.name !== 'Home' && !loggedinUser) next({ name: 'Login' })
  else next()
})

export default router
