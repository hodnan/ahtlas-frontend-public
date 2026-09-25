import './assets/main.css'
import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { notifyStore, coreStore, moduleStore } from '@/store'
import vuetify from './Plugins/vuetify'
import App from './App.vue'
import router from './router'
import DefaultLayout from '@/components/Layouts/Default.vue'
import GuestLayout from '@/components/Layouts/Guest.vue'
import EmptyLayout from '@/components/Layouts/Empty.vue'

import { ref, reactive, computed, watch } from 'vue'
import { useForm } from 'vee-validate'

const pinia = createPinia()

pinia.use(({ store }) => {
  store.router = markRaw(router)
})

const app = createApp(App)

app.use(pinia)

const notify = notifyStore()
const core = coreStore()
const module = moduleStore()

app.use(vuetify)
app.use(router)
vuetify.theme.global.name.value = localStorage.getItem('theme') || 'light'
window.ref = ref
window.reactive = reactive
window.computed = computed
window.watch = watch
window.useForm = useForm
// cria as stores globais do pinia
window.notify = notify
window.module = module
window.core = core
// Importante! chama o axios depois das stores do pinia

app.component('layout-default', DefaultLayout)
app.component('layout-guest', GuestLayout)
app.component('layout-empty', EmptyLayout)

import axiosInstance from './Plugins/axios'

window.axios = axiosInstance

app.mount('#app')
