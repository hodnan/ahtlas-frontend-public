<script setup>
import { coreStore, authStore } from '@/store'
import UserCard from '@/components/Core/Navigation/UserCard.vue'
import CoreModule from '@/components/Core/Navigation/Module.vue'
import ToggleTheme from '@/components/Core/ToggleTheme.vue'
import ButtonMenu from '@/components/Core/Navigation/ButtonMenu.vue'
import NotifyButton from '@/components/Core/Notify/NotifyButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const drawerWidth = ref(window.innerWidth)

const core = coreStore()
const auth = authStore()

watch(
  () => core.drawer,
  () => {
    drawerWidth.value = window.innerWidth
  }
)

const logout = async () => {
  await auth.logout()
}
</script>

<template>
  <v-navigation-drawer
    v-model="core.drawer"
    elevation="0"
    :width="drawerWidth"
    class="pt-15"
    dark
    temporary
    color="app darken-2 pt-5 px-5"
    hide-overlay
  >
    <ButtonMenu @click="core.drawerToggle()"></ButtonMenu>
    <NotifyButton />

    <v-row>
      <v-col cols="12" sm="12" md="4" xl="4" class="py-8 px-0">
        <UserCard />
      </v-col>
      <v-col
        v-for="item in auth.navigation"
        :key="item.id"
        cols="12"
        sm="12"
        md="4"
        xl="4"
        class="py-4 px-2"
      >
        <CoreModule :module="item"></CoreModule>
      </v-col>
    </v-row>
    <v-sheet class="footer pa-3 d-flex" color="app">
      <v-spacer />

      <v-btn @click="core.drawerClose" to="/" rounded="0" color="transparent" elevation="0">
        <v-icon size="x-large">mdi-home-roof</v-icon>
      </v-btn>

      <ToggleTheme @click="core.drawerClose" />
      <v-btn @click="logout()" rounded="0" color="transparent" elevation="0">
        <v-icon size="x-large">mdi-exit-to-app</v-icon>
      </v-btn>
    </v-sheet>
  </v-navigation-drawer>
</template>

<style scoped>
.drawer {
  width: 100vw !important;
}
.v-navigation-drawer {
  z-index: 999999 !important;
}

.footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100vw;
}
</style>
