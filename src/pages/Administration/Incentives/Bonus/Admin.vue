<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { moduleStore } from '@/store'

const FiscalYear = defineAsyncComponent(
  () => import('@/components/Module/Administration/Incentives/Bonus/FiscalYear.vue')
)
const IndicatorDna = defineAsyncComponent(
  () => import('@/components/Module/Administration/Incentives/Bonus/IndicatorDna.vue')
)
const Panel = defineAsyncComponent(
  () => import('@/components/Module/Administration/Incentives/Bonus/Panel.vue')
)
const Block = defineAsyncComponent(
  () => import('@/components/Module/Administration/Incentives/Bonus/Block.vue')
)

const module = moduleStore()

const filter = ref({
  fiscalYear: null,
  activeMonth: null
})

onMounted(async () => {
  await setFilters()
})

const setFilters = async () => {
  filter.value.fiscalYear = module?.data?.activefiscalYear
  filter.value.activeMonth = module?.data?.activeMonth
  await module.setUrlParams(filter.value)
}

const tab = ref(null)
const search = ref(null)

const getNewdata = async () => {
  await module.setUrlParams(filter.value)
  await module.getDataPart('api/administration/incentives/bonus/admin', [
    'fiscalYears',
    'activefiscalYear',
    'months',
    'activeMonth',
    'bonusBlock',
    'panels'
  ])
  await setFilters()
}

watch(
  () => module?.data?.submit,
  () => {
    if (module.data.submit) {
      getNewdata()
      module.data.submit = false
    }
  }
)
</script>
<template>
  <v-card class="mb-2">
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="2">
          <v-autocomplete
            v-model="filter.fiscalYear"
            density="compact"
            label="Ano Fiscal"
            color="primary"
            class="inputH40"
            :items="module.data.fiscalYears"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="public_id"
            hide-spin-buttons
            closable-chips
            menu-icon=""
            @update:modelValue="getNewdata"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="pa-1" cols="1">
          <v-autocomplete
            v-model="filter.activeMonth"
            density="compact"
            label="Mês"
            color="primary"
            class="inputH40"
            :items="module.data.months"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="value"
            hide-spin-buttons
            closable-chips
            menu-icon=""
            @update:modelValue="getNewdata"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="search"
            density="compact"
            label="Buscar"
            color="primary"
            class="inputH40"
            :items="module.data.fiscalYears"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="public_id"
            hide-spin-buttons
            closable-chips
            menu-icon=""
          >
          </v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-tabs v-model="tab">
            <v-tab value="panel">Paineis</v-tab>
            <v-tab value="blocks">Blocos</v-tab>
            <v-tab value="indicators">Indicadores</v-tab>
            <v-tab value="fiscalYear">Ano Fiscal</v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="fiscalYear">
        <FiscalYear :search="search" />
      </v-tabs-window-item>
      <v-tabs-window-item value="indicators">
        <IndicatorDna :search="search" />
      </v-tabs-window-item>

      <v-tabs-window-item value="blocks">
        <Block :search="search" />
      </v-tabs-window-item>
      <v-tabs-window-item value="panel">
        <Panel :search="search" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>
