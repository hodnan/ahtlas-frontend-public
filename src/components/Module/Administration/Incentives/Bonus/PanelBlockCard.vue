<script setup>
import { ref } from 'vue'
import PanelBlockCardChart from '@/components/Module/Administration/Incentives/Bonus/PanelBlockCardChart.vue'

const props = defineProps({
  item: Object
})

const handleChart = () => {
  chart.value = !chart.value
}

const chart = ref(false)
</script>
<template>
  <div>
    <v-card
      border="opacity-100 "
      border-color="deep-purple accent-4"
      elevation="3"
      class="pa-0 border-s-lg mb-1 border-primary"
    >
      <v-card-text class="pa-1">
        <table width="100%" cellspacing="0">
          <tbody>
            <tr>
              <td colspan="2" class="px-0 text-left">
                <v-list-item
                  class="w-100 px-0 title"
                  :title="item.indicator?.name"
                  :prepend-icon="item.indicator?.direction?.icon"
                >
                  <template #append>
                    <v-icon icon="mdi-chart-bar" @click="handleChart" />
                  </template>
                </v-list-item>
              </td>

              <td
                width="20%"
                class="px-2 text-center border-b-sm"
                :class="`border-${item?.grade?.month_detour?.border}`"
              >
                Mensal
              </td>
              <td
                rowspan="3"
                width="32"
                :class="'bg-' + item?.grade?.month_detour?.color"
                class="text-center px-0 border-e-lg border-s-lg border-background2"
              >
                <v-icon :icon="item?.grade?.month_detour.icon" />
              </td>

              <td
                width="20%"
                class="px-2 text-center border-b-sm"
                :class="`border-${item?.grade?.accumulated_detour?.border}`"
              >
                Acumulado
              </td>
              <td
                rowspan="3"
                width="10px"
                :class="`bg-${item?.grade?.accumulated_detour?.color} `"
                class="text-center px-0 border-e-lg border-s-lg border-background2"
              >
                <v-icon :icon="item?.grade?.accumulated_detour.icon" />
              </td>
            </tr>
            <tr>
              <td class="text-left px-0 pl-2">
                Nota: {{ item?.grade?.grade }} | Peso: {{ item.weight }}
              </td>
              <td class="text-left px-3" width="70px">Planejado</td>

              <td class="text-center px-2">{{ item?.grade?.month_target }}</td>

              <td class="text-center px-2">{{ item?.grade?.accumulated_target }}</td>
            </tr>
            <tr>
              <td class="text-left px-0 pl-2">Nota x Peso: {{ item.grade?.grade_weight }}</td>
              <td class="text-left px-3">Realizado</td>
              <td class="text-center px-2">{{ item?.grade?.month_result }}</td>

              <td class="text-center px-2">{{ item?.grade?.accumulated_result }}</td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
      <v-card-text v-show="chart" class="pa-1">
        <v-row>
          <v-col cols="6">
            <PanelBlockCardChart
              title="Mensal"
              :label="item?.chart?.label"
              :line="item?.chart?.month_target"
              :bar="item?.chart?.month_result"
              :barRGB="item?.chart?.month_rgb"
            />
          </v-col>
          <v-col cols="6">
            <PanelBlockCardChart
              :title="`Acumulado - ${item.accumulation_type.name}`"
              :label="item?.chart?.label"
              :line="item?.chart?.accumulated_target"
              :bar="item?.chart?.accumulated_result"
              :barRGB="item?.chart?.accumulated_rgb"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <!-- <pre>{{ item }}</pre> -->
    </v-card>
  </div>
</template>
<style scoped>
.title :deep(.v-list-item__prepend) {
  width: 25px;
}
.title :deep(.v-list-item__append) {
  width: 25px;
}

.chart-container {
  height: 100px; /* Achatado */
  width: 100%; /* Comprido */
}
</style>
