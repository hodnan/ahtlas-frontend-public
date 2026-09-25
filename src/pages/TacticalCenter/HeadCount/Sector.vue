<script setup>
import { ref, watch } from 'vue'
import moment from 'moment'
import debounce from 'lodash.debounce'
import { moduleStore } from '@/store'

const module = moduleStore()

const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  month_ref: urlParams.get('month_ref') ?? moment().format('YYYY-MM'),
  stage: urlParams.get('stage') ? parseInt(urlParams.get('stage')) : null
})

const headersResults = ref([
  {
    title: 'Colaborador',
    align: 'left',
    key: 'employee.label'
  },
  {
    title: 'Gestor',
    align: 'left',
    key: 'employee.manager_n1.label'
  },
  {
    title: 'Status',
    align: 'center',
    key: 'employee.active_label.label'
  },
  {
    title: 'Meta',
    align: 'center',
    key: 'goal'
  },
  {
    title: 'Resultado',
    align: 'center',
    key: 'result'
  },
  {
    title: 'Q',
    align: 'center',
    key: 'quadrant'
  },
  {
    title: 'Stage',
    align: 'center',
    key: 'stage.id'
  }
])

watch(
  () => filter,
  debounce(async (value) => {
    await module.setUrlParams(filter.value)
    await module.getDataPart(
      'api/management/control-center/employee-results',
      ['stages', 'results'],
      filter
    )
  }, 1500),

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
            label="Data"
            hide-details
            variant="outlined"
            type="month"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="4">
          <v-autocomplete
            v-model="filter.stage"
            :items="module.data?.stages"
            color="primary"
            density="compact"
            label="Setor"
            variant="outlined"
            hide-details
            clearable
            item-value="id"
            item-title="label"
          />
        </v-col>

        <v-col class="pa-1" cols="6">
          <v-text-field
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
    <v-card-text class="d-flex py-1 px-2">
      <v-icon icon="mdi-scale-unbalanced" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Resultados por operador</div>
      <v-spacer />
      <!-- <v-btn
        density="compact"
        color="transparent"
        icon="mdi-plus"
        class="rounded-0"
        elevation="0"
        @click="dialogTracking = true"
      >
      </v-btn> -->
    </v-card-text>
    <v-card-text class="pa-0">
      <v-data-table-virtual
        :headers="headersResults"
        :items="module.data?.results"
        :loading="module.loading"
        fixed-header
        density="compact"
        class="elevation-0"
      >
        <!-- <template #[`item`]="{ item }">
              <tr :class="disabledRow(item)" @click="openTrackingUpdate(item)">
                <td>
                  {{ item?.sector_n1?.label }}
                </td>
                <td>
                  {{ item?.indicator?.label }}
                </td>
              </tr>
            </template> -->
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
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