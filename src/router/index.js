import { createRouter, createWebHistory } from 'vue-router'
import defaultRoutes from './defaultRoutes.js'
import administrationRoutes from '../pages/Administration/routes.js'
import managementRoutes from '../pages/Management/routes.js'
import forMeRoutes from '../pages/ForMe/routes.js'
import tacticalCenter from '../pages/TacticalCenter/routes.js'
import people from '../pages/People/routes.js'

const routes = [
  ...defaultRoutes,
  ...administrationRoutes,
  ...managementRoutes,
  ...forMeRoutes,
  ...tacticalCenter,
  ...people
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const ignoredRoutes = ['/', '/login', '/logout', '/not-authorize']

router.beforeEach(async (to, from, next) => {
  core.setLoading(true)
  core.setRouteError500(false)
  core.setNotAuthorized(false)
  core.setRouteInfo(false)

  next()

  if (from.path != to.path && from.path != '/login' && from.path != '/') {
    module.clearUrlParams()
  }

  let url = `api${to.path}`
  let queryString = new URLSearchParams(window.location.search).toString()
  if (!core.routeIsNotAuthorized) {
    if (!queryString && to.meta.defaultQuery) {
      queryString = new URLSearchParams(to.meta.defaultQuery).toString()
    }
    url = queryString ? `api${to.path}?${queryString}` : url
  }

  const routeExists = router.getRoutes().some((route) => route.path === to.path)
  try {
    if (!ignoredRoutes.includes(to.path) && routeExists) {
      const response = await axios.get(url)
      if (response.status === 200) {
        core.setRouteData(response?.data?.data)
        core.setLoading(false)
        core.setNotAuthorized(false)
        core.setRouteError500(false)
        core.setRouteInfo(response?.data?.info)
        module.setData(response?.data?.dataModule)
      } else if (response.status === 203) {
        core.setLoading(false)
        core.setNotAuthorized(true)
        core.setRouteError500(false)
        module.setData(false)
      } else if (response.status === 205) {
        core.setLoading(false)
        core.setNotAuthorized(false)
        core.setRouteError500(true)
        module.setData(false)
      } else {
        core.setLoading(false)
        core.setNotAuthorized(false)
        core.setRouteError500(true)
        module.setData(false)
      }
    } else {
      core.setLoading(false)
      core.setNotAuthorized(false)
    }
  } catch (error) {
    core.setLoading(false)
    core.setNotAuthorized(false)
    core.setRouteError500(true)
    module.setData(false)
  }

  if (queryString && !window.location.search) {
    module.setUrlParams(to.meta.defaultQuery)
  }
})

export default router
