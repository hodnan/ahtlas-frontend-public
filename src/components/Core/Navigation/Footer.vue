<script setup>
import { computed } from 'vue'
import router from '@/router/index'
import { authStore } from '@/store'
const auth = authStore()

const crumbs = computed(() => {
  let routes = router.currentRoute.value.fullPath.toUpperCase().split('?')
  routes = routes[0].toUpperCase().split('/')

  return routes
})
</script>
<template>
  <v-footer app height="25" color="footer" class="px-0">
    <v-breadcrumbs :items="crumbs" class="pa-0 pl-1 text-caption" />

    <v-spacer />
    <span class="server text-caption"> <b>Ambiente:</b> {{ auth.server }} </span>
  </v-footer>
</template>

<style scoped>
.server {
  margin-right: 400px;
  max-width: 270px;
}
:deep(.v-breadcrumbs-item) {
  font-size: 0.6rem !important;
}
:deep(.v-breadcrumbs-divider) {
  padding-left: 0px !important;
  padding-right: 0px !important;
  padding-bottom: 2px !important;
}
</style>
