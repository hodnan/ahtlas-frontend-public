import { defineStore } from 'pinia'

export const coreStore = defineStore({
  id: 'core',
  state: () => ({
    drawer: false,
    drawerTop: false,
    loading: false,
    notify: false,
    lastRoute: null,
    routeIsNotAuthorized: false,
    routeError500: false,
    routeData: null,
    routeInfo: null
  }),
  actions: {
    drawerToggle() {
      this.drawer = !this.drawer
    },
    drawerClose() {
      this.drawer = false
    },
    drawerTopToggle() {
      this.drawerTop = !this.drawerTop
    },
    drawerTopClose() {
      this.drawerTop = false
    },
    setLoading(v) {
      this.loading = v
    },
    notifyToggle() {
      this.drawer = false
      this.notify = !this.notify
    },
    setActiveMenuN1(v) {
      if (v) {
        const defautRoute = v.menu_n2[0]
        this.router.push(defautRoute.to)
      }
    },
    setLastRoute(v) {
      this.lastRoute = v
      localStorage.setItem('lastRoute', this.lastRoute)
    },
    setNotAuthorized(value) {
      this.routeIsNotAuthorized = value
    },
    setRouteError500(value) {
      this.routeError500 = value
    },
    setRouteData(value) {
      this.routeData = value
    },
    setRouteInfo(value) {
      this.routeInfo = value
    }
  }
})
