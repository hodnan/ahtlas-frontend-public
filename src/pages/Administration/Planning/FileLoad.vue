<script setup>
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import ChargeAdd from '@/components/Module/Administration/Planning/FileLoad/ChargeAdd.vue'
import Download from '@/components/Module/Administration/Planning/FileLoad/Download.vue'
import debounce from 'lodash.debounce'

import { watch } from 'vue'
import moment from 'moment'
import { moduleStore } from '@/store'

const module = moduleStore()
const chargeAdd = ref(false)

const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  month_ref: urlParams.get('month_ref') ?? moment().format('YYYY-MM'),
  type: urlParams.get('type') ? parseInt(urlParams.get('type')) : null,
  status: urlParams.get('status') ? parseInt(urlParams.get('status')) : null
})

const dialogAdd = () => {
  chargeAdd.value = true
}

const search = ref()

const headers = ref([
  {
    title: 'ID',
    align: 'center',
    key: 'id',
    width: '5'
  },
  {
    title: 'Tipo',
    align: 'left',
    key: 'type.name'
  },
  {
    title: 'Carregado por',
    align: 'left',
    key: 'created_by.label'
  },
  {
    title: 'Início',
    align: 'center',
    key: 'start_at'
  },
  {
    title: 'Fim',
    align: 'center',
    key: 'end_at'
  },
  {
    title: 'Download',
    align: 'center',
    key: 'download'
  },

  {
    title: 'Status',
    align: 'center',
    key: 'status.name',
    width: '150'
  }
])

watch(
  () => filter,
  debounce(async (value) => {
    await module.setUrlParams(filter.value)
    await module.getDataPart('api/administration/planning/file-load', ['charges'])
  }, 500),

  { deep: true }
)
</script>
<template>
  <v-card>
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="6" sm="4" md="2">
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

        <v-col cols="6" sm="8" md="10" class="pa-1">
          <v-text-field
            v-model="search"
            density="compact"
            color="primary"
            label="Buscar"
            hide-details
            prependInnerIcon="mdi-filter"
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class="mt-3">
    <v-card-text class="d-flex py-2">
      <v-icon icon="mdi-upload" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Cargas</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.terms?.length }}
      </div>

      <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd">
        <v-icon icon="mdi-plus" />
      </v-btn>
    </v-card-text>
    <v-card-text class="py-0 pb-3">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data.charges"
        :loading="module.loading"
        :search="search"
        fixed-header
        density="compact"
        class="elevation-0"
      >
        <template #[`item.download`]="{ item }">
          <Download :id="item.id" />
        </template>
        <template #[`item.status.name`]="{ item }">
          <v-chip v-if="!item?.errors" :class="'bg-' + item.status.color" size="small">
            {{ item.status.name }}
          </v-chip>
          <v-tooltip v-else>
            <template v-slot:activator="{ props }">
              <v-chip
                prepend-icon="mdi-alert-circle-outline"
                v-bind="props"
                :class="'bg-' + item.status.color"
                size="small"
              >
                {{ item.status.name }}
              </v-chip>
            </template>
            <v-card class="pa-0 elevation-0" color="transparent">
              <v-card-title class="text-center text-subtitle-1 pa-0">
                {{ item?.id }} | {{ item?.type?.name }}
              </v-card-title>
              <v-card-title class="text-center text-subtitle-1 pa-0"> Erros! </v-card-title>

              <v-list class="bg-transparent" density="compact">
                <v-list-item
                  v-for="(error, index) in item?.errors"
                  :key="index"
                  class="text-center"
                >
                  <!-- <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template> -->

                  {{ error?.message }}
                </v-list-item>
              </v-list>

              <!-- <v-card-text v-for="(error, index) in item?.errors" :key="index">
                {{ error?.message }}
              </v-card-text> -->
            </v-card>
          </v-tooltip>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>

  <CoreDialog
    v-model="chargeAdd"
    header-icon="mdi-file-upload-outline"
    header-title="Carregar arquivo"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-2"
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    max-width="370px"
  >
    <ChargeAdd v-model="chargeAdd" />
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
  height: calc(100vh - 222px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>