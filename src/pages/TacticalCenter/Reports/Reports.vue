<script setup>
import { ref, computed, watch } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import ReportAdd from '@/components/Module/TacticalCenter/Reports/ReportAdd.vue'
import SummaryCard from '@/components/Module/TacticalCenter/Reports/SummaryCard.vue'
import debounce from 'lodash.debounce'
import { moduleStore } from '@/store'

const module = moduleStore()

const search = ref()
const dialogAdd = ref(false)

const reports = computed(() => {
  return JSON.parse(JSON.stringify(module.data?.reports ?? []))
})

const filteredReports = computed(() => {
  if (!search.value) return reports.value
  const searchfilter = search.value.toLowerCase()
  return reports.value.filter((report) => {
    const reportJson = JSON.stringify(report).toLowerCase()
    return reportJson.includes(searchfilter)
  })
})

const urlParams = new URLSearchParams(window.location.search)
const form = ref({
  active: urlParams.get('active') ? parseInt(urlParams.get('active')) : null,
  type: urlParams.get('type') ? parseInt(urlParams.get('type')) : null,
  group: module.data.group_default
})

watch(
  () => form,
  debounce(async () => {
    await module.setUrlParams(form.value)
    module.getDataPart('api/tactical-center/reports', ['reports'], form.value)
  }, 1500),

  { deep: true }
)
</script>
<template>
  <v-card>
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col cols="6" class="pa-1">
          <v-text-field
            v-model="search"
            density="compact"
            color="primary"
            label="Buscar"
            hide-details=""
            prependInnerIcon="mdi-filter"
            variant="outlined"
          />
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-autocomplete
            v-model="form.group"
            density="compact"
            class="inputH40"
            label="Grupo"
            color="primary"
            hide-details=""
            variant="outlined"
            hide-spin-buttons
            :items="module.data?.groups"
            item-title="label"
            item-value="id"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-autocomplete
            v-model="form.type"
            density="compact"
            class="inputH40"
            label="Tipo"
            color="primary"
            hide-details=""
            variant="outlined"
            hide-spin-buttons
            :items="module.data?.reportTypes"
            item-title="label"
            item-value="id"
          >
            <template #selection="{ item, index }">
              <v-chip
                class="rounded-0"
                size="large"
                variant="text"
                :key="index"
                :prepend-icon="item.raw.icon"
              >
                {{ item.raw.label }}
              </v-chip>
            </template>

            <template #item="{ props, item }">
              <v-list-item class="px-2 py-0">
                <v-chip
                  v-bind="props"
                  class="rounded-0 w-100"
                  size="large"
                  variant="text"
                  :prepend-icon="item.raw.icon"
                >
                  {{ item.raw.label }}
                </v-chip>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-autocomplete
            v-model="form.active"
            color="primary"
            density="compact"
            label="Status"
            hide-details=""
            variant="outlined"
            item-title="name"
            item-value="id"
            :items="module.data.statuses"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mt-2 pa-0">
    <v-card-text class="d-flex headerTable py-2">
      <v-btn
        :loading="module.loading"
        readonly=""
        density="compact"
        color="transparent"
        icon="mdi-chart-bar"
        class="rounded-0 text-brand_txt"
        elevation="0"
      >
      </v-btn>

      <!-- <v-icon  class="pt-2" /> -->
      <div class="pt-1 px-3" style="min-width: 120px">Reports</div>
      <v-spacer />
      <div class="pt-1 px-3" style="min-width: 120px">itens: {{ filteredReports?.length }}</div>
      <v-btn
        v-if="module?.data?.isOwner"
        density="comfortable"
        color="brand_roxo2"
        @click="dialogAdd = true"
      >
        <v-icon icon="mdi-plus" />
      </v-btn>
    </v-card-text>
  </v-card>

  <v-col
    cols="12"
    class="px-0 pb-2 pt-1 overflow-auto overflow-x-hidden mt-2 border-imput_border rounded"
    style="height: calc(100vh - 210px)"
  >
    <v-row class="px-2">
      <SummaryCard v-for="report in filteredReports" :key="report.id" :report="report" />
    </v-row>
  </v-col>

  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-chart-box-plus-outline"
    header-title="Novo - Report"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-0 pb-3 px-0"
    headerheight="35px"
    max-width="650px"
    header-class="bg-brand_verde_dark"
  >
    <ReportAdd v-model="dialogAdd" />
  </CoreDialog>
</template>

<style scoped>
.headerTable {
  height: 40px;
}
.footer {
  position: absolute;
  bottom: 0;
  background-color: aqua;
  width: 100%;
  height: 40px;
}
.append-action :deep(.v-field__append-inner) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  padding: 0 10px !important;
  margin-right: -12px !important;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.inputH40 :deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
}
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 250px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
