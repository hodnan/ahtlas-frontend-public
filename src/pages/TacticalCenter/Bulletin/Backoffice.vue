<script setup>
  import { ref, watch, computed, defineAsyncComponent, onMounted } from 'vue'
  import DrawerTop from '@/components/Core/Utils/DrawerTop.vue'
  import SelectEmployee from '@/components/Core/Utils/Form/SelectEmployee.vue'
  import { moduleStore, coreStore, notifyStore, authStore } from '@/store'
  import moment from 'moment'
  import debounce from 'lodash.debounce'

  const SummaryCard = defineAsyncComponent(
    () => import('@/components/Module/TacticalCenter/Bulletins/Backoffice/SummaryCard.vue')
  )

  const core = coreStore()
  const auth = authStore()
  const module = moduleStore()
  const notify = notifyStore()
  const loadingFilter = ref(false)
  const applyFilter = ref(true)

  const urlParams = new URLSearchParams(window.location.search)

  const tabs = ref([
    { id: 'date_ref', label: 'DATA' },
    { id: 'queue_id', label: 'FILA' },
    { id: 'environment_id', label: 'AMBIENTE' },
    { id: 'mailing_id', label: 'MAILING' },
    { id: 'status_id', label: 'STATUS' },
    { id: 'username', label: 'MATRICULA' },
    { id: 'sector_n1_id', label: 'SETOR' },
    { id: 'manager_n1_id', label: 'SUPERVISOR' },
    { id: 'manager_n2_id', label: 'COORDENADOR' }
  ])
  const headers = ref([
    {
      title: 'date_ref',
      align: 'left',
      key: 'date_ref'
    }
  ])

  const page = ref(1)
  const itemsPerPage = ref(10)

  const manager = ref()
  const managerName = ref()
  const managerLabel = ref()
  const employee = ref()

  const form = ref({
    date_start: urlParams.get('date_start'),
    date_end: urlParams.get('date_end'),
    time_start: urlParams.get('time_start'),
    time_end: urlParams.get('time_end'),
    manager:
      urlParams.get('filter') == 'false' ? auth.user.manager_n1_id : urlParams.get('manager'),
    mailing: urlParams.get('mailing') ? parseInt(urlParams.get('mailing')) : null,
    sector: urlParams.get('sector') ? parseInt(urlParams.get('sector')) : null,
    queue: urlParams.get('queue') ? parseInt(urlParams.get('queue')) : null,
    environment: urlParams.get('environment') ? parseInt(urlParams.get('environment')) : null,
    status: urlParams.get('status') ? parseInt(urlParams.get('status')) : null,
    simultaneous: urlParams.get('simultaneous') ? parseInt(urlParams.get('simultaneous')) : null,
    pouse: urlParams.get('pouse'),
    break: urlParams.get('break'),
    group: urlParams.get('group'),
    employee: urlParams.get('employee')
  })

  onMounted(async () => {
    core.drawerTopToggle()

    await module.setUrlParams(form.value)
  })

  const periodDate = computed(
    () =>
      `${moment(form?.value?.date_start).format('DD/MM')} a ${moment(form?.value?.date_end).format('DD/MM')}`
  )
  const periodTime = computed(() => `${form?.value?.time_start} a ${form?.value?.time_end}`)

  const mailing = computed(() => {
    return module?.data?.mailings?.find((item) => item.id === form.value.mailing)
  })
  const environment = computed(() => {
    return module?.data?.environments?.find((item) => item.id === form.value.environment)
  })
  const sector = computed(() => {
    return module?.data?.sectorsN1?.find((item) => item.id === form.value.sector)
  })
  const queue = computed(() => {
    return module?.data?.queues?.find((item) => item.id === form.value.queue)
  })
  const status = computed(() => {
    return module?.data?.statuses?.find((item) => item.id === form.value.status)
  })

  const clearUndefinedValues = () => {
    if (!manager.value) form.value.manager = null
    if (!mailing.value) form.value.mailing = null
    if (!environment.value) form.value.environment = null
    if (!sector.value) form.value.sector = null
    if (!queue.value) form.value.queue = null
  }

  const getNewdata = async () => {
    await module.setUrlParams(form.value)

    core.drawerTop = false
    await module.getDataPart(
      'api/tactical-center/bulletin/backoffice',
      ['sectorsN1', 'environments', 'queues', 'mailings', 'backoffice'],
      form.value
    )
    applyFilter.value = true
  }

  watch(
    () => form.value,
    async (newValue, oldValue) => {
      await module.setUrlParams(form.value)
      applyFilter.value = false
    },
    { deep: true }
  )

  watch(
    () => form.value.group,
    async (newValue, oldValue) => {
      await getNewdata()
    }
  )

  watch(manager, (newValue) => {
    managerName.value = newValue.value?.name
    managerLabel.value = newValue.value?.label
  })

  let currentRequestId = 0
  watch(
    [() => form.value.date_start, () => form.value.date_end],
    debounce(async ([newStart, newEnd], [oldStart, oldEnd]) => {
      if (newStart !== oldStart || newEnd !== oldEnd) {
        const requestId = ++currentRequestId // Incrementa o ID da requisição

        loadingFilter.value = true
        try {
          await module.setUrlParams(form.value)
          await module.getDataPart(
            'api/tactical-center/bulletin/backoffice/filter',
            ['sectorsN1', 'environments', 'queues', 'mailings'],
            null,
            false
          )
        } finally {
          if (requestId === currentRequestId) {
            // await new Promise((resolve) => setTimeout(resolve, 1000))
            clearUndefinedValues()
            loadingFilter.value = false
          }
        }
      }
    }, 1000),
    { deep: true }
  )
