<script setup>
import { coreStore, moduleStore } from '@/store'
const core = coreStore()
const moduleSt = moduleStore()

const goTo = async (menu) => {
  if (!moduleSt.loading && !core.loading) {
    core.setActiveMenuN1(menu)
    core.drawerClose()
  }
}
</script>
<template>
  <v-card class="mx-0 pb-2 mt-0 px-0 pt-1" color="transparent" elevation="0">
    <v-card-title
      class="py-1 mr-4 text-body-1 font-weight-bold text-truncate brand_xtx--text text-uppercase"
    >
      {{ module.title }}
    </v-card-title>
    <v-divider class="mx-2" style="border-width: 1px !important"></v-divider>
    <v-card-text class="pt-2 pl-3 pr-4 pb-0">
      <v-card-text class="pa-0" style="max-height: 200px">
        <v-list v-if="moduleSt.loading || core.loading" density="compact" class="pa-0">
          <v-list-item v-for="menu in module.menu_n1" :key="menu.id">
            <template v-slot:prepend>
              <!-- <v-icon class="mr-n3 ml-0 opacity-50" size="30" :icon="menu.icon"></v-icon>
                -->
              <v-progress-circular
                :size="25"
                class="mr-3 ml-0 opacity-50"
                color="brand_xtx--text"
                indeterminate
              ></v-progress-circular>
            </template>

            <v-list-item-title class="text-subtitle-1 brand_xtx--text opacity-50 font-weight-light">
              {{ menu.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <!--  -->
        <v-list v-else density="compact" class="pa-0">
          <v-list-item v-for="menu in module.menu_n1" :key="menu.id" @click="goTo(menu)">
            <template v-slot:prepend>
              <v-icon class="mr-n3 ml-0" size="30" :icon="menu.icon"></v-icon>
            </template>

            <v-list-item-title class="text-subtitle-1 brand_xtx--text font-weight-light">
              {{ menu.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    module: {
      type: [Array, Object],
      default() {
        return {
          id: '0',
          title: 'Não localizado',
          icon: '',
          sys_menu_n1: [
            {
              id: '0',
              module_id: '0',
              title: 'Não localizado',
              icon: 'mdi-robot',
              to: '/',
              route_api: '/'
            }
          ]
        }
      }
    }
  }
}
</script>

<style scoped>
.brand_v-list-item_active {
  opacity: 1 !important;
}
.brand_v-list-item {
  opacity: 0.7;
}
</style>
