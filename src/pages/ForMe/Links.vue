<script setup>
import { onMounted } from 'vue'
import { coreStore, moduleStore } from '@/store'

const core = coreStore()
const module = moduleStore()

const search = ref()
const data = ref()
const loading = ref(false)

const headers = [
  {
    title: 'Título',
    align: 'left',
    key: 'title',
    sortable: true,
    width: '30%'
  },
  {
    title: 'URL',
    align: 'left',
    key: 'url',
    class: 'brand_verde2 darken-3 text-white'
  }
]

// onMounted(async () => {
//   module.setList('/api/for-me/links')
// })

const urlOpen = (obj, row) => {
  window.open(row.item.url, '_blank')
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

  <v-card class="mt-3">
    <v-card-text class="d-flex">
      <v-icon icon="mdi-link-variant" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Links</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module?.list?.length }}
      </div>
    </v-card-text>
    <v-card-text class="pt-0">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data.links"
        :search="search"
        item-value="title"
        item-key="url"
        fixed-header
        density="compact"
        class="elevation-0 h-100"
        @click:row="urlOpen"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>
:deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
}

/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 245px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