</script>

<template>
  <div>
    <v-card class="mb-2">
      <v-card-text class="pa-0">
        <v-row class="ma-0">
          <v-col
            cols="12"
            class="d-flex align-center pa-0 cursor-pointer"
            @click="core.drawerTopToggle()"
          >
            <v-sheet class="pr-1 pl-3" v-tooltip="!applyFilter ? 'Filtro não aplicado' : 'ok'">
              <v-btn
                :loading="module.loading"
                icon="mdi-magnify"
                density="compact"
                color="transparent"
                elevation="0"
                :class="!applyFilter ? 'text-error' : ''"
                rounded="0"
              ></v-btn>
            </v-sheet>

            <v-sheet class="px-2 d-flex flex-column" :class="!applyFilter ? 'text-error' : ''">
              <span style="width: 150px">
                <b>Data:</b>
                {{ periodDate }}
              </span>
              <span style="width: 150px">
                <b>Hora:</b>
                {{ periodTime }}
              </span>
            </v-sheet>

            <v-sheet class="px-2 d-flex flex-column" :class="!applyFilter ? 'text-error' : ''">
              <span
                v-if="form.manager"
                style="width: 220px"
                v-tooltip="managerLabel ?? manager?.label"
                class="text-caption text-truncate"
              >
                <b>Gertor:</b>

                {{ managerName ?? manager?.name }}
              </span>
              <span
                v-if="form.employee"
                style="width: 220px"
                v-tooltip="employee?.label"
                class="text-caption text-truncate"
              >
                <b>Colaborador:</b>
                {{ employee?.name }}
              </span>
            </v-sheet>

            <v-sheet class="px-2 d-flex flex-column" :class="!applyFilter ? 'text-error' : ''">
              <span
                v-if="sector?.label"
                style="width: 250px"
                v-tooltip="sector?.label"
                class="text-caption text-truncate"
              >
                <b>Setor:</b>
              </span>
              <span
                v-if="sector?.label"
                style="width: 250px"
                v-tooltip="sector?.label"
                class="text-caption text-truncate"
              >
                {{ sector?.label }}
              </span>
            </v-sheet>

            <v-sheet class="px-2 d-flex flex-column" :class="!applyFilter ? 'text-error' : ''">
              <span
                v-if="form.mailing"
                style="width: 200px"
                v-tooltip="mailing?.name"
                class="text-caption text-truncate"
              >
                <b>Mailing:</b>
                {{ mailing?.name }}
              </span>
              <span
                v-if="form.queue"
                style="width: 200px"
                v-tooltip="queue?.name"
                class="text-caption text-truncate"
              >
                <b>Fila:</b>
                {{ queue?.name }}
              </span>
            </v-sheet>

            <v-sheet class="px-2 d-flex flex-column" :class="!applyFilter ? 'text-error' : ''">
              <span
                v-if="status?.name"
                style="width: 200px"
                v-tooltip="status?.name"
                class="text-caption text-truncate"
              >
                <b>Status:</b>
                {{ status?.name }}
              </span>
              <span
                v-if="environment?.name"
                style="width: 200px"
                v-tooltip="environment?.name"
                class="text-caption text-truncate"
              >
                <b>Ambiênte:</b>
                {{ environment?.name }}
              </span>
            </v-sheet>

            <v-spacer />
            <v-sheet style="width: 200px !important">
              <v-autocomplete
                :loading="module.loading"
                ref="tab"
                v-model="form.group"
                density="compact"
                color="app"
                class="bg-app rounded-0 rounded-e-lg pa-0 font-lg text-uppercase"
                :items="tabs"
                hide-details=""
                menu-icon=""
                item-title="label"
                item-value="id"
                hide-spin-buttons
                variant="plain"
                @click.stop
              ></v-autocomplete>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <DrawerTop>
      <v-row class="ma-0">
        <v-col cols="2" class="pa-1">
          <v-text-field
            v-model="form.date_start"
            class=""
            color="primary"
            density="compact"
            label="Data Início"
            variant="outlined"
            hide-details=""
            type="date"
            :error-messages="notify?.errors?.date_start"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-text-field
            v-model="form.date_end"
            class=""
            color="primary"
            density="compact"
            label="Data Fim"
            variant="outlined"
            hide-details=""
            type="date"
            :error-messages="notify?.errors?.date_end"
          >
            &nbsp;
          </v-text-field>
        </v-col>

        <v-col cols="3" class="pa-1">
          <SelectEmployee
            v-model="form.manager"
            v-model:employees="manager"
            label="Gestor"
            :clearable="true"
            accept_1="\TacticalCenter\Bulletin\BulletinBackofficeService"
            accept_2="getManagers"
            :hierarchical_level="[1, 2, 3, 4]"
          />
        </v-col>
        <v-col cols="3" class="pa-1">
          <SelectEmployee
            v-model="form.employee"
            v-model:employees="employee"
            label="Colaborador"
            :clearable="true"
            :hierarchical_level="[0]"
          />
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-autocomplete
            :loading="loadingFilter"
            v-model="form.sector"
            :items="module.data?.sectorsN1"
            color="primary"
            label="Setor"
            hide-spin-buttons
            density="compact"
            item-title="label"
            item-value="id"
            variant="outlined"
            menu-icon=""
            hide-details=""
            clearable
            :error-messages="notify?.errors?.sector"
          />
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col cols="2" class="pa-1">
          <v-text-field
            v-model="form.time_start"
            color="primary"
            density="compact"
            label="Hora Início"
            variant="outlined"
            hide-details=""
            type="time"
            :error-messages="notify?.errors?.time_start"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-text-field
            v-model="form.time_end"
            color="primary"
            density="compact"
            label="Hora Início"
            variant="outlined"
            hide-details=""
            type="time"
            :error-messages="notify?.errors?.time_end"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col cols="2" class="pa-1 px-1">
          <v-autocomplete
            :loading="loadingFilter"
            v-model="form.environment"
            density="compact"
            color="primary"
            label="Ambiente"
            :items="module.data.environments"
            hide-details=""
            menu-icon=""
            hide-spin-buttons
            item-title="name"
            item-value="id"
            variant="outlined"
            clearable
            :error-messages="notify?.errors?.environments"
          />
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-autocomplete
            :loading="loadingFilter"
            v-model="form.mailing"
            density="compact"
            color="primary"
            label="Mailing"
            :items="module.data.mailings"
            hide-details=""
            menu-icon=""
            hide-spin-buttons
            item-title="name"
            item-value="id"
            variant="outlined"
            clearable
            :error-messages="notify?.errors?.mailing"
          />
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-autocomplete
            :loading="loadingFilter"
            v-model="form.queue"
            density="compact"
            color="primary"
            label="Fila"
            :items="module.data.queues"
            hide-details=""
            menu-icon=""
            hide-spin-buttons
            item-title="name"
            item-value="id"
            variant="outlined"
            clearable
            :error-messages="notify?.errors?.queue"
          />
        </v-col>
        <v-col cols="2" class="pa-1">
          <v-autocomplete
            v-model="form.status"
            density="compact"
            color="primary"
            label="Status"
            :items="module.data.statuses"
            hide-details=""
            menu-icon=""
            hide-spin-buttons
            item-title="name"
            item-value="id"
            variant="outlined"
            clearable
            :error-messages="notify?.errors?.status"
          />
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col class="pa-1">
          <v-btn @click="getNewdata()">aplicar</v-btn>
        </v-col>
      </v-row>
    </DrawerTop>

    <v-card class="bg-transparent" elevation="0">
      <v-card-text class="pa-0">
        <v-data-table
          :headers="headers"
          :items="module?.data?.backoffice"
          :loading="module.loading"
          fixed-header
          :items-per-page="itemsPerPage"
          :page="page"
          no-data-text="Nenhum item encontrado"
          @update:page="page = $event"
          @update:itemsPerPage="itemsPerPage = $event"
          select-strategy="page"
          density="compact"
          class="elevation-0 bg-transparent"
        >
          <template v-slot:headers="{ item }">
            <v-sheet
              class="pa-3 py-1 rounded elevation-3 d-flex justify-left align-center bg-background2"
            >
              <v-sheet
                v-for="status in module.data.statuses"
                :key="status.id"
                class="px-2 bg-transparent"
              >
                <v-icon class="max-2" :color="status?.color" icon="mdi-square" />
                {{ status?.name }}
              </v-sheet>
              <v-sheet class="px-2 bg-transparent">
                <v-icon class="max-2" color="error" icon="mdi-square-outline" />
                Simultâneos
              </v-sheet>
            </v-sheet>
          </template>
          <template v-slot:item="{ item }">
            <v-row class="ma-0">
              <v-col class="pa-0 py-1 bg-background">
                <SummaryCard :data="item" :group="form.group" />
              </v-col>
            </v-row>
          </template>
          <template v-slot:bottom="{ pageCount, totalItems }">
            <v-sheet
              class="pa-2 py-2 rounded elevation-3 d-flex justify-left align-center bg-background2"
            >
              <v-sheet class="px-2 bg-transparent">
                <span>Items: {{ module?.data?.backoffice?.length }}</span>
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
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
  .simultaneous {
    // background-color: red !important;
    opacity: 0.5 !important;
    border: 1px solid red !important;
  }
  .compact :deep(.v-field__input) {
    padding-left: 3px !important;
    padding-right: 4px !important;
    text-align: center !important;
  }

  .font-lg :deep(.v-field__input) {
    font-size: 14px;
    padding: 5px !important;
    padding-left: 25px !important;
    height: 56px !important;
    text-align: center !important;
  }

  .bg-opacity-10 {
    background-color: rgb(var(--v-theme-background2), 0.7);
  }

  /* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
  :deep(.v-table__wrapper table thead tr th) {
    background-color: #08544c !important;
    color: #eeebeb !important;
    padding-left: 32px;
    height: 30px !important;
  }

  :deep(.v-table__wrapper) {
    height: calc(100vh - 210px);
  }

  :deep(.v-table__wrapper table thead tr th:hover) {
    color: #eeebeb !important;
  }
</style>
