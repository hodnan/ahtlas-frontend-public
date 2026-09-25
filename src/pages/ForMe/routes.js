import moment from 'moment'
const forMeRoutes = [
  {
    path: '/for-me/trade/time',
    component: () => import('./Trade/TradeTime.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/for-me/trade/time-admin',
    component: () => import('./Trade/TradeTimeAdmin.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/for-me/links',
    component: () => import('./Links.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/for-me/incentives/bonus',
    component: () => import('../Administration/Incentives/Bonus/Team.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: { month_ref: moment().format('YYYY-MM') }
    }
  }
]

export default forMeRoutes
