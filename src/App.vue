
<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import router from '@/router/index'
import Snackbar from '@/components/Core/Utils/Snackbar.vue'
import NotAuthorize from '@/components/Core/Navigation/NotAuthorize.vue'
import Error500 from '@/components/Core/Navigation/Error500.vue'
import { coreStore, authStore } from '@/store'

const core = coreStore()
const auth = authStore()

const route = useRouter()
const layout = computed(() => `${route.currentRoute.value.meta.layout || 'layout-empty'}`)
const loading = ref(false)

router.beforeEach((to, from, next) => {
  loading.value = true
  next()
})

router.afterEach(() => {
  loading.value = false
})

const bgClass = computed(() => {
  if (core.routeError500) {
    return 'bg-background_error500'
  } else {
    return ''
  }
})

watch(
  () => core.routeIsNotAuthorized,
  async (value) => {
    if (core.routeIsNotAuthorized) {
      auth.getUser()
    }
  },

  { deep: true }
)
</script>

<template>
  <component :is="layout" :class="bgClass">
    <div v-if="loading || core.loading" class="d-flex justify-center align-center h-100">
      <v-progress-circular
        :size="115"
        :width="4"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>

    <div v-else-if="core.routeIsNotAuthorized" class="d-flex justify-center align-center h-100">
      <NotAuthorize />
    </div>

    <div v-else-if="core.routeError500" class="d-flex justify-center align-center h-100">
      <Error500 />
    </div>

    <router-view v-else />
  </component>
  <Snackbar />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
