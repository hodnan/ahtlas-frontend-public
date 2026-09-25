<script setup>
import { coreStore, moduleStore } from '@/store'
import moment from 'moment'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import DeltaChartLine from '@/components/Module/TacticalCenter/Bulletins/HourHour/DeltaChartLine.vue'
import IntradayDasboard from '@/components/Module/TacticalCenter/Bulletins/HourHour/IntradayDasboard.vue'
import IntradayTable from '@/components/Module/TacticalCenter/Bulletins/HourHour/IntradayTable.vue'
// import HourHourView from '@/Components/Modules/Reports/HourHour/HourHourView.vue'
// import HourHourViewTable from '@/Components/Modules/Reports/HourHour/HourHourViewTable.vue'

const props = defineProps({
  data: Object
})

const IntradayDasboardDialog = ref(false)
const IntradayTableDialog = ref(false)

const core = coreStore()
const module = moduleStore()

const desserts = computed(() => {
  return [
    {
      name: 'NS',
      dim: props.data.service_level?.scaled_general?.value,
      real: props.data.service_level?.real_general?.value,
      delta: props.data.service_level?.difference?.value
    },
    {
      name: 'Receb.',
      dim: props.data.volume?.scaled_call?.value,
      real: props.data.volume?.real_call_received?.value,
      delta: props.data.volume?.difference_call?.value
    },
    {
      name: 'TMA',
      dim: props.data.tma?.scaled?.value,
      real: props.data.tma?.real_general?.value,
      delta: props.data.tma?.difference?.value
    },
    {
      name: 'Log',
      dim: props.data.login?.scaled_agent?.value,
      real: props.data.login?.real_agent?.value,
      delta: props.data.login?.difference_agent?.value
    },
    {
      name: 'Pausa',
      dim: props.data.login?.scaled_break?.value,
      real: props.data.login?.real_break?.value,
      delta: props.data.login?.difference_break?.value
    }
  ]
})

const form = ref({
  dt_data: null,
  nu_setor: null
})

const dialogOpem = (dt_data, nu_setor, type) => {
  form.value.dt_data = moment(dt_data).format('YYYY-MM-DD')
  form.value.nu_setor = parseInt(nu_setor)

  IntradayDasboardDialog.value = false
  IntradayTableDialog.value = false

  if (type == 1) IntradayDasboardDialog.value = true
  if (type == 2) IntradayTableDialog.value = true
}
</script>
<template>
  <v-col cols="12" sm="6" md="4" lg="4" xl="3" class="pa-1">
    <v-card class="w-100" elevation="3">
      <v-card-text class="d-flex py-1 pt-1 px-2 text-subtitle-1 text-brand_txt text-left">
        <span class="text-truncate w-75">
          {{ data.nu_setor?.uf ? data.nu_setor?.uf + ' | ' : '' }}
          {{ data.sector_n1?.label ?? data?.nu_setor }}
        </span>

        <span title="IntraDay" class="text-truncate text-right w-25 cursor-pointer">
          <v-btn
            :loading="module.loading"
            icon="mdi-table"
            size="25"
            color="brand_txt"
            variant="plain"
            @click="dialogOpem(data.dt_data, data.nu_setor, 2)"
          ></v-btn>
          <v-btn
            :loading="module.loading"
            icon="mdi-fullscreen"
            size="25"
            color="brand_txt"
            variant="plain"
            @click="dialogOpem(data.dt_data, data.nu_setor, 1)"
          ></v-btn>
        </span>
      </v-card-text>

      <v-card-text class="pb-1 pt-2">
        <v-row>
          <v-col cols="7" class="pr-0 pt-0 pb-4">
            <v-table class="" density="compact">
              <thead>
                <tr style="height: 25px !important">
                  <th style="height: 25px !important" class="text-center text-caption pa-1"></th>
                  <th style="height: 25px !important" class="text-center text-caption pa-1">
                    Dim.
                  </th>
                  <th style="height: 25px !important" class="text-center text-caption pa-1">
                    Real
                  </th>
                  <th style="height: 25px !important" class="text-center text-caption pa-1">
                    Dif. %
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in desserts" :key="item.name">
                  <td style="height: 20px !important" class="text-left text-caption pa-0">
                    {{ item.name }}
                  </td>
                  <td style="height: 20px !important" class="text-center text-caption pa-0">
                    {{ item.dim }}
                  </td>
                  <td style="height: 20px !important" class="text-center text-caption pa-0">
                    {{ item.real }}
                  </td>
                  <td style="height: 20px !important" class="text-center text-caption pa-0">
                    {{ item.delta }}
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          <v-col cols="5" class="pb-0 pt-0 pr-0 pl-2">
            <v-card elevation="0">
              <v-card-subtitle class="py-0 text-caption d-flex justify-space-around align-center">
                <div class="d-flex align-center justify-center text-caption mark">
                  <v-icon icon="mdi-delta" size="15" />
                  Delta.
                </div>
              </v-card-subtitle>
              <v-card-text class="pa-0">
                <DeltaChartLine :data="data" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text class="d-flex py-0 px-3 pb-2 text-brand_txt">
        <span class="text-truncate text-caption" style="width: calc(100% - 75px)">
          {{ data.dt_data }}
        </span>

        <span title="Faixa" class="text-truncate text-right text-caption" style="width: 75px">
          <v-icon class="text-brand_txt">mdi-clock-start</v-icon>
          {{ data.no_intervalo }}
        </span>
      </v-card-text>
    </v-card>
  </v-col>

  <CoreDialog
    v-model="IntradayDasboardDialog"
    :loading="module.showing"
    header-icon="mdi-view-compact-outline"
    :header-title="'IntraDay: ' + data.sector_n1?.label ?? data?.nu_setor"
    body-class="overflow-x-hidden bg-dialog pa-0 "
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    dialog-fullscreen
  >
    <IntradayDasboard :date-ref="form.dt_data" :sector-n1="form.nu_setor" />
  </CoreDialog>
  <CoreDialog
    v-model="IntradayTableDialog"
    :loading="module.showing"
    header-icon="mdi-table"
    :header-title="'IntraDay: ' + data.sector_n1?.label ?? data?.nu_setor"
    body-class="overflow-x-hidden bg-dialog pa-0 "
    headerheight="35px"
    header-class="bg-brand_verde_dark"
    dialog-fullscreen
  >
    <IntradayTable :date-ref="form.dt_data" :sector-n1="form.nu_setor" />
  </CoreDialog>
</template>

<style scoped>
.mark {
  display: block;
  padding: 2px;
  width: 50px;
  height: 15px !important;
  font-size: 12px !important;
}
.mark_dim {
  border: 1px solid rgb(47, 172, 159);
  background-color: rgba(47, 172, 159, 0.2);
  display: block;
  padding: 2px;
  width: 50px;
  height: 13px !important;
  font-size: 9px !important;
}
.mark_real {
  border: 1px solid rgb(255, 0, 0);
  background-color: rgba(255, 0, 0, 0.2);
  display: block;
  padding: 2px;
  width: 30px;
  height: 13px !important;
  font-size: 9px !important;
}
</style>