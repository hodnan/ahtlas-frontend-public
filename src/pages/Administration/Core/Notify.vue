<script setup>
import { ref, watch } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import NotifyAdd from '@/components/Core/Notify/NotifyAdd.vue'
import moment from 'moment'
import debounce from 'lodash.debounce'
import { moduleStore } from '@/store'

const module = moduleStore()
const dialogAdd = ref(false)
const dialogUpdate = ref(false)
const stage = ref(false)

const urlParams = new URLSearchParams(window.location.search)
const search = ref()

const filter = ref({
  month_ref: urlParams.get('month_ref') ?? moment().format('YYYY-MM-DD')
})

const openDialog = (event, item) => {
  dialogUpdate.value = true
  stage.value = item?.item
}
// const download = () => {
//   const urldata = new URLSearchParams(window.location.search)

//   module.getDownload('api/management/control-center/employee-download', urldata)
// }

const headersResults = ref([
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
    title: 'Date Ref.',
    align: 'center',
    key: 'date_ref'
  },
  {
    title: 'Date Envio',
    align: 'center',
    key: 'created_at'
  },
  {
    title: 'Meta',
    align: 'center',
    key: 'goal'
  }
])

watch(
  () => filter,
  debounce(async () => {}, 500),

  { deep: true }
)
</script>
<template>
  <v-card>
    <v-card-text class="pa-1">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="filter.month_ref"
            class="w-100"
            density="compact"
            color="primary"
            label="Mês de referência"
            hide-details
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
            variant="outlined"
            hide-details
          >
            &nbsp;
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class="mt-2 table_card">
    <v-card-text class="d-flex">
      <v-icon icon="mdi-bell-cog-outline" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Notificações</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.trades?.length }}
      </div>

      <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd = true">
        <v-icon icon="mdi-plus" />
      </v-btn>
    </v-card-text>
    <v-card-text class="pa-0">
      <v-data-table-virtual
        :headers="headersResults"
        :items="module.data?.stages"
        :loading="module.loading"
        :search="search"
        fixed-header
        density="compact"
        class="elevation-0"
        @click:row="openDialog"
      >
        <template #[`item.stage.id`]="{ item }">
          <v-chip :class="'bg-' + item.stage.color" size="small">
            {{ item.stage.id }}
          </v-chip>
        </template>
        <template #[`item.status.label`]="{ item }">
          <v-chip :class="'bg-' + item.status.color" size="small">
            {{ item.status.label }}
          </v-chip>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>

  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-bell-cog-outline"
    header-title="Novo - Notificação"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-0"
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    max-width="700px"
    :loading="module.showing"
  >
    <NotifyAdd />
  </CoreDialog>
</template>
<style scoped>
.hover-color:hover {
  background: rgba(255, 255, 255, 0.5);
  filter: brightness(0.8) !important; /* cor ao passar o mouse */
}
.table_card {
  height: calc(100vh - 155px);
}
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 205px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
