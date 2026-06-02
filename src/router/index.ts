import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
    },
    {
      path: '/shortcuts',
      name: 'shortcuts',
      component: () => import('../views/Shortcuts.vue'), // 懒加载快捷键管理页面
    },
    {
      path: '/topology',
      name: 'topology',
      component: () => import('../views/Network/TopologyCanvas.vue'), // 懒加载拓扑画布页面
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/Network/ConnectionTesy.vue'), // 懒加载拓扑画布页面
    }
  ] // 这是 routes 数组的结束
}); // 这是 createRouter 的结束

export default router;