import { createRouter, createWebHashHistory } from 'vue-router'
import App                                    from './App.vue'

import Login                                  from './components/Login.vue'
import SignUp                                 from './components/SignUp.vue'
import CreateDep                              from './components/CreateDep.vue'

const routes = [
  {
    path: '/',
    name: 'root',
    component: App
  },
  {
    path: '/user/login',
    name: "login",
    component: Login
  },
  {
    path: '/user/signUp',
    name: "signUp",
    component: SignUp
  },
  {
    path: '/user/createDep',
    name: "createDep",
    component: CreateDep
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
