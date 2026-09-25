<script setup>
  import { defineAsyncComponent, computed, watch } from 'vue'
  import { moduleStore } from '@/store'
  const backofficeUrl = import.meta.env.VITE_BACKOFFICE_URL
  const module = moduleStore()

  const CoreDialog = defineAsyncComponent(() => import('@/components/Core/Utils/Dialog.vue'))
  const urlParams = new URLSearchParams(window.location.search)

  const dialog = ref(false)
  const search = ref()
  const page = ref(1)
  const itemsPerPage = ref(10)
  const props = defineProps({
    data: Object,
    group: String
  })

  const detailShow = ref(false)
  const detailItem = ref(false)

  const detailHover = (isHovered, item) => {
    detailItem.value = item
    detailShow.value = isHovered
  }

  const isSimultaneous = (v) => {
    return v ? ' simultaneous' : ''
  }
  const headers = ref([
    {
      title: 'Protocolo',
      align: 'center',
      key: 'protocol',
      sortable: true
    },
    {
      title: 'Início',
      align: 'center',
      key: 'time_start',
      sortable: true
    },
    {
      title: 'Fim',
      align: 'center',
      key: 'time_end',
      sortable: true
    },

    {
      title: 'Status',
      align: 'center',
      key: 'status',
      sortable: true
    }
  ])

  const title = computed(() => {
    let group = props.group.replace('_id', '')

    if (group == 'username') {
      return props.data?.employee?.label
    }

    if (group == 'sector_n1') {
      return props.data?.[group]?.label
    }

    if (group == 'manager_n1') {
      return props.data?.[group]?.label
    }

    if (group == 'manager_n2') {
      return props.data?.[group]?.label
    }
    // if (group == 'sector_n1_id') {
    //   return props.data?.employee?.label
    // }

    return props.data?.[group]?.name
  })
</script>
<template>
  <v-tooltip v-model="detailShow" location="bottom">
    <template v-slot:activator="{ props }">
      <span v-bind="props"></span>
    </template>
    <v-card class="bg-transparent">
      <v-card-text class="px-0 py-2">
        <v-sheet class="bg-transparent">
          <b>Protocolo:</b>
          {{ detailItem?.protocol }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Ambiente:</b>
          {{ detailItem?.environment?.name }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Mailing:</b>
          {{ detailItem?.mailing?.name }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Data:</b>
          {{ detailItem?.date_ref }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Início:</b>
          {{ detailItem?.time_start }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Fím:</b>
          {{ detailItem?.time_end }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Duração:</b>
          {{ detailItem?.time_duration }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Status:</b>
          <span :class="`px-1 text-${detailItem?.status?.color}`">
            {{ detailItem?.status?.name }}
          </span>
        </v-sheet>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-text class="px-0 py-2">
        <v-sheet class="bg-transparent"><b>Colaborador</b></v-sheet>

        <v-sheet class="bg-transparent">
          <b>Nome:</b>
          {{ detailItem?.employee?.label }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Setor:</b>
          {{ detailItem?.sector_n1?.label }}
        </v-sheet>
        <v-sheet class="bg-transparent">
          <b>Gestor:</b>
          {{ detailItem?.manager_n1?.label }}
        </v-sheet>
      </v-card-text>
    </v-card>
  </v-tooltip>
  <div class="">
    <v-card class="py-1" elevation="3">
      <v-row class="ma-0">
        <v-col cols="5" class="text-caption py-0 px-1">
          <v-card-subtitle class="pa-1 d-flex flex-row">
            <v-sheet
              style="width: calc(100% - 25px)"
              class="d-inline-block text-truncate bg-transparent"
            >
              {{ data?.date_ref }} | {{ title }}
            </v-sheet>
            <v-spacer />

            <v-sheet style="width: calc(25px)" class="bg-transparent text-truncate text-right">
              <v-btn
                :loading="module.loading"
                icon="mdi-fullscreen"
                size="18"
                color="brand_txt rounded-0"
                variant="plain"
                @click.stop="dialog = true"
              ></v-btn>
            </v-sheet>
          </v-card-subtitle>
          <v-card-text class="pa-0">
            <v-row class="ma-0">
              <v-col v-if="group == 'sector_n1_id'" cols="2" class="text-caption py-0 px-1">
                <b v-tooltip="`Quantidade de protocolos`">HC:</b>
                {{ data?.hc }}
              </v-col>
              <v-col v-else cols="2" class="text-caption py-0 px-1">
                <b v-tooltip="`Escala do colaborador`">Escala:</b>
                {{ data?.employee?.working_hours }}
              </v-col>
              <v-col cols="4" class="text-caption py-0 px-1">
                <b v-tooltip="`Quantidade de protocolos`">Quantidade:</b>
                {{ data?.volume }}
              </v-col>
              <v-col cols="6" class="text-caption py-0 px-1">
                <b v-tooltip="`Tempo total`">Tempo total</b>
                {{ data?.time_handle }}
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col cols="2" class="text-caption py-0 px-1">
                <b v-tooltip="`Tempo médio tratativa`">TMT:</b>
                {{ data?.average_time_handle }}
              </v-col>
              <v-col cols="4" class="text-caption py-0 px-1">
                <b v-tooltip="`Protocolos finalizados`">Finalizados:</b>
                {{ data?.finished }}
              </v-col>

              <v-col cols="6" class="text-caption py-0 px-1">
                <b v-tooltip="`Tempo total`">Finalizados (%)</b>
                {{ data?.finished_percent }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-divider vertical></v-divider>

        <v-col cols="7" class="py-2 px-2 d-flex align-center">
          <v-card class="pa-0 w-100 h-100 bg-background" elevation="3">
            <v-card-text class="pa-0">
              <div
                v-for="item in data.protocols"
                :key="item.id"
                :data="item"
                :style="`left: ${item.obj_start}%; width: ${item.obj_width}%`"
                :class="`small-card-time-line bg-${item?.status?.color} ${isSimultaneous(item?.is_simultaneous)}`"
                @mouseenter="detailHover(true, item)"
                @mouseleave="detailHover(false, [])"
              ></div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <CoreDialog
      v-model="dialog"
      header-icon="mdi-format-list-bulleted"
      :header-title="`${title}`"
      body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
      headerheight="30px"
      max-width="550px"
      header-class="bg-brand_verde_dark"
    >
      <v-sheet class="py-2 px-0">
        <v-text-field
          v-model="search"
          class="w-25"
          color="primary"
          density="compact"
          label="Buscar"
          variant="outlined"
          hide-details=""
        />
      </v-sheet>

      <v-data-table
        :headers="headers"
        :items="data.protocols"
        :search="search"
        height="400"
        item-value="name"
        fixed-header
        :items-per-page="itemsPerPage"
        :page="page"
        no-data-text="Nenhum item encontrado"
        @update:page="page = $event"
        @update:itemsPerPage="itemsPerPage = $event"
        select-strategy="page"
      >
        <template #[`item.protocol`]="{ item }">
          <a
            :href="`${backofficeUrl}/Unificado/${item?.environment?.name}/Tratativa/Tratar?ProtocoloId=${item.protocol}&SomenteLeitura=True&Reabrir=False`"
            target="#"
            class="text-decoration-none"
          >
            {{ item.protocol }}
          </a>
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip v-if="!item.is_simultaneous" :color="item?.status?.color" size="small">
            {{ item?.status?.name }}
          </v-chip>
          <v-chip
            v-if="item.is_simultaneous"
            class="simultaneous"
            :color="item?.status?.color"
            size="small"
          >
            {{ item?.status?.name }} (S)
          </v-chip>
        </template>

        <template v-slot:bottom="{ pageCount, totalItems }">
          <v-sheet class="pa-2 py-2 rounded d-flex justify-left align-center bg-background2">
            <v-sheet class="px-2 bg-transparent">
              <span>Items: {{ data.protocols?.length }}</span>
            </v-sheet>
            <v-spacer></v-spacer>
            <v-sheet class="px-2 bg-transparent">
              <v-select
                label="Itens por página"
                :items="[5, 10, 20]"
                v-model="itemsPerPage"
                density="compact"
                variant="outlined"
                style="width: 150px"
                hide-details=""
              />
            </v-sheet>

            <v-sheet class="px-2 bg-transparent">
              <v-pagination
                v-model="page"
                :length="pageCount"
                :total-visible="4"
                density="compact"
              />
            </v-sheet>
          </v-sheet>
        </template>
      </v-data-table>
    </CoreDialog>
  </div>
</template>
<style scoped lang="scss">
  .protocols {
    height: 52px !important;
    width: calc(100%) !important;

    overflow: hidden;
  }

  .scale {
    height: 15px !important;
  }
  .small-card-time-line {
    position: absolute;
    height: 100%;
    overflow: hidden;
    min-width: 3px !important;
    transition: box-shadow 0.3s ease; /* Transição suave para o elevation */
    box-shadow: 0 0 0 0.3px white;

    &:hover {
      z-index: 9999;
      box-shadow:
        0px 6px 6px -3px rgba(0, 0, 0, 0.2),
        0px 10px 14px 1px rgba(0, 0, 0, 0.14),
        0px 4px 18px 3px rgba(0, 0, 0, 0.12);
    }
  }
  .simultaneous {
    // background-color: red !important;
    opacity: 0.5 !important;
    border: 1px solid red !important;
  }
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
