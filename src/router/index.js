import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import petugas from '../views/datapetugas.vue'
import kategori from '../views/kategori.vue'
import data_masyarakat from '../views/data_masyarakat.vue'
import data_pengaduan from '../views/data_pengaduan.vue'
// import poin_siswa from '../views/poin_siswa.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import Navbar from '../views/layouts/Navbar.vue'
import Footer from '../views/layouts/Footer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/',
    name: 'home',
    components: {default: Home, header: Navbar, footer: Footer},
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/petugas',
    name: 'petugas',
    components: {default: petugas, header: Navbar, footer: Footer},
    meta: 
    {
      requiresAuth: true
    }
  },
  {
    path: '/data_masyarakat',
    name: 'data_masyarakat',
    components: {default: data_masyarakat, header: Navbar, footer: Footer},
    meta:
    {
      requiresAuth: true
    }
  },
  {
    path: '/kategori',
    name: 'kategori',
    components: {default: kategori, header: Navbar, footer: Footer},
    meta:
    {
      requiresAuth: true
    }
  },
  {
    path: '/data_pengaduan',
    name: 'data_pengaduan',
    components: {default: data_pengaduan, header: Navbar, footer: Footer},
    meta:
    {
      requiresAuth: true
    }
  },
  // {
  //   path: '/poin_siswa',
  //   name: 'poin_siswa',
  //   components: {default: poin_siswa, header: Navbar, footer: Footer},
  //   meta:
  //   {
  //     requiresAuth: true
  //   }
  // },
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   components: {default: Profile, header: Navbar, footer: Footer},
  //   meta: { 
  //     requiresAuth: true
  //   }
  // },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router
