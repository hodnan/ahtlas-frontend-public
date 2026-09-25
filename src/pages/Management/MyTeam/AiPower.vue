<script setup>
import { ref, watch } from 'vue'
import { authStore, coreStore, moduleStore } from '@/store'
import debounce from 'lodash.debounce'
import moment from 'moment'

const core = coreStore()
const auth = authStore()

const module = moduleStore()

const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  month_ref: urlParams.get('month_ref'),
  manager: urlParams.get('manager') ?? auth.user.username
})

const search = ref()

const headers = ref([
  {
    title: 'Ref',
    align: 'center',
    key: 'month_ref'
  },
  {
    title: 'Colaborador',
    align: 'left',
    key: 'username.label'
  },
  {
    title: 'Setor',
    align: 'left',
    key: 'sector_n1.label'
  },
  {
    title: 'Tipo',
    align: 'left',
    key: 'type'
  },
  {
    title: 'M',
    align: 'center',
    key: 'm0',
    sortable: false
  },
  {
    title: 'M -1',
    align: 'center',
    key: 'm1',
    sortable: false
  },
  {
    title: 'M -2',
    align: 'center',
    key: 'm2',
    sortable: false
  },
  {
    title: 'Ação',
    align: 'left',
    key: 'action.action'
  }
])

watch(
  () => filter,
  debounce(async (newFilter) => {
    await module.setUrlParams(filter.value)
    module.getDataPart('api/management/myteam/aipower', ['aiPowers'], filter.value)
  }, 1000),
  { deep: true }
)
</script>
<template>
  <div class="px-0 pb-2">
    <v-card>
      <v-card-text class="d-flex">
        <v-row>
          <v-col class="pa-2" cols="4" md="2" sm="2">
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
          <v-col class="pa-2" cols="4" md="4">
            <v-autocomplete
              v-model="filter.manager"
              density="compact"
              label="Gestor"
              color="primary"
              :items="module.data.managers"
              hide-details=""
              variant="outlined"
              item-title="label"
              item-value="username"
              hide-spin-buttons
              clearable
            >
              <template #chip="{ props, item }">
                <v-chip
                  v-if="item.raw.avatar?.avatar"
                  variant="text"
                  v-bind="props"
                  :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                >
                  {{ item.raw.name }}
                </v-chip>
              </template>

              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw.hierarchical_level?.label + ' | ' + item.raw.username"
                  :title="item.raw.name"
                >
                  <template v-slot:prepend>
                    <v-avatar>
                      <img :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar" width="40" />
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <!-- <v-col class="pa-2" cols="3" md="3">
            <v-autocomplete
              v-model="filter.action"
              density="compact"
              label="Ação"
              color="primary"
              :items="module.data.actions"
              hide-details=""
              variant="outlined"
              item-title="label"
              item-value="username"
              hide-spin-buttons
              clearable
            />
          </v-col> -->
          <v-col class="pa-2" cols="6">
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
      </v-card-text>
    </v-card>

    <v-card class="mt-3">
      <v-card-text class="d-flex">
        <v-icon icon="mdi-arrow-decision" class="text-brand_txt pt-2" />
        <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Potênc<b>IA</b></div>
        <v-spacer />
        <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
          Registros: {{ module.data?.aiPowers?.length }}
        </div>
      </v-card-text>
      <v-card-text class="pt-0">
        <v-data-table-virtual
          :headers="headers"
          :items="module.data.aiPowers"
          :search="search"
          :loading="module.loading"
          item-value="name"
          item-key="id"
          fixed-header
          density="compact"
          enter-class="text-caption"
          class="elevation-0"
        >
        </v-data-table-virtual>
      </v-card-text>
    </v-card>
  </div>
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
  height: calc(100vh - 245px);
  /* height: 150px; */
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}

:deep(.v-data-table__td) {
  font-size: 0.8rem !important;
}
</style>