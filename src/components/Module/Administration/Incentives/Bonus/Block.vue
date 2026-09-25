<script setup>
import { ref } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import { moduleStore } from '@/store'
import BlockAdd from '@/components/Module/Administration/Incentives/Bonus/BlockAdd.vue'
import BlockView from '@/components/Module/Administration/Incentives/Bonus/BlockView.vue'

const module = moduleStore()

const props = defineProps({
  search: String
})

const dialogAdd = ref(false)
const dialogUpdate = ref(false)
const itemUpdate = ref(null)

const dialogOpem = (event, item) => {
  dialogUpdate.value = true
  itemUpdate.value = item.item
}

const headers = ref([
  {
    title: 'ID',
    align: 'center',
    key: 'public_id',
    width: '120'
  },
  {
    title: 'Nome',
    align: 'left',
    key: 'name'
  },
  {
    title: 'Ano fiscal',
    align: 'center',
    key: 'fiscal_year.label'
  },
  {
    title: 'Peso padrão',
    align: 'center',
    key: 'weight'
  },

  {
    title: 'Bloco Padrão?',
    align: 'center',
    key: 'default',
    width: '5'
  }
])
</script>
<template>
  <v-card-text class="d-flex py-2">
    <v-icon icon="mdi-code-block-brackets" class="text-brand_txt pt-2" />
    <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Blocos</div>
    <v-spacer />
    <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
      Registros: {{ module.data?.fiscalYears?.length }}
    </div>

    <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd = true">
      <v-icon icon="mdi-plus" />
    </v-btn>
  </v-card-text>

  <v-card-text class="py-0 pb-3">
    <v-data-table-virtual
      :headers="headers"
      :items="module.data.bonusBlock"
      :loading="module.loading"
      :search="search"
      fixed-header
      density="compact"
      class="elevation-0"
      @click:row="dialogOpem"
    >
      <template #[`item.name`]="{ item }">
        <div>
          {{ item.name }} <span v-if="item.owner"> - {{ item.owner.nickname }}</span>
        </div>
      </template>
    </v-data-table-virtual>
  </v-card-text>

  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-code-block-brackets"
    header-title="Novo - Bloco"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
    headerheight="35px"
    max-width="450px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <BlockAdd v-model="dialogAdd" />
  </CoreDialog>
  <CoreDialog
    v-model="dialogUpdate"
    header-icon="mdi-code-block-brackets"
    header-title="Atualizar - Bloco"
    body-class="overflow-auto overflow-x-hidden bg-background pt-2 pb-2 px-2 "
    :dialogFullscreen="false"
    headerheight="35px"
    max-width="1200px"
    min-height="92vh"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <BlockView v-model="dialogUpdate" :item="itemUpdate" />
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
