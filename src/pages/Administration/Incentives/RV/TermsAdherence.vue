<script setup>
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import TermAdd from '@/components/Module/Administration/Incentives/RV/TermAdd.vue'
import TermShow from '@/components/Module/Administration/Incentives/RV/TermShow.vue'
import { ref, computed, watch } from 'vue'
import debounce from 'lodash.debounce'
import moment from 'moment'
import { moduleStore } from '@/store'

const module = moduleStore()
const dialogAdd = ref(false)
const dialogShow = ref(false)
const termId = ref(false)
const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  month_ref: urlParams.get('month_ref') ?? moment().format('YYYY-MM')
})

const download = () => {
  const urldata = new URLSearchParams(window.location.search)

  module.getDownload('api/management/myteam/terms-adherence/download', urldata)
}

const search = ref()

const headers = ref([
  {
    title: 'Termo',
    align: 'left',
    key: 'term.term_name'
  },
  {
    title: 'Colaborador',
    align: 'left',
    key: 'user.label'
  },
  {
    title: 'Aceite',
    align: 'center',
    key: 'accept.label'
  },

  {
    title: 'Update',
    align: 'center',
    key: 'updated_at',
    width: '150'
  }
])

watch(
  () => filter,
  debounce(async (value) => {
    await module.setUrlParams(filter.value)
    await module.getDataPart('api/management/myteam/terms-adherence', ['terms'], search)
  }, 1000),

  { deep: true }
)
</script>
<template>
  <v-card>
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="4" md="2" sm="2">
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
  <v-card class="mt-3">
    <v-card-text class="d-flex">
      <v-icon icon="mdi-file-document-multiple-outline" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Aderência aos termos</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.terms?.length }}
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
    <v-card-text class="py-0 pb-3">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data.terms"
        :loading="module.loading"
        :search="search"
        fixed-header
        density="compact"
        class="elevation-0"
      >
        <template #[`item.accept.label`]="{ item }">
          <v-chip :class="'bg-' + item.accept.color" size="small">
            {{ item.accept.label }}
          </v-chip>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-file-document-plus-outline"
    header-title="Novo - Termo"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-2"
    headerheight="35px"
    :dialogFullscreen="true"
    header-class="bg-brand_verde_dark"
  >
    <TermAdd v-model="dialogAdd" />
  </CoreDialog>
  <CoreDialog
    v-model="dialogShow"
    header-icon="mdi-information-outline"
    header-title="Informação do termo"
    body-class="overflow-auto overflow-x-hidden bg-background pa-0"
    headerheight="35px"
    :dialogFullscreen="true"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <TermShow v-model="dialogShow" :id="termId" />
  </CoreDialog>
</template>

<style scoped>
/* :deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
} */

/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 237px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
