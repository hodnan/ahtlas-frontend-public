<script setup>
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import KpiSoureceAdd from '@/components/Module/Administration/Intelligence/KpiSoureceAdd.vue'
import KpiSoureceUpdate from '@/components/Module/Administration/Intelligence/KpiSoureceUpdate.vue'
import { coreStore, moduleStore } from '@/store'

const core = coreStore()
const module = moduleStore()
const dialogAdd = ref(false)
const dialogUpdate = ref(false)
const updateId = ref(false)
const search = ref()

const headers = ref([
  {
    title: 'Id',
    align: 'center',
    key: 'id',
    sortable: true,
    width: '10'
  },
  {
    title: 'Banco',
    align: 'left',
    key: 'db',
    width: '10'
  },
  {
    title: 'Fonte de dados',
    align: 'left',
    key: 'source'
  },
  {
    title: 'Responsável',
    align: 'left',
    key: 'owner.label'
  },
  {
    title: 'Status',
    align: 'center',
    key: 'active.name',
    width: '10'
  },
  {
    title: 'Update',
    align: 'center',
    key: 'updated_at',
    width: '150'
  }
])

const updateOpen = (event, item) => {
  updateId.value = item.item.id
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
      <v-icon icon="mdi-database-cog-outline" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Fontes de dados</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.kpiSources?.length }}
      </div>
      <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd = true">
        <v-icon icon="mdi-plus" />
      </v-btn>
    </v-card-text>

    <v-card-text class="pt-0">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data?.kpiSources"
        :loading="module.loading"
        :search="search"
        item-value="label"
        item-key="id"
        fixed-header
        density="compact"
        class="elevation-0"
        @click:row="updateOpen"
      >
      </v-data-table-virtual>
    </v-card-text>
  </v-card>

  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-robot"
    header-title="Novo - Fonte de dados"
    body-class="overflow-auto overflow-x-hidden bg-dialog pa-3"
    headerheight="35px"
    max-width="850px"
    header-class="bg-brand_verde_dark"
  >
    <KpiSoureceAdd v-model="dialogAdd" />
  </CoreDialog>

  <CoreDialog
    v-model="dialogUpdate"
    header-icon="mdi-robot"
    header-title="Update - Fonte de dados"
    body-class="overflow-auto overflow-x-hidden bg-dialog pa-3"
    headerheight="35px"
    max-width="850px"
    header-class="bg-brand_verde_dark"
  >
    <KpiSoureceUpdate v-model="dialogUpdate" :id="updateId" />
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