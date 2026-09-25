import moment from 'moment'

const administrationRoutes = [
  {
    path: '/administration/core/info',
    component: () => import('./Core/Info.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/administration/core/accesses',
    component: () => import('./Core/Accesses.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/administration/core/modules',
    component: () => import('./Core/Modules.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/administration/core/notify',
    component: () => import('./Core/Notify.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/administration/intelligence/indicators',
    component: () => import('./Intelligence/Indicators.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/administration/intelligence/kpi-updates',
    component: () => import('./Intelligence/KpiUpdates.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/administration/intelligence/kpi-sources',
    component: () => import('./Intelligence/KpiSources.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/administration/intelligence/tokens',
    component: () => import('./Intelligence/Tokens.vue'),
    meta: { layout: 'layout-default' }
  },
  {
    path: '/administration/planning/file-load',
    component: () => import('./Planning/FileLoad.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: { month_ref: moment().format('YYYY-MM'), type: 0 }
    }
  },
  {
    path: '/administration/incentives/rv/terms',
    component: () => import('./Incentives/RV/Terms.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/administration/incentives/rv/terms-evaluations',
    component: () => import('./Incentives/RV/TermsEvaluation.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/administration/incentives/rv/terms-query',
    component: () => import('./Incentives/RV/TermQuery.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: { month_ref: moment().format('YYYY-MM') }
    }
  },
  {
    path: '/management/myteam/terms-adherence',
    component: () => import('./Incentives/RV/TermsAdherence.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/management/myteam/terms-to-approve',
    component: () => import('./Incentives/RV/TermsToApprove.vue'),
    meta: { layout: 'layout-default', defaultQuery: { month_ref: moment().format('YYYY-MM') } }
  },
  {
    path: '/for-me/incentives/terms-to-signature',
    component: () => import('./Incentives/RV/TermsToSignature.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: { month_ref: moment().format('YYYY-MM') }
    }
  },

  {
    path: '/administration/incentives/bonus/admin',
    component: () => import('./Incentives/Bonus/Admin.vue'),
    meta: {
      layout: 'layout-default',
      defaultQuery: { month_ref: moment().format('YYYY-MM') }
    }
  }
]

export default administrationRoutes
