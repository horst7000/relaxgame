import { createRouter, createWebHistory } from 'vue-router'
	
const Home = () => import('../views/Home.vue')

const routes = [
    { path: '/', component: Home },
  ]
const router = createRouter({
    history: createWebHistory(),
    routes, // short for `routes: routes`
  })
export default router