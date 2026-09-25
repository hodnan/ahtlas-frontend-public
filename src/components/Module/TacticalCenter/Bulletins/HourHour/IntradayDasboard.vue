<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import moment from 'moment'
import { moduleStore } from '@/store'
import IntraDayChart from '@/components/Module/TacticalCenter/Bulletins/HourHour/IntraDayChart.vue'

const module = moduleStore()

const props = defineProps({
  dateRef: String,
  sectorN1: Number
})

const getColor = (value, direction) => {
  value = direction ? value * -1 : value
  const color = value > 0 ? ` text-error` : ` text-teal`

  return color
}

const detailData = ref([])

const detailTitle = ref(false)
const detailShow = ref(false)

const detailHover = (isHovered, title, data) => {
  detailData.value = data
  detailTitle.value = title
  detailShow.value = isHovered
}

const headers = ref([
  {
    title: 'Faixa',
    align: 'center',
    key: 'no_intervalo',

    sortable: false
  },
  {
    title: 'NS',
    align: 'center',
    key: 'service_level',
    sortable: false
  },
  {
    title: 'Volume',
    align: 'center',
    key: 'volume',
    sortable: false
  },
  {
    title: 'TMA',
    align: 'center',
    key: 'tma',
    sortable: false
  },
  {
    title: 'Traf.',
    align: 'center',
    key: 'traffic',
    sortable: false
  },
  {
    title: 'Log.',
    align: 'center',
    key: 'login',
    sortable: false
  },
  {
    title: 'Pausas',
    align: 'center',
    key: 'breaks',
    sortable: false,
    class: 'px-1'
  }
])

const downloadCSV = async () => {
  module.setDownloading(true)

  try {
    const data = JSON.parse(JSON.stringify(module?.data?.intraday?.intraday ?? []))

    // Combina 'dt_data_hora' e 'dt_data' em uma única chave 'dt_data_hora'
    const combinedData = data.map((item) => {
      item.dt_data = item.no_intervalo == 'Total' ? '' : item.dt_data
      delete item.dt_data_hora
      return item
    })

    // Converte cada item do array para uma forma achatada
    const flatData = combinedData.map((item) => flattenObject(item))

    // Converte os dados achatados para CSV
    const csv = convertToCSV(flatData)

    // Adiciona BOM para corrigir problemas de caracteres especiais
    const bom = '\uFEFF'
    const csvWithBom = bom + csv

    // Cria um Blob com os dados CSV
    const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' })

    // Cria um link para o download
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'intraday_data.csv')
    link.style.visibility = 'hidden'

    // Adiciona o link ao DOM e simula o clique
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    await sleep(2000)
  } catch (error) {
    console.error('Erro ao baixar o CSV:', error)
  } finally {
    module.setDownloading(false)
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const flattenObject = (obj, parent = '', res = {}) => {
  for (let key in obj) {
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      'label' in obj[key] &&
      'value' in obj[key]
    ) {
      let label = obj[key].label
      // Converte número para formato brasileiro
      res[label] =
        typeof obj[key].value === 'number'
          ? obj[key].value.toString().replace('.', ',')
          : obj[key].value
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenObject(obj[key], parent, res)
    } else {
      let propName = parent ? parent + '.' + key : key
      // Converte número para formato brasileiro
      res[propName] =
        typeof obj[key] === 'number' ? obj[key].toString().replace('.', ',') : obj[key]
    }
  }
  return res
}

const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray

  // Coleta todos os cabeçalhos possíveis
  let headersSet = new Set()
  array.forEach((item) => {
    Object.keys(item).forEach((key) => headersSet.add(key))
  })

  // Converte Set para array
  const headers = Array.from(headersSet)
  let str = headers.join(';') + '\r\n'

  // Linhas de dados
  array.forEach((item) => {
    let line = headers
      .map((header) => {
        return item[header] !== undefined ? item[header] : ''
      })
      .join(';')
    str += line + '\r\n'
  })

  return str
}
onMounted(async () => {
  try {
    if (
      module.data?.intraday?.nu_setor === props.sectorN1 &&
      module.data?.intraday?.dt_data === props.dateRef
    ) {
    } else {
      await getData()
    }
  } catch (error) {}
})

