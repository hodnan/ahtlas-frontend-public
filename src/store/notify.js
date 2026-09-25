import { defineStore } from 'pinia'

export const notifyStore = defineStore({
  id: 'notify',
  state: () => ({
    drawer: false,
    errors: [],
    success: null,
    isFetching: false,
    messages: []
  }),
  actions: {
    drawerToggle() {
      this.drawer = !this.drawer
    },
    drawerClose() {
      this.drawer = false
    },
    setErrors(v) {
      this.errors = v
    },
    setSuccess(v) {
      this.success = null
      this.success = v
    },
    async getMessagesNew() {
      if (this.isFetching) return // Evita chamadas concorrentes

      this.isFetching = true
      try {
        await axios.post('/api/administration/core/notify/user').then((response) => {
          if (response?.data?.length > 0) {
            this.messages = [...response.data, ...this.messages]
          }
        })
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
      } finally {
        this.isFetching = false // Libera para novas chamadas
      }
    },
    async getMessages() {
      if (this.isFetching) return // Evita chamadas concorrentes

      this.isFetching = true
      try {
        await axios.post('/api/administration/core/notify/user').then((response) => {
          if (response?.data?.length > 0) {
            this.messages = [...response.data, ...this.messages]
          }
        })
      } catch (error) {
        console.error('Erro ao buscar notificações:', error)
      } finally {
        this.isFetching = false // Libera para novas chamadas
      }
    }
  }
})
