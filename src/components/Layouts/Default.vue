<script setup>
import { onMounted, watch } from 'vue'

import CoreApp from '@/components/Core/Navigation/AppBar.vue'
import CoreDrawer from '@/components/Core/Navigation/Drawer.vue'
import CoreFooter from '@/components/Core/Navigation/Footer.vue'
import Notify from '@/components/Core/Notify/NotifyDrawer.vue'
import AssistantChat from '@/components/Core/Navigation/AssistantChat.vue'

import router from '@/router/index'

import { authStore, coreStore } from '@/store'

const auth = authStore()
const core = coreStore()

onMounted(async () => {
  core.setLastRoute(router.currentRoute.value.fullPath)
  await auth.getUser()
})

watch(
  () => router.currentRoute.value.fullPath,
  () => {
    core.setLastRoute(router.currentRoute.value.fullPath)
  }
)
</script>
<template>
  <v-container v-if="auth.loading" fluid className="pa-0 overflow-auto container_main ">
    <div class="d-flex justify-center align-center h-100">
      <v-progress-circular
        :size="115"
        :width="4"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </v-container>

  <v-app v-else>
    <Notify />
    <CoreDrawer />
    <CoreApp />
    <CoreFooter />
    <AssistantChat />
    <v-main>
      <v-container fluid className="pa-2 overflow-auto container_main ">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
<style scoped>
.container_main {
  height: calc(100vh - 73px);
}
</style>
