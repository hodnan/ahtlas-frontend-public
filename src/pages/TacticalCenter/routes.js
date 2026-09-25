import moment from 'moment'

const tacticalCenter = [
  {
    path: '/tactical-center/bulletin/hour-hour',
    component: () => import('./Bulletin/HourHour.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: { date_ref: moment().format('YYYY-MM-DD') }
    }
  },
  {
    path: '/tactical-center/bulletin/command-center',
    component: () => import('./Bulletin/CommandCenter.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/tactical-center/reports',
    component: () => import('./Reports/Reports.vue'),
    meta: { layout: 'layout-default', defaultQuery: { active: '1' } }
  },
  {
    path: '/tactical-center/head-count/overview',
    component: () => import('./HeadCount/Overview.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/tactical-center/head-count/hierarchy',
    component: () => import('./HeadCount/Hierarchy.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/tactical-center/head-count/sector',
    component: () => import('./HeadCount/Sector.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/tactical-center/bulletin/backoffice',
    component: () => import('./Bulletin/Backoffice.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: {
        date_start: moment().format('YYYY-MM-DD'),
        date_end: moment().format('YYYY-MM-DD'),
        time_start: '00:00',
        time_end: '23:59',
        group: 'username',
        filter: 'false'
      }
    }
  }
]

export default tacticalCenter