const getData = async () => {
  try {
    await module.getShow(
      `/api/tactical-center/bulletin/hour-hour/show/${props.dateRef}/${props.sectorN1}`,
      ['intraday']
    )
  } catch (error) {}
}

let intervalId = null

const fetchData = async () => {
  const currentMinute = moment().minute() // Obtém o minuto atual
  // Executa a função apenas no minuto 20 e no minuto 40
  if (currentMinute === 22 || currentMinute === 30 || currentMinute === 52) {
    await getData()
  } else {
    console.log(`IntraDay Minuto atual: ${currentMinute}. Esperando o minuto 22,30 ou 52...`)
  }
}

const startFetching = () => {
  // console.log(intervalId)
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
  <v-row class="ma-0 bg-background">
    <v-col cols="6" class="pa-0">
      <v-col cols="12" class="pa-2 pr-1 pb-1 h-50">
        <IntraDayChart :data="module.data?.intraday?.chart" />
      </v-col>
      <v-col cols="12" class="pa-2 pr-1 pt-1 h-50">
        <v-card class="h-100 pt-1">
          <v-card-text class="d-flex align-center justify-center h-25">
            <span class="text-h2 text-brand_txt w-100">
              NS: {{ module.data?.intraday?.service_level.real_general.value }}%
            </span>
            <span class="w-25 text-brand_txt d-flex justify-end">
              <v-btn
                :loading="module.downloading"
                color="brand_roxo2"
                @click="downloadCSV"
                icon="mdi-cloud-print-outline"
              >
              </v-btn>
            </span>
          </v-card-text>
          <div class="h-50 pt-3">
            <v-card-text class="d-flex align-center justify-center py-1">
              <span class="text-h5 text-brand_txt w-50">
                Volume:
                {{ module.data?.intraday?.volume?.difference_call?.value }}%
              </span>
              <span class="text-h5 text-brand_txt w-50">
                TMA: {{ module.data?.intraday?.tma?.difference?.value }}%
              </span>
            </v-card-text>
            <v-card-text class="d-flex align-center justify-center py-1">
              <span class="text-h5 text-brand_txt w-50">
                Log: {{ module.data?.intraday?.login?.difference_agent?.value }}%
              </span>
              <span class="text-h5 text-brand_txt w-50">
                Pausas:
                {{ module.data?.intraday?.login?.difference_break?.value }}%
              </span>
            </v-card-text>
          </div>
          <v-card-text class="d-flex align-end justify-center h-25 py-1 pt-2">
            <span class="text-subtitle-1 text-brand_txt">
              Data: {{ module.data?.intraday?.dt_data }}
            </span>

            <v-spacer />
            <span class="text-subtitle-1 text-brand_txt">
              Faixa: {{ module.data?.intraday?.no_intervalo }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-col>
    <v-col cols="6" class="pa-2 pl-1">
      <v-card class="mt-0 pa-0">
        <v-card-text class="px-2">
          <v-tooltip v-model="detailShow" location="bottom">
            <template v-slot:activator="{ props }">
              <span v-bind="props"></span>
            </template>
            <v-card class="pa-0 elevation-0" color="transparent">
              <v-card-title class="text-center text-subtitle-1 pa-0">
                {{ detailTitle }}
              </v-card-title>
              <v-card-text class="pa-0 pb-3">
                <v-row class="ma-0" v-for="line in detailData" :key="line.label">
                  <v-col class="pa-0">
                    {{ line.label }} : {{ line.value }}{{ line?.simbol }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tooltip>
          <v-data-table-virtual
            :headers="headers"
            :items="module.data?.intraday?.intraday"
            item-value="name"
            item-key="id"
            fixed-header
            density="compact"
            enter-class="text-caption"
            class="elevation-0"
          >
            <template #[`item.service_level`]="{ item }">
              <span
                @mouseenter="detailHover(true, 'NS - ' + item.no_intervalo, item.service_level)"
                @mouseleave="detailHover(false, '', [])"
                :class="getColor(item.service_level.difference.value, 1)"
              >
                <span
                  class="v-data-table__td cursor-pointer"
                  v-if="item.service_level.real_general.value"
                >
                  {{ item.service_level.real_general.value }}
                </span>
                <v-icon
                  class="v-data-table__td cursor-pointer"
                  v-else
                  icon="mdi-border-none-variant"
                />
              </span>
            </template>
            <template #[`item.volume`]="{ item }">
              <span
                @mouseenter="detailHover(true, 'Volume - ' + item.no_intervalo, item.volume)"
                @mouseleave="detailHover(false, '', [])"
                :class="getColor(item.volume.difference_call.value, 0)"
              >
                <span
                  class="v-data-table__td cursor-pointer"
                  v-if="item.volume.real_call_received.value"
                >
                  {{ item.volume.real_call_received.value }}
                </span>
                <v-icon
                  class="v-data-table__td cursor-pointer"
                  v-else
                  icon="mdi-border-none-variant"
                />
              </span>
            </template>

            <template #[`item.tma`]="{ item }">
              <span
                @mouseenter="detailHover(true, 'TMA - ' + item.no_intervalo, item.tma)"
                @mouseleave="detailHover(false, '', [])"
                :class="getColor(item.tma.difference.value, 0)"
              >
                <span class="v-data-table__td cursor-pointer" v-if="item.tma.real_general.value">
                  {{ item.tma.real_general.value }}
                </span>
                <v-icon
                  class="v-data-table__td cursor-pointer"
                  v-else
                  icon="mdi-border-none-variant"
                />
              </span>
            </template>

            <template #[`item.traffic`]="{ item }">
              <span
                @mouseenter="detailHover(true, 'Tráfego - ' + item.no_intervalo, item.traffic)"
                @mouseleave="detailHover(false, '', [])"
                :class="getColor(item.traffic.difference.value, 0)"
              >
                <span
                  class="v-data-table__td cursor-pointer"
                  v-if="item.traffic.real_general.value"
                >
                  {{ item.traffic.real_general.value }}
                </span>
                <v-icon
                  class="v-data-table__td cursor-pointer"
                  v-else
                  icon="mdi-border-none-variant"
                />
              </span>
            </template>
            <template #[`item.login`]="{ item }">
              <span
                @mouseenter="detailHover(true, 'Login - ' + item.no_intervalo, item.login)"
                @mouseleave="detailHover(false, '', [])"
                :class="getColor(item.login.difference_agent.value, 1)"
              >
                <span class="v-data-table__td cursor-pointer" v-if="item.login.real_agent.value">
                  {{ item.login.real_agent.value }}
                </span>
                <v-icon
                  class="v-data-table__td cursor-pointer"
                  v-else
                  icon="mdi-border-none-variant"
                />
              </span>
            </template>

            <template #[`item.breaks`]="{ item }">
              <span
                @mouseenter="detailHover(true, 'Pausas - ' + item.no_intervalo, item.breaks)"
                @mouseleave="detailHover(false, '', [])"
                :class="getColor(item.login.difference_break.value, 0)"
              >
                <span class="v-data-table__td cursor-pointer" v-if="item.login.real_break.value">
                  {{ item.login.real_break.value }}
                </span>
                <v-icon
                  class="v-data-table__td cursor-pointer"
                  v-else
                  icon="mdi-border-none-variant"
                />
              </span>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
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
  /* padding-left: 32px; */
  padding: 0;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 91px);
  /* height: 150px; */
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}

:deep(.v-data-table__td) {
  font-size: 0.8rem !important;
}
</style>