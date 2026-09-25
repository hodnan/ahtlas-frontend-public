<script setup>
  import { coreStore, moduleStore } from '@/store'
  import debounce from 'lodash.debounce'
  const core = coreStore()
  const module = moduleStore()
  const search = ref()

  const form = ref({ status: [0, 3] })

  const headers = ref([
    {
      title: 'Id',
      align: 'center',
      key: 'id',
      sortable: true,
      width: '2%'
    },
    {
      title: 'Usuário',
      align: 'left',
      key: 'user.label',
      class: 'brand_verde2 darken-3 text-white'
    },
    {
      title: 'Setor',
      align: 'left',
      key: 'sector_n1.label',
      class: 'brand_verde2 darken-3 text-white'
    },

    {
      title: 'Intervalo',
      align: 'center',
      key: 'time_label',
      class: 'brand_verde2 darken-3 text-white'
    },
    {
      title: 'Solicitado há',
      align: 'center',
      key: 'count_days',
      class: 'brand_verde2 darken-3 text-white'
    },
    {
      title: 'Status',
      align: 'center',
      key: 'status_label',
      class: 'brand_verde2 darken-3 text-white'
    }
  ])

  const daysColor = (v) => {
    v = parseInt(v)

    if (v > 45) {
      return 'bg-deep-orange-darken-4'
    }

    if (v >= 30) {
      return 'bg-amber-darken-3'
    } else {
      return 'bg-green-darken-4'
    }
  }

  watch(
    () => form,
    debounce((value) => {
      module.getDataPart('api/for-me/trade/time-admin', ['trades'], form.value)
    }, 1500),

    { deep: true }
  )
</script>
<template>
  <v-card>
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="12" md="8">
          <v-text-field
            v-model="search"
            density="compact"
            color="primary"
            label="Buscar"
            hide-details=""
            variant="outlined"
            prepend-inner-icon="mdi-filter"
          ></v-text-field>
        </v-col>

        <v-col class="pa-1" cols="12" md="4">
          <v-autocomplete
            v-model="form.status"
            color="primary"
            density="compact"
            label="Status"
            variant="outlined"
            hide-details=""
            clearable
            multiple=""
            :items="core?.routeData?.statuses"
            item-value="id"
            item-title="title"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-card class="mt-3">
    <v-card-text class="d-flex">
      <v-icon icon="mdi-clock-edit-outline" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Solicitações de troca de horário
      </div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.trades?.length }}
      </div>

      <v-btn
        density="comfortable"
        color="brand_roxo2"
        :loading="module.downloading || module.loading"
        @click="module.getDownload('api/for-me/trade/time-admin/alltrades/download', form.value)"
      >
        <v-icon icon="mdi-download" />
      </v-btn>
    </v-card-text>
    <v-card-text class="py-0 pb-3">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data.trades"
        :search="search"
        :loading="module.loading"
        fixed-header
        density="compact"
        class="elevation-0"
      >
        <template #[`item.count_days`]="{ item }">
          <v-chip :class="daysColor(item.count_days)" size="small">
            {{ item.count_days }} dias
          </v-chip>
        </template>
        <template #[`item.status_label`]="{ item }">
          <v-chip :class="item.status_color" size="small">
            {{ item.status_label }}
          </v-chip>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  :deep(.v-field__input) {
    max-height: 38px !important;
    overflow: hidden;
  }

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
