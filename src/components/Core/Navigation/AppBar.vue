<script setup>
import { computed } from 'vue'
import { coreStore, authStore, moduleStore } from '@/store'
import ButtonMenu from '@/components/Core/Navigation/ButtonMenu.vue'
import NotifyButton from '@/components/Core/Notify/NotifyButton.vue'
import Info from '@/components/Core/Utils/Info.vue'
import router from '@/router/index'

const core = coreStore()
const module = moduleStore()
const auth = authStore()

const currentMenu = computed(() => {
  const modules = auth?.navigation
  if (!auth?.navigation) return []

  const searchValue = router.currentRoute.value.fullPath.split('?')[0]

  for (const module of modules) {
    if (module.menu_n1) {
      for (const menuN1 of module.menu_n1) {
        if (menuN1.menu_n2) {
          for (const menuN2 of menuN1.menu_n2) {
            if (menuN2.to === searchValue) {
              return menuN1
            }
          }
        }
      }
    }
  }
  return null
})
</script>

<template>
  <v-app-bar density="compact" :absolute="true" color="app">
    <ButtonMenu @click="core.drawerToggle()" />

    <NotifyButton />

    <v-tabs
      v-if="currentMenu?.menu_n2 && (core.loading || module.loading)"
      class="ml-16"
      bg-color="transparent"
      color="brand_silver"
    >
      <v-tab
        :disabled="core.loading || module.loading"
        v-for="menu in currentMenu.menu_n2"
        :key="menu.id"
        :value="menu.route_name"
      >
        {{ menu.title }}
      </v-tab>
    </v-tabs>

    <v-tabs
      v-else-if="currentMenu?.menu_n2"
      class="ml-16"
      bg-color="transparent"
      color="brand_silver"
    >
      <v-tab
        v-for="menu in currentMenu.menu_n2"
        :key="menu.id"
        :to="menu.to"
        :value="menu.route_name"
      >
        {{ menu.title }}
      </v-tab>
    </v-tabs>

    <v-spacer />

    <v-list lines="two" class="py-0 px-2 user_card bg-transparent">
      <v-list-item class="pa-0" density="compact">
        <template v-slot:prepend>
          <v-avatar size="35px">
            <img
              v-if="auth?.user?.avatar?.avatar"
              :src="'data:image/jpeg;base64,' + auth?.user?.avatar?.avatar"
              width="35"
              alt=""
            />
            <img v-else src="/assets/avatar/default.jpg" width="35" alt="" />
          </v-avatar>
        </template>
        <template v-slot:title>
          <div style="width: 160px" class="text-caption text-truncate">
            {{ auth?.user?.name }}
          </div>
        </template>
        <template v-slot:subtitle>
          <div style="width: 160px" class="text-caption text-truncate">
            {{ auth?.user?.employee?.position_summary }}
          </div>
        </template>
      </v-list-item>
    </v-list>

    <Info />
    <!-- <v-btn class="mr-14" rounded="0" color="transparent" elevation="0">
      <v-icon color="brand_silver" size="x-large" icon="mdi-information-variant-circle-outline" />
    </v-btn> -->
    <!-- <v-btn icon="mdi-information-variant-circle-outline " variant="plain" class="mr-14"> </v-btn> -->
    <!-- {{ currentMenu }} -->
  </v-app-bar>
</template>

<style scoped>
.user_card {
  margin-right: 125px;
  max-width: 270px;
}
</style>
