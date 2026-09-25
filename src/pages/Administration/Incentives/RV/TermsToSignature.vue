<script setup>
import { ref, computed, watch } from 'vue'
import moment from 'moment'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import TermSignature from '@/components/Module/Administration/Incentives/RV/TermSignature.vue'

import { moduleStore } from '@/store'

const module = moduleStore()
const search = ref()
const dialogShow = ref(false)
const termName = ref('')
const termId = ref(false)
const signedId = ref(false)

const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  month_ref: urlParams.get('month_ref') ?? moment().format('YYYY-MM')
})

const headers = ref([
  {
    title: 'ID',
    align: 'center',
    key: 'term_id',
    width: '10'
  },
  {
    title: 'Termo',
    align: 'left',
    key: 'term.term_name'
  },
  {
    title: 'Disponivel em',
    align: 'center',
    key: 'term.approved_at',
    width: '170'
  },

  {
    title: 'Participação',
    align: 'center',
    key: 'accept.label',
    width: '50'
  },

  {
    title: 'Status',
    align: 'center',
    key: 'term.status.label',
    width: '50'
  }
])

watch(
  () => filter,
  async (newFilter) => {
    await module.setUrlParams(filter.value)
    module.getDataPart('api/for-me/incentives/terms-to-signature', ['terms'], filter.value)
  },
  { deep: true }
)
const dialogOpem = (event, item) => {
  dialogShow.value = true
  termName.value = item.item.term.term_name
  termId.value = item.item.term_id
  signedId.value = item.item.id
}
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

        <v-col class="pa-1" cols="8" md="10" sm="10">
          <v-text-field
            v-model="search"
            class="w-100"
            density="compact"
            color="primary"
            label="Busca"
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
      <v-icon icon="mdi-book-multiple-outline" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Termos</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.terms?.length }}
      </div>

      <!-- <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd = true">
        <v-icon icon="mdi-plus" />
      </v-btn> -->
    </v-card-text>
    <v-card-text class="py-0 pb-3">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data.terms"
        :search="search"
        :loading="module.loading"
        fixed-header
        density="compact"
        class="elevation-0"
        @click:row="dialogOpem"
      >
        <template #[`item.accept.label`]="{ item }">
          <v-chip variant="flat" :color="item?.accept?.color" size="small">
            {{ item?.accept?.label }}
          </v-chip>
        </template>
        <template #[`item.term.status.label`]="{ item }">
          <v-chip variant="flat" :color="item?.term?.status?.color" size="small">
            {{ item?.term?.status?.label }}
          </v-chip>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>

  <CoreDialog
    v-model="dialogShow"
    header-icon="mdi-book-open-page-variant-outline"
    :header-title="termName"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-0"
    headerheight="35px"
    :dialogFullscreen="true"
    header-class="bg-brand_verde_dark"
  >
    <TermSignature v-model="dialogShow" :id="termId" :signedId="signedId" />
  </CoreDialog>
</template>

<style scoped>
:deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
}
:deep(.v-table__wrapper table thead tr th) {
  background-color: #692fae !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 235px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}

:deep(.v-data-table__td) {
  font-size: 0.8rem !important;
}
</style>
