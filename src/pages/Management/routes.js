import moment from 'moment'

const managementRoutes = [
  {
    path: '/management/myteam/aipower',
    component: () => import('./MyTeam/AiPower.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/management/control-center/admin',
    component: () => import('./ControlCenter/Admin.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/management/control-center/tracking',
    component: () => import('./ControlCenter/Tracking.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/management/control-center/employee-results',
    component: () => import('./ControlCenter/EmployeeResults.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/management/control-center/stages',
    component: () => import('./ControlCenter/Stages.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: {
        created_at: moment().format('YYYY-MM-DD')
      }
    }
  }
]

export default managementRoutes
