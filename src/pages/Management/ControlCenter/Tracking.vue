<script setup>
import { ref, computed, watch } from 'vue'
import SummaryCard from '@/components/Module/Management/ControlCenter/SummaryCard.vue'
import moment from 'moment'
import { moduleStore } from '@/store'

const module = moduleStore()
const urlParams = new URLSearchParams(window.location.search)
const search = ref()
const filter = ref({
  month_ref: urlParams.get('month_ref') ?? moment().format('YYYY-MM')
})

const trackings = computed(() => {
  let temp = JSON.parse(JSON.stringify(module.data?.trackings ?? []))

  if (!search.value) return temp

  return temp.filter((item) => {
    const data = JSON.stringify(item).toLowerCase()
    return data.includes(search.value.toLowerCase())
  })
})

watch(
  () => filter,
  async (value) => {
    await module.setUrlParams(filter.value)
    await module.getDataPart('/api/management/control-center/tracking', ['trackings'], filter.value)
  },

  { deep: true }
)
</script>
<template>
  <v-card>
    <v-card-text class="pa-1">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="2 ">
          <v-text-field
            v-model="filter.month_ref"
            class="w-100"
            density="compact"
            color="primary"
            label="Data"
            hide-details=""
            variant="outlined"
            type="month"
          >
            &nbsp;
          </v-text-field>
        </v-col>

        <v-col class="pa-1" cols="10">
          <v-text-field
            v-model="search"
            class="w-100"
            density="compact"
            color="primary"
            label="Busca Geral"
            hide-details=""
            variant="outlined"
          >
            &nbsp;
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-col
    cols="12"
    class="pr-1 pl-0 pb-2 pt-3 overflow-auto overflow-x-hidden mt-2 border-imput_border rounded"
    style="height: calc(100vh - 161px)"
  >
    <div v-if="trackings?.length == 0" class="d-flex justify-center align-center h-100">
      <v-progress-circular
        v-if="module.loading"
        :size="115"
        :width="4"
        color="primary"
        indeterminate
      />
      <div v-if="!module.loading">Nenhum dado encontrado</div>
    </div>
    <v-row class="px-2">
      <v-col
        v-for="tracking in trackings"
        :key="`${tracking.month_ref}-${tracking.sector_n1_id}-${tracking.indicator_id}`"
        cols="12"
        sm="12"
        md="6"
        xl="3"
        class="pa-1"
      >
        <SummaryCard class="chart" :tracking="tracking" />
      </v-col>
    </v-row>
  </v-col>
</template>
