<script setup>
import { ref, watch } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import TrackingAdd from '@/components/Module/Management/ControlCenter/TrackingAdd.vue'
import TrackingUpdate from '@/components/Module/Management/ControlCenter/TrackingUpdate.vue'
import GroupSectorsAdd from '@/components/Module/Management/ControlCenter/GroupSectorsAdd.vue'
import GroupSectorsUpdate from '@/components/Module/Management/ControlCenter/GroupSectorsUpdate.vue'
import moment from 'moment'
import { moduleStore } from '@/store'

const module = moduleStore()

const dialogTracking = ref(false)
const dialogTrackingUpdate = ref(false)
const dataTrackingUpdate = ref(false)
const dialogGroup = ref(false)
const dialogGroupUpdate = ref(false)
const dataGroupUpdate = ref(false)

const searchTracking = ref()
const searchIndicator = ref()
const searchGroup = ref()
const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  month_ref: urlParams.get('month_ref') ?? moment().format('YYYY-MM')
})

const headersKpis = ref([
  {
    title: 'Setor',
    align: 'left',
    key: 'sector_n1.label'
  },
  {
    title: 'Indicador',
    align: 'left',
    key: 'indicator.label'
  }
])
const headersIndcators = ref([
  {
    title: 'Nome',
    align: 'left',
    key: 'label'
  }
])
const headersGroups = ref([
  {
    title: 'Nome',
    align: 'left',
    key: 'label'
  }
])

const openGroupUpdate = (item) => {
  dialogGroupUpdate.value = true
  dataGroupUpdate.value = item
}
const openTrackingUpdate = (item) => {
  dialogTrackingUpdate.value = true
  dataTrackingUpdate.value = item
}

const disabledRow = (item) => {
  return item?.active
    ? 'v-data-table__td cursor-pointer hover-color'
    : 'v-data-table__td cursor-pointer hover-color bg-amber-lighten-4 text-error text-decoration-line-through'
}

watch(
  () => filter,
  async () => {
    await module.setUrlParams(filter.value)
    await module.getDataPart('/api/management/control-center/admin', ['trackings'], filter.value)
  },

  { deep: true }
)
</script>
<template>
  <v-row class="ma-0">
    <v-col cols="6" class="py-0 px-1">
      <v-card>
        <v-card-text class="pa-1">
          <v-row class="ma-0">
            <v-col class="pa-1" cols="4">
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

            <v-col class="pa-1" cols="8">
              <v-text-field
                v-model="searchTracking"
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
      <v-card class="mt-2 table_card">
        <v-card-text class="d-flex py-1 px-2">
          <v-icon icon="mdi-key-arrow-right" class="text-brand_txt pt-2" />
          <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Acompanhamentos - CDC</div>
          <v-spacer />
          <v-btn
            density="compact"
            color="primary"
            icon="mdi-plus"
            class="rounded-0"
            elevation="0"
            @click="dialogTracking = true"
          >
          </v-btn>
        </v-card-text>
        <v-card-text class="pa-0">
          <v-data-table-virtual
            :headers="headersKpis"
            :items="module.data.trackings"
            :search="searchTracking"
            :loading="module.loading"
            fixed-header
            density="compact"
            class="elevation-0"
          >
            <template #[`item`]="{ item }">
              <tr :class="disabledRow(item)" @click="openTrackingUpdate(item)">
                <td>
                  {{ item?.sector_n1?.label }}
                </td>
                <td>
                  {{ item?.indicator?.label }}
                </td>
              </tr>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3" class="py-0 px-1">
      <v-card>
        <v-card-text class="pa-1">
          <v-row class="ma-0">
            <v-col class="pa-1" cols="12">
              <v-text-field
                v-model="searchIndicator"
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
      <v-card class="mt-2 table_card">
        <v-card-text class="d-flex py-1 px-2">
          <v-icon icon="mdi-hand-pointing-right" class="text-brand_txt pt-2" />
          <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Indicadores</div>
          <v-spacer />
          <v-btn density="compact" color="transparent" icon="mdi" class="rounded-0" elevation="0">
          </v-btn>
        </v-card-text>
        <v-card-text class="pa-0">
          <v-data-table-virtual
            :headers="headersIndcators"
            :items="module.data.indicators"
            :loading="module.loading"
            :search="searchIndicator"
            fixed-header
            density="compact"
            class="elevation-0"
          >
            <template #[`item`]="{ item }">
              <tr>
                <td>
                  {{ item?.label }}
                </td>
              </tr>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="3" class="py-0 px-1">
      <v-card>
        <v-card-text class="pa-1">
          <v-row class="ma-0">
            <v-col class="pa-1" cols="12">
              <v-text-field
                v-model="searchGroup"
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
      <v-card class="mt-2 table_card">
        <v-card-text class="d-flex py-1 px-2">
          <v-icon icon="mdi-group" class="text-brand_txt pt-2" />
          <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Setores Agrupados</div>
          <v-spacer />
          <v-btn
            density="compact"
            color="transparent"
            icon="mdi-plus"
            class="rounded-0"
            elevation="0"
            @click="dialogGroup = true"
          >
          </v-btn>
        </v-card-text>
        <v-card-text class="pa-0">
          <v-data-table-virtual
            :items="module.data.groups"
            :headers="headersGroups"
            :loading="module.loading"
            :search="searchGroup"
            fixed-header
            density="compact"
            class="elevation-0"
          >
            <template #[`item`]="{ item }">
              <tr :class="disabledRow(item)" @click="openGroupUpdate(item)">
                <td>
                  {{ item.label }}
                </td>
              </tr>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <CoreDialog
    v-model="dialogTracking"
    header-icon="mdi-key-arrow-right"
    header-title="Novo - Acompanhamento"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-0"
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    max-width="700px"
    :loading="module.showing"
  >
    <TrackingAdd v-model="dialogTracking" />
  </CoreDialog>

  <CoreDialog
    v-model="dialogTrackingUpdate"
    header-icon="mdi-key-arrow-right"
    header-title="Update - Acompanhamento"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-0"
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    max-width="700px"
    :loading="module.showing"
  >
    <TrackingUpdate v-model="dialogTrackingUpdate" :data="dataTrackingUpdate" />
  </CoreDialog>

  <CoreDialog
    v-model="dialogGroup"
    header-icon="mdi-group"
    header-title="Novo - Grupo"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-0"
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    max-width="400px"
    :loading="module.showing"
  >
    <GroupSectorsAdd v-model="dialogGroup" />
  </CoreDialog>

  <CoreDialog
    v-model="dialogGroupUpdate"
    header-icon="mdi-group"
    header-title="Editar - Grupo"
    body-class="overflow-auto overflow-x-hidden bg-background2 pa-0"
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    max-width="400px"
    :loading="module.showing"
  >
    <GroupSectorsUpdate v-model="dialogGroupUpdate" :data="dataGroupUpdate" />
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
