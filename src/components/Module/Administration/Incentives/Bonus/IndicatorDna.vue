<script setup>
import { ref } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import { moduleStore } from '@/store'
import FiscalYearAdd from '@/components/Module/Administration/Incentives/Bonus/FiscalYearAdd.vue'
import FiscalYearUpdate from '@/components/Module/Administration/Incentives/Bonus/FiscalYearUpdate.vue'

const module = moduleStore()

const props = defineProps({
  search: String
})

const dialogAdd = ref(false)
const dialogUpdate = ref(false)

const headers = ref([
  {
    title: 'ID',
    align: 'center',
    key: 'id',
    width: '10',
    class: 'brand_verde2 darken-3 text-white'
  },
  {
    title: 'Nome',
    align: 'left',
    key: 'name',
    width: '40%',
    class: 'brand_verde2 darken-3 text-white'
  },
  {
    title: 'Direção',
    align: 'center',
    key: 'direction.name',
    class: 'brand_verde2 darken-3 text-white'
  },
  {
    title: 'Percentual',
    align: 'center',
    key: 'is_percent.label',
    class: 'brand_verde2 darken-3 text-white'
  },
  {
    title: 'Símbolo',
    align: 'center',
    key: 'symbol.name',
    class: 'brand_verde2 darken-3 text-white'
  },

  {
    title: 'Calculo',
    align: 'center',
    key: 'calc.name',
    class: 'brand_verde2 darken-3 text-white'
  },
  {
    title: 'Status',
    align: 'center',
    key: 'active.name',
    width: '125',
    class: 'brand_verde2 darken-3 text-white'
  }
])
</script>
<template>
  <v-card-text class="d-flex py-2">
    <v-icon icon="mdi-hand-pointing-right" class="text-brand_txt pt-2" />
    <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Indicadores</div>
    <v-spacer />
    <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
      Registros: {{ module.data?.fiscalYears?.length }}
    </div>
  </v-card-text>

  <v-card-text class="py-0 pb-3">
    <v-data-table-virtual
      :headers="headers"
      :items="module.data.indicators"
      :loading="module.loading"
      :search="search"
      fixed-header
      density="compact"
      class="elevation-0"
    >
      <template #[`item.status.label`]="{ item }">
        <v-chip :class="'bg-' + item.status.color" size="small">
          {{ item.status.label }}
        </v-chip>
      </template>
    </v-data-table-virtual>
  </v-card-text>

  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-calendar-expand-horizontal-outline"
    header-title="Novo - Ano fiscal"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
    headerheight="35px"
    max-width="350px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <FiscalYearAdd v-model="dialogAdd" />
  </CoreDialog>
  <CoreDialog
    v-model="dialogUpdate"
    header-icon="mdi-calendar-expand-horizontal-outline"
    header-title="Update - Ano fiscal"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
    headerheight="35px"
    max-width="350px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <FiscalYearUpdate v-model="dialogUpdate" :fiscal-year="fiscalYear" />
  </CoreDialog>
</template>
<style scoped>
:deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
}

ul {
  list-style-type: none;
}

/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 2px 2px;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 217px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
