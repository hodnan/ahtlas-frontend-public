<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { moduleStore, authStore } from '@/store'
  import CoreDialog from '@/components/Core/Utils/Dialog.vue'
  import EnployeeShow from '@/components/Module/People/Employee/EmployeeShow.vue'

  const module = moduleStore()
  const auth = authStore()
  const dialogShow = ref()
  const employeeUsername = ref()
  const employeeName = ref()

  const dialogOpem = (event, item) => {
    dialogShow.value = true
    employeeUsername.value = item?.item?.username
    employeeName.value = item?.item?.name
  }

  const urlParams = new URLSearchParams(window.location.search)

  const filter = ref({
    active: urlParams.get('active') ? parseInt(urlParams.get('active')) : null,
    manager: urlParams.get('manager') ? urlParams.get('manager') : auth.user.manager_n1_id,
    sector_n1_id: urlParams.get('sector_n1_id') ? parseInt(urlParams.get('sector_n1_id')) : null,
    username: urlParams.get('username') ?? null,
    name: urlParams.get('name') ?? null
  })

  onMounted(async () => {
    await module.setUrlParams(filter.value)
  })

  const search = ref()

  const headers = ref([
    {
      title: 'Colaborador / Setor / Subsetor',
      align: 'left',
      key: 'label'
    },
    {
      title: 'Site',
      align: 'center',
      key: 'uf'
    },
    {
      title: 'Gestores',
      align: 'left',
      key: 'manager_n1_id'
    },
    {
      title: 'Status',
      align: 'center',
      key: 'status',
      width: '150'
    }
  ])

  const employees = computed(() => {
    return JSON.parse(JSON.stringify(module.data?.employees ?? []))
  })

  const filteredEmployees = computed(() => {
    if (!search.value) return employees.value

    const searchfilter = search.value.toLowerCase()

    return employees.value.filter((item) => {
      const employeesJson = JSON.stringify(item).toLowerCase()

      if (employeesJson.includes(searchfilter)) {
        console.log(employeesJson.includes(searchfilter))
      }

      return employeesJson.includes(searchfilter)
    })
  })

  // Get the first and last name
  const getFirstAndLastName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') return ''

    const words = fullName.trim().split(/\s+/) // Split the name by spaces
    if (words.length === 1) {
      return words[0] // Return the single name if there's only one
    }

    const firstName = words[0]
    const lastName = words[words.length - 1]
    return `${firstName} ${lastName}`
  }

  const submit = async () => {
    await module.setUrlParams(filter.value)
    await module.getDataPart('api/people/employee/current', ['employees'], filter.value)
  }
</script>
<template>
  <form @submit.prevent="submit">
    <v-card>
      <v-card-text class="pa-2">
        <v-row class="ma-0">
          <v-col class="pa-1" cols="1">
            <v-text-field
              v-model="filter.username"
              density="compact"
              color="primary"
              label="Matícula"
              hide-details
              variant="outlined"
            />
          </v-col>
          <v-col class="pa-1" cols="2">
            <v-text-field
              v-model="filter.name"
              density="compact"
              color="primary"
              label="Nome"
              hide-details
              variant="outlined"
            />
          </v-col>
          <v-col class="pa-1" cols="2">
            <v-autocomplete
              v-model="filter.manager"
              density="compact"
              label="Gestor"
              color="primary"
              class="inputH40"
              :items="module.data.managers"
              hide-details=""
              variant="outlined"
              item-title="label"
              item-value="username"
              hide-spin-buttons
              closable-chips
              menu-icon=""
            >
              <template #chip="{ props, item, index }">
                <v-chip
                  v-bind="props"
                  class="rounded-0"
                  variant="text"
                  :key="index"
                  :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                >
                  {{ getFirstAndLastName(item.raw.name) }}
                </v-chip>
              </template>

              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw.position_summary + ' | ' + item.raw.username"
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
          <v-col cols="3" class="pa-1">
            <v-autocomplete
              v-model="filter.sector_n1_id"
              density="compact"
              label="Setor"
              color="primary"
              :items="module.data.sectorsN1"
              hide-details=""
              variant="outlined"
              item-title="label"
              item-value="id"
              hide-spin-buttons
              clearable
              menu-icon=""
            ></v-autocomplete>
          </v-col>

          <v-col cols="1" class="pa-1">
            <v-autocomplete
              v-model="filter.active"
              density="compact"
              label="Situação"
              color="primary"
              :items="[
                { id: null, label: 'Todos' },
                { id: 1, label: 'Ativo' },
                { id: 0, label: 'Inativo' }
              ]"
              hide-details=""
              variant="outlined"
              item-title="label"
              item-value="id"
              hide-spin-buttons
              menu-icon=""
            ></v-autocomplete>
          </v-col>

          <v-col cols="2" class="pa-1">
            <v-text-field
              v-model="search"
              density="compact"
              color="primary"
              label="Filtro"
              hide-details
              prependInnerIcon="mdi-filter"
              variant="outlined"
            />
          </v-col>
          <v-col cols="1" class="pa-1">
            <v-btn class="w-100" style="height: 40px" type="submit">Buscar</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </form>
  <!-- {{ filteredEmployees }} -->
  <v-card class="mt-3">
    <v-card-text class="d-flex py-2">
      <v-icon icon="mdi-account" class="text-brand_txt pt-2" />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Colaboradores</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ filteredEmployees?.length }}
      </div>

      <!-- <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd">
        <v-icon icon="mdi-plus" />
      </v-btn> -->
    </v-card-text>
    <v-card-text class="py-0 pb-3">
      <v-data-table-virtual
        :headers="headers"
        :items="filteredEmployees"
        :loading="module.loading"
        fixed-header
        density="compact"
        class="elevation-0"
        @click:row="dialogOpem"
      >
        <template #[`item.label`]="{ item }">
          <ul class="text-decoration-none">
            <li>{{ item.label }}</li>
            <li>{{ item.sector_n1?.label }}</li>
            <li v-if="item.sector_n2?.label">{{ item.sector_n2?.label }}</li>
          </ul>

          <!-- <br />
          {{ item.sector_n2?.label }} <br /> -->
        </template>
        <template #[`item.manager_n1_id`]="{ item }">
          <ul class="text-decoration-none">
            <li v-if="item.manager_n1?.label">{{ item.manager_n1?.label }}</li>
            <li v-if="item.manager_n2?.label">{{ item.manager_n2?.label }}</li>
            <li v-if="item.manager_n3?.label">{{ item.manager_n3?.label }}</li>
            <li v-if="item.manager_n4?.label">{{ item.manager_n4?.label }}</li>
            <li v-if="item.manager_n5?.label">{{ item.manager_n5?.label }}</li>
          </ul>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>

  <CoreDialog
    v-model="dialogShow"
    header-icon="mdi-badge-account-outline"
    :header-title="employeeName"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-0 pb-3 px-0"
    headerheight="35px"
    max-width="750px"
    min-height="250px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <EnployeeShow v-model="dialogShow" :username="employeeUsername" />
  </CoreDialog>
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

  :deep(.v-table__wrapper) {
    height: calc(100vh - 222px);
  }

  :deep(.v-table__wrapper table thead tr th:hover) {
    color: #eeebeb !important;
  }
</style>
