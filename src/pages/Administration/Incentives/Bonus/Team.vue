<script setup>
import { ref, onMounted } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import { moduleStore } from '@/store'
import PanelView from '@/components/Module/Administration/Incentives/Bonus/PanelView.vue'

const module = moduleStore()

const filter = ref({
  fiscalYear: null,
  activeMonth: null,
  activeUser: null
})

const dialogUpdate = ref(false)
const itemUpdate = ref(null)

onMounted(async () => {
  await setFilters()
})

const setFilters = async () => {
  filter.value.fiscalYear = module?.data?.activefiscalYear
  filter.value.activeMonth = module?.data?.activeMonth
  filter.value.activeUser = module?.data?.activeUser
  await module.setUrlParams(filter.value)
}

const dialogOpem = (event, item) => {
  dialogUpdate.value = true
  itemUpdate.value = item.item.public_id
}

const getNewdata = async () => {
  await module.setUrlParams(filter.value)
  await module.getDataPart('/api/for-me/incentives/bonus', [
    'activeMonth',
    'activefiscalYear',
    'activeUser',
    'year_statuses',
    'fiscalYears',
    'owners',
    'months',
    'panels'
  ])
  await setFilters()
}

const search = ref(null)

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
  <v-card class="mb-2">
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="2">
          <v-autocomplete
            v-model="filter.fiscalYear"
            density="compact"
            label="Ano Fiscal"
            color="primary"
            class="inputH40"
            :items="module.data.fiscalYears"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="public_id"
            hide-spin-buttons
            closable-chips
            menu-icon=""
            @update:modelValue="getNewdata"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="pa-1" cols="1">
          <v-autocomplete
            v-model="filter.activeMonth"
            density="compact"
            label="Mês"
            color="primary"
            class="inputH40"
            :items="module.data.months"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="value"
            hide-spin-buttons
            closable-chips
            menu-icon=""
            @update:modelValue="getNewdata"
          >
          </v-autocomplete>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-autocomplete
            v-model="filter.activeUser"
            density="compact"
            label="Colaborador"
            color="primary"
            :items="module.data.owners"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="username"
            hide-spin-buttons
            menu-icon=""
            clearable=""
            @update:modelValue="getNewdata"
          >
            <template #chip="{ props, item, index }">
              <v-chip
                v-bind="props"
                class="rounded-0"
                variant="text"
                :key="index"
                :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
              >
                {{ item.raw.label }}
              </v-chip>
            </template>

            <template #item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="item.raw.label" :title="item.raw.nickname">
                <template v-slot:prepend>
                  <v-avatar>
                    <img :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar" width="40" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-text-field
            v-model="search"
            density="compact"
            label="Buscar"
            color="primary"
            class="inputH40"
            :items="module.data.fiscalYears"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="public_id"
            hide-spin-buttons
            closable-chips
            menu-icon=""
          >
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card>
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
          <v-chip :class="'bg-' + item.status?.color" size="small">
            {{ item.status.label }}
          </v-chip>
        </template>
      </v-data-table-virtual>
    </v-card-text>

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
  </v-card>
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
