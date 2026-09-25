import { defineStore } from 'pinia'

export const authStore = defineStore({
  id: 'auth',
  state: () => ({
    user: null,
    navigation: null,
    server: null,
    loading: false,
    checkingSession: false
  }),

  actions: {
    async getToken() {
      await axios.get('/sanctum/csrf-cookie')
    },
    async getUser() {
      this.user = JSON.parse(localStorage.getItem('user'))
      this.navigation = JSON.parse(localStorage.getItem('navigation'))

      if (!this.user) {
        this.loading = true
      }
      try {
        await this.getToken()
        await axios.get('/api/auth/user').then((response) => {
          if (response?.data?.data?.user) {
            this.user = response?.data?.data.user
            this.navigation = response?.data?.data.navigation
            this.server = response?.data?.data.server
            this.loading = false
            localStorage.setItem('user', JSON.stringify(this.user))
            localStorage.setItem('navigation', JSON.stringify(this.navigation))
          } else {
            this.user = null
            this.navigation = null
            this.server = null
            localStorage.removeItem('user')
            localStorage.removeItem('navigation')
            this.router.push('/login')
          }
        })
      } catch (error) {
        localStorage.removeItem('user')
        this.router.push('/login')
      }
    },
    async guest() {
      const route = localStorage.getItem('lastRoute') ?? '/'
      this.loading = false
      this.user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
      if (this.user) {
        notify.setErrors([['Rota não permitida para usuários logados']])
        this.router.push(route)
      }
    },
    async login(form) {
      const route = localStorage.getItem('lastRoute') ?? '/'
      this.loading = true

      await this.getToken()
      await axios
        .post('/api/auth/login', form)
        .then((response) => {
          if (response.status === 200) {
            this.router.push(route)
          }
        })
        .catch((error) => {
          console.error('Erro ao enviar mensagem:', error)
        })
      this.loading = false
    },
    async logout() {
      this.loading = true
      this.user = null
      await this.getToken()
      await axios.delete('/api/auth/logout').then(() => {
        localStorage.removeItem('user')
        this.router.push('/login')
      })
    },
    async isSessionActive() {
      this.checkingSession = true
      try {
        await this.getToken()
        await axios.post('/api/auth/checking-session').then((response) => {
          this.checkingSession = false
          if (response?.data?.data?.is_active) {
            this.router.push('/')
          }
        })
      } catch (error) {
        this.checkingSession = false
      }
    }
  }
})
