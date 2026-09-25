<script setup>
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import { coreStore, moduleStore } from '@/store'
import { ref } from 'vue'

const core = coreStore()
const module = moduleStore()
const search = ref()
const loading = ref(false)

const download = () => {
  const urldata = new URLSearchParams(window.location.search)

  module.getDownload('api/administration/intelligence/kpi-updates/download', urldata)
}

const headers = ref([
  {
    title: 'Fonte',
    align: 'center',
    key: 'source_id',
    sortable: true,
    width: '10'
  },
  {
    title: 'Setor',
    align: 'left',
    key: 'sector_n1.label'
  },
  {
    title: 'Indicador',
    align: 'left',
    key: 'indicator.label'
  },
  {
    title: 'Responsável',
    align: 'left',
    key: 'source.owner.label'
  },

  {
    title: 'Último Update',
    align: 'center',
    key: 'last_update',
    width: '10'
  },
  {
    title: 'Atraso',
    align: 'center',
    key: 'delay',
    width: '10'
  }
])

const update = async () => {
  try {
    loading.value = true
    await module.setStore(`api/administration/intelligence/kpi-updates/update`)
    if (notify.success) {
      await module.getDataPart('api/administration/intelligence/kpi-updates', ['kpis'])
    }
    loading.value = false
  } catch (error) {
    loading.value = false
  }
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
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Atualizações</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.kpis?.length }}
      </div>
      <v-btn
        density="comfortable"
        color="brand_roxo2"
        :loading="module.downloading || module.loading"
        @click="download"
      >
        <v-icon icon="mdi-download" />
      </v-btn>
    </v-card-text>

    <v-card-text class="pt-0">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data?.kpis"
        :loading="module.loading"
        :search="search"
        item-value="label"
        item-key="id"
        fixed-header
        density="compact"
        class="elevation-0"
      >
        <template #[`item.source.owner.label`]="{ item }">
          {{ item.source.owner.name }}
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
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