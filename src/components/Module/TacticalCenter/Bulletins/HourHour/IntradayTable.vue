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

const headers = ref([
  {
    title: 'Faixa',
    align: 'center',
    key: 'no_intervalo',
    sortable: false
  },
  {
    title: 'NS - Dim',
    align: 'center',
    key: 'service_level.scaled_partial.value',
    sortable: false
  },
  {
    title: 'NS - Real',
    align: 'center',
    key: 'service_level.real_general.value',
    sortable: false
  },
  {
    title: 'NS - Dif',
    align: 'center',
    key: 'service_level.difference.value',
    sortable: false
  },
  {
    title: 'Volume - Dim.',
    align: 'center',
    key: 'volume.scaled_call.value',
    sortable: false
  },
  {
    title: 'Volume - Real',
    align: 'center',
    key: 'volume.real_call_received.value',
    sortable: false
  },
  {
    title: 'Volume - Atd.',
    align: 'center',
    key: 'volume.real_call_answered.value',
    sortable: false
  },
  {
    title: 'Volume - %',
    align: 'center',
    key: 'volume.difference_call.value',
    sortable: false
  },
  {
    title: 'Volume - Abn.',
    align: 'center',
    key: 'volume.real_abandoned.value',
    sortable: false
  },
  {
    title: 'Volume - Abn. %',
    align: 'center',
    key: 'volume.difference_abandoned.value',
    sortable: false
  },

  {
    title: 'TMA - Dim',
    align: 'center',
    key: 'tma.scaled.value',
    sortable: false
  },
  {
    title: 'TMA - Geral',
    align: 'center',
    key: 'tma.real_general.value',
    sortable: false
  },
  {
    title: 'TMA - Recep.',
    align: 'center',
    key: 'tma.real_receptive.value',
    sortable: false
  },
  {
    title: 'TMA - %',
    align: 'center',
    key: 'tma.difference.value',
    sortable: false
  },
  {
    title: 'Traf. - Dim',
    align: 'center',
    key: 'traffic.scaled.value',
    sortable: false
  },
  {
    title: 'Traf. - Ent.',
    align: 'center',
    key: 'traffic.real_general.value',
    sortable: false
  },
  {
    title: 'Traf. - Ent. %',
    align: 'center',
    key: 'traffic.difference.value',
    sortable: false
  },
  {
    title: 'Traf. - Atd.',
    align: 'center',
    key: 'traffic.real_met.value',
    sortable: false
  },
  {
    title: 'Log. Agen. - Dim',
    align: 'center',
    key: 'login.scaled_agent.value',
    sortable: false
  },
  {
    title: 'Log. Agen - Real',
    align: 'center',
    key: 'login.real_agent.value',
    sortable: false
  },
  {
    title: 'Log. Agen - %',
    align: 'center',
    key: 'login.difference_agent.value',
    sortable: false
  },
  {
    title: 'Log. Tempo - Dim',
    align: 'center',
    key: 'login.scaled_time.value',
    sortable: false
  },
  {
    title: 'Log. Tempo - Real',
    align: 'center',
    key: 'login.real_time.value',
    sortable: false
  },
  {
    title: 'Log. Tempo - %',
    align: 'center',
    key: 'login.difference_time.value',
    sortable: false
  },
  {
    title: 'Log. Pausa - Dim',
    align: 'center',
    key: 'login.scaled_break.value',
    sortable: false
  },
  {
    title: 'Log. Pausa - Real',
    align: 'center',
    key: 'login.real_break.value',
    sortable: false
  },
  {
    title: 'Log. Pausa - %',
    align: 'center',
    key: 'login.difference_break.value',
    sortable: false
  },
  {
    title: 'Log. Atd - Dim',
    align: 'center',
    key: 'login.scaled_attended.value',
    sortable: false
  },
  {
    title: 'Log. Atd - Real',
    align: 'center',
    key: 'login.real_attended.value',
    sortable: false
  },
  {
    title: 'Log. Atd - %',
    align: 'center',
    key: 'login.difference_attended.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Lanche',
    align: 'center',
    key: 'breaks.lunch.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Refeição',
    align: 'center',
    key: 'breaks.meal.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Descanso',
    align: 'center',
    key: 'breaks.rest.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Banheiro',
    align: 'center',
    key: 'breaks.bathroom.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Feedback',
    align: 'center',
    key: 'breaks.feedback.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Reunião',
    align: 'center',
    key: 'breaks.meeting.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Exame Periódico',
    align: 'center',
    key: 'breaks.exam.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Treinamento',
    align: 'center',
    key: 'breaks.training.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Backoffice',
    align: 'center',
    key: 'breaks.backoffice.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Defeito',
    align: 'center',
    key: 'breaks.defect.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Logof',
    align: 'center',
    key: 'breaks.logof.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Logof',
    align: 'center',
    key: 'breaks.logof.value',
    sortable: false
  },
  {
    title: 'Log. Pausa % - Callback',
    align: 'center',
    key: 'breaks.callback.value',
    sortable: false
  }

  // {
  //   title: "Pausas",
  //   align: "center",
  //   key: "breaks",
  //   sortable: false,
  //   class: "px-1",
  // },
])

const downloadCSV = async () => {
  module.setDownloading(true)

  try {
    const data = JSON.parse(JSON.stringify(module.data?.intraday?.intraday ?? []))

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
  </v-data-table-virtual>
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
  /* padding: 0; */
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 45px);
  /* height: 150px; */
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}

:deep(.v-data-table__td) {
  font-size: 0.8rem !important;
}
</style>
