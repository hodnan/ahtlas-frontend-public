<script setup>
import { ref, watch } from 'vue'
import { router, useForm } from '@inertiajs/vue3'
import DefaultLayout from '@/Layouts/DefaultLayout.vue'
import CoreDialog from '@/Components/Core/Dialog.vue'
import { coreStore } from '@/store'
import SourceAdd from '@/Components/Modules/Administration/Intelligence/SourceAdd.vue'

import moment from 'moment'

const core = coreStore()
const props = defineProps({
  sources: Object,
  statuses: Object,
  source_types: Object,
  source_kinds: Object,
  owners: Object
})

const filterHeight = ref('')
const vheight = () => {
  return filterHeight.value == '0' ? '215px' : '150px'
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
    title: 'Fonte',
    align: 'left',
    key: 'source'
  },
  {
    title: 'Tipo',
    align: 'center',
    key: 'type.label'
  },
  {
    title: 'Responsável',
    align: 'left',
    key: 'owner.label'
  },
  {
    title: 'Volume',
    align: 'center',
    key: 'volume',
    width: '20'
  },
  {
    title: 'MaxDate',
    align: 'center',
    key: 'max_date',
    width: '20'
  },
  {
    title: 'Status',
    align: 'center',
    key: 'status.label',
    width: '150'
  }
])

const filter = useForm({
  date_ref: moment().format('YYYY-MM'),
  sectors_n1: null,
  status: null
})

// watch(
//   () => filter,
//   debounce((newFilter) => {
//     router.reload({
//       method: "post",
//       data: newFilter,
//       only: ["terms", "sectorsN1", "statusList"],
//       replace: true,
//     });
//   }, 1000),
//   { deep: true }
// );

const dialog = ref(false)
const addDialog = ref(false)

const form = useForm({
  id: null
})

const dialogOpem = (event, item) => {
  if (props.flash?.data?.id != item.item.id) {
    form.id = item.item.id
    form.post(route('forme.incentives.termshow'), {
      preserveState: true,
      preserveScroll: true,
      only: ['flash', 'errors'],
      onSuccess: () => {
        dialog.value = true
      }
    })
  } else {
    dialog.value = true
  }
}
</script>
<template>
  <DefaultLayout>
    <v-expansion-panels v-model="filterHeight">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon v-if="!core.loading" class="pr-5" color="brand_txt" icon="mdi-filter" />
          <v-progress-circular v-else size="25" indeterminate color="primary" class="mr-2 ml-n2" />
          Filtros
          <v-spacer />
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" sm="2">
              <v-text-field
                density="compact"
                color="primary"
                label="Data"
                hide-details=""
                variant="outlined"
                v-model="filter.date_ref"
                type="month"
              >
                <!--  -->
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-autocomplete
                v-model="filter.sectors_n1"
                :items="sectorsN1"
                item-title="label"
                item-value="id"
                density="compact"
                label="Setor"
                color="primary"
                hide-details=""
                variant="outlined"
                multiple
                clearable
              />
            </v-col>
            <v-col cols="12" sm="2">
              <v-autocomplete
                v-model="filter.status"
                :items="statusList"
                item-title="title.label"
                item-value="id"
                density="compact"
                label="Status"
                color="primary"
                hide-details=""
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="search"
                density="compact"
                color="primary"
                label="Busca Geral"
                hide-details=""
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="mt-3" :style="'height: calc(100vh - ' + vheight() + ')'">
      <v-card-text class="d-flex">
        <v-icon icon="mdi-database-eye-outline" class="text-brand_txt pt-2" />
        <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Fontes</div>
        <v-spacer />
        <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
          <!-- Registros: {{ terms.length }} -->
        </div>

        <v-btn density="comfortable" color="brand_roxo2" @click="addDialog = true">
          <v-icon icon="mdi-plus" />
        </v-btn>
      </v-card-text>
      <v-card-text class="pt-0">
        <v-data-table-virtual
          :headers="headers"
          :items="sources"
          :search="search"
          item-value="name"
          item-key="id"
          fixed-header
          density="compact"
          enter-class="text-caption"
          class="elevation-0"
          @click:row="dialogOpem"
        >
          <!-- <template #[`item.status.label`]="{ item }">
            <span :class="'py-1 px-2 rounded-xl text-caption bg-' + item.status.color" >
              {{ item.status.label }}
            </span>
          </template> -->
        </v-data-table-virtual>
      </v-card-text>
    </v-card>

    <CoreDialog
      v-model="addDialog"
      header-icon="mdi-database-plus-outline"
      header-title="Novo - Fonte"
      max-width="1100px"
      header-class="bg-brand_verde_dark"
    >
      <SourceAdd v-model="addDialog" />
    </CoreDialog>

    <!-- <CoreDialog
      v-model="dialog"
      header-icon="mdi-information-outline"
      header-title="Informação do termo"
      :dialogFullscreen="true"
      header-class="bg-brand_roxo2"
    >
      <TermShow />
    </CoreDialog> -->
  </DefaultLayout>
</template>

<style scoped>
:deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
}

/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #692fae !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 300px);
  /* height: 150px; */
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}

:deep(.v-data-table__td) {
  font-size: 0.8rem !important;
}
</style>