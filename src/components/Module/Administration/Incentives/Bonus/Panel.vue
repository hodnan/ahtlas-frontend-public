<script setup>
import { ref } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import { moduleStore } from '@/store'
import PanelAdd from '@/components/Module/Administration/Incentives/Bonus/PanelAdd.vue'
import PanelView from '@/components/Module/Administration/Incentives/Bonus/PanelView.vue'

const module = moduleStore()

const props = defineProps({
  search: String
})

const dialogAdd = ref(false)
const dialogUpdate = ref(false)
const itemUpdate = ref(null)

const dialogOpem = (event, item) => {
  dialogUpdate.value = true
  itemUpdate.value = item.item.public_id
}

const headers = ref([
  {
    title: 'Hierarquia',
    align: 'center',
    key: 'hierarchical_level.label'
  },
  {
    title: 'Responsável',
    align: 'left',
    key: 'owner.name'
  },

  {
    title: 'Área',
    align: 'left',
    key: 'area'
  },
  {
    title: 'Criação',
    align: 'center',
    key: 'created_at'
  },
  {
    title: 'Atualização',
    align: 'center',
    key: 'updated_at'
  },
  {
    title: 'Status',
    align: 'center',
    key: 'status.label',
    width: '5'
  }
])
</script>
<template>
  <v-card-text class="d-flex py-2">
    <v-icon icon="mdi-chart-tree" class="text-brand_txt pt-2" />
    <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Paineis</div>
    <v-spacer />

    <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
      Registros: {{ module.data?.panels?.length }}
    </div>

    <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd = true">
      <v-icon icon="mdi-plus" />
    </v-btn>
  </v-card-text>

  <v-card-text class="py-0 pb-3">
    <v-data-table-virtual
      :headers="headers"
      :items="module.data.panels"
      :loading="module.loading"
      :search="search"
      fixed-header
      density="compact"
      class="elevation-0"
      @click:row="dialogOpem"
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
    header-icon="mdi-chart-tree"
    header-title="Novo - Painel"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
    headerheight="35px"
    max-width="600px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <PanelAdd v-model="dialogAdd" />
  </CoreDialog>
  <CoreDialog
    v-model="dialogUpdate"
    header-icon="mdi-chart-tree"
    header-title="Atualizar - Painel"
    :dialog-fullscreen="true"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
    headerheight="35px"
    max-width="450px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <PanelView v-model="dialogUpdate" :public-id="itemUpdate" />
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
