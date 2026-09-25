<script setup>
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import IndicadorAdd from '@/components/Module/Administration/Intelligence/IndicatorAdd.vue'
import IndicadorUpdate from '@/components/Module/Administration/Intelligence/IndicatorUpdate.vue'
import { coreStore, moduleStore } from '@/store'

const core = coreStore()
const module = moduleStore()
const dialogAdd = ref(false)
const dialogUpdate = ref(false)
const updateData = ref(false)
const search = ref()

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

const dialogUpdateOpen = (event, item) => {
  updateData.value = item.item
  dialogUpdate.value = true
}
</script>
<template>
  <v-card>
    <v-card-text class="d-flex">
      <v-text-field
        v-model="search"
        density="compact"
        color="primary"
        label="Buscar"
        hide-details=""
        prependInnerIcon="mdi-filter"
        variant="outlined"
      />
    </v-card-text>
  </v-card>

  <v-card class="mt-3 pa-0">
    <v-card-text class="d-flex">
      <v-icon icon="mdi-hand-pointing-right" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Indicadores</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.indicators?.length }}
      </div>
      <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd = true">
        <v-icon icon="mdi-plus" />
      </v-btn>
    </v-card-text>

    <v-card-text class="pt-0">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data?.indicators"
        :loading="module.loading"
        :search="search"
        item-value="label"
        item-key="id"
        fixed-header
        density="compact"
        class="elevation-0"
        @click:row="dialogUpdateOpen"
      >
      </v-data-table-virtual>
    </v-card-text>
  </v-card>

  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-hand-pointing-right"
    header-title="Novo - Indicador"
    body-class="overflow-auto overflow-x-hidden bg-dialog pa-3"
    headerheight="35px"
    max-width="500px"
    header-class="bg-brand_verde_dark"
  >
    <IndicadorAdd v-model="dialogAdd" />
  </CoreDialog>
  <CoreDialog
    v-model="dialogUpdate"
    header-icon="mdi-hand-pointing-right"
    header-title="Update - Indicador"
    body-class="overflow-auto overflow-x-hidden bg-dialog pa-3"
    headerheight="35px"
    max-width="500px"
    header-class="bg-brand_verde_dark"
  >
    <!-- <pre>
        {{ updateData }}
    </pre> -->
    <IndicadorUpdate v-model="dialogUpdate" :data="updateData" />
  </CoreDialog>
</template>

<style scoped>
/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 250px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>