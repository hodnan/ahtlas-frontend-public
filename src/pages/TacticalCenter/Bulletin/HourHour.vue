<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import SummaryCard from '@/components/Module/TacticalCenter/Bulletins/HourHour/SummaryCard.vue'
import moment from 'moment'
import debounce from 'lodash.debounce'
import { moduleStore } from '@/store'

const module = moduleStore()

const search = ref({
  sectorsN1: [],
  managers: []
})

const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  date_ref: urlParams.get('date_ref') ?? moment().format('YYYY-MM-DD')
})

const filteredBoletins = computed(() => {
  let temp = JSON.parse(JSON.stringify(module?.data?.hourHourDate ?? []))

  const filterSectors = search.value.sectorsN1
  const filterManagers = search.value.managers

  if (filterSectors.length > 0) {
    temp = temp.filter((bulletin) => {
      return filterSectors.includes(Number(bulletin.nu_setor))
    })
  }
  // Busca pela matricula do gestor
  if (filterManagers.length > 0) {
    temp = temp.filter((bulletin) => {
      return bulletin.managers.some((manager) => filterManagers.includes(manager.manager_username))
    })
  }

  return temp
})

// Pega a primeira leta do nome
const getFirstLetters = (nome) => {
  const primeirasLetrasArray = nome.match(/[A-Z]/g)
  if (!primeirasLetrasArray) {
    return ''
  }
  return primeirasLetrasArray.slice(0, 2).join('').toUpperCase()
}

watch(
  () => filter,
  async (newFilter) => {
    await module.setUrlParams(filter.value)
    await module.getDataPart(
      'api/tactical-center/bulletin/hour-hour',
      ['hourHourDate', 'sectorsN1', 'managers'],
      filter.value
    )
  },
  { deep: true }
)

let intervalId = null

const fetchData = async () => {
  const currentMinute = moment().minute() // Obtém o minuto atual
  // Executa a função apenas no minuto 20 e no minuto 40
  if (currentMinute === 22 || currentMinute === 30 || currentMinute === 52) {
    await module.getDataPart(
      'api/tactical-center/bulletin/hour-hour',
      ['hourHourDate'],
      filter.value
    )
  } else {
    console.log(`Minuto atual: ${currentMinute}. Esperando o minuto 22,30 ou 52...`)
  }
}

const startFetching = () => {
  // Se já houver um intervalo ativo, não inicia outro
  if (!intervalId) {
    intervalId = setInterval(fetchData, 45 * 1000) // Chama a cada 45 segundos
  }
}

const stopFetching = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null // Limpa o ID do intervalo
  }
}

onMounted(() => {
  startFetching()
})

onBeforeUnmount(() => {
  stopFetching()
})
</script>
<template>
  <v-card>
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="4" md="2" sm="2">
          <v-text-field
            v-model="filter.date_ref"
            class="w-100"
            density="compact"
            color="primary"
            label="Data"
            hide-details=""
            variant="outlined"
            type="date"
          >
            &nbsp;
          </v-text-field>
        </v-col>

        <v-col class="pa-1" cols="4">
          <v-autocomplete
            v-model="search.managers"
            density="compact"
            label="Gestor"
            color="primary"
            :items="module.data.managers"
            hide-details=""
            multiple
            variant="outlined"
            item-title="label"
            item-value="username"
            hide-spin-buttons
            clearable
          >
            <template #chip="{ props, item }">
              <v-chip
                variant="text"
                v-bind="props"
                :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
              >
                {{ getFirstLetters(item.raw.name) }}
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
        <v-col class="pa-1" cols="6">
          <v-autocomplete
            v-model="search.sectorsN1"
            color="primary"
            density="compact"
            label="Setor"
            variant="outlined"
            hide-details=""
            :items="module.data.sectorsN1"
            clearable
            multiple=""
            item-value="id"
            item-title="label"
            chips
          >
            <template #chip="{ props, item }">
              <v-chip v-bind="props">
                {{ item.raw.id }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-col
    cols="12"
    class="pr-1 pl-0 pb-2 pt-3 overflow-auto overflow-x-hidden mt-2 border-imput_border rounded"
    style="height: calc(100vh - 161px)"
  >
    <div v-if="filteredBoletins.length == 0" class="d-flex justify-center align-center h-100">
      <v-progress-circular
        v-if="module.loading"
        :size="115"
        :width="4"
        color="primary"
        indeterminate
      />
      <div v-if="!module.loading">Nenhum dado encontrado</div>
    </div>
    <v-row class="px-2">
      <SummaryCard
        v-for="boletin in filteredBoletins"
        :key="`${boletin.dt_data}-${boletin.nu_setor}`"
        :data="boletin"
      />
    </v-row>
  </v-col>
</template>

<style scoped>
:deep(.v-field__input) {
  height: 40px !important;
  overflow: hidden;
}
</style>