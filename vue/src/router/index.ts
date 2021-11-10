import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/sellerpage',
    name: 'SellerPage',
    component: () => import('@/views/SellerPage.vue')
  },
  {
    path: '/trendpage',
    name: 'TrendPage',
    component: () => import('@/views/TrendPage.vue')
  },
  {
    path: '/mappage',
    name: 'MapPage',
    component: () => import('@/views/MapPage.vue')
  },
  {
    path: '/rankpage',
    name: 'RankPage',
    component: () => import('@/views/RankPage.vue')
  },
  {
    path: '/hotpage',
    name: 'HotPage',
    component: () => import('@/views/HotPage.vue')
  },
  {
    path: '/stockpage',
    name: 'StockPage',
    component: () => import('@/views/StockPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
