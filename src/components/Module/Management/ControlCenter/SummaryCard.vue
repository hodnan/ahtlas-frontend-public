<script setup>
import Chart from '@/components/Module/Management/ControlCenter/Chart.vue'
import { moduleStore } from '@/store'
const module = moduleStore()

const props = defineProps({
  tracking: Object
})
</script>
<template>
  <v-card class="">
    <v-card-title class="d-flex py-1 pt-1 px-2 text-subtitle-1 text-left">
      <span class="text-truncate w-75" :title="tracking.sector_n1.label">
        {{ props.tracking.sector_n1.label }}
      </span>

      <span
        :title="'Stage ' + tracking?.stage?.id"
        class="text-truncate text-right w-25 cursor-pointer"
      >
        <v-icon icon="mdi-circle" size="17" :color="tracking?.stage?.color" variant="plain" />
      </span>
    </v-card-title>

    <v-card-subtitle class="d-flex py-1 pt-1 px-2 mt-n3 text-subtitle-2 text-left">
      <v-icon
        :icon="tracking?.indicator?.direction?.icon"
        :title="tracking?.indicator.direction?.name"
        size="17"
        variant="plain"
      />
      <span class="text-truncate w-75" :title="tracking.indicator.label">
        {{ tracking.indicator.label }}
      </span>
      <!-- <span
        :title="tracking?.indicator.direction?.name"
        class="text-truncate text-left w-25 cursor-pointer"
      >
        <v-icon :icon="tracking?.indicator?.direction?.icon" size="17" variant="plain" />
      </span> -->
    </v-card-subtitle>

    <v-card-text class="px-2 py-0 pb-2 chartBox">
      <Chart class="" :data="tracking.chart" />
    </v-card-text>
    <v-card-text @click.stop="" class="d-flex py-0 px-2 pb-1 text-brand_txt">
      <v-spacer></v-spacer>

      <v-btn
        :loading="module.loading"
        title="Notificações"
        density="compact"
        variant="plain"
        class="mx-2 pb-2"
        color="medium-emphasis"
        icon="mdi-information-variant-circle-outline"
        size="small"
      ></v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            :loading="module.loading"
            title="Responsáveis"
            density="compact"
            variant="plain"
            class="ml-2 mr-1 pb-2"
            v-bind="props"
            icon="mdi-account-group"
            size="small"
          ></v-btn>
        </template>
        <v-list v-if="tracking?.owners?.length > 0">
          <v-list-item
            v-for="item in tracking.owners"
            :key="item?.owner"
            :title="item?.owner?.label"
            :subtitle="item?.sector_n1?.label"
          >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chartBox {
  height: 100px;
}
</style>
