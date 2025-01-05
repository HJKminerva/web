import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes:[
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'), // 懒加载
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'), // 懒加载
    }
  ]
});

export default router;


