const defaultRoutes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: { layout: 'layout-empty' }
  },
  { path: '/', component: () => import('../pages/Home.vue'), meta: { layout: 'layout-default' } },

  {
    path: '/login',
    component: () => import('../pages/Login.vue'),
    meta: { layout: 'layout-guest' }
  }
]

export default defaultRoutes
