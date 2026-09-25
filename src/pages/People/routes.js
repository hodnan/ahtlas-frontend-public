import moment from 'moment'

const people = [
  {
    path: '/people/employee/current',
    component: () => import('./Employee/Current.vue'),
    meta: { layout: 'layout-default', defaultQuery: { active: 1 } }
  },
  {
    path: '/people/employee/daily',
    component: () => import('./Employee/Daily.vue'),
    meta: { layout: 'layout-default', defaultQuery: { active: 1 } }
  }
]

export default people
