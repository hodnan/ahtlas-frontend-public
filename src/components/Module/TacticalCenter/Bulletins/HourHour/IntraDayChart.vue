<script setup>
  import { ref } from 'vue'
  import { Bar } from 'vue-chartjs'
  import { Chart } from 'chart.js/auto'

  const props = defineProps({
    data: Object
  })

  const chartData = computed(() => {
    return {
      labels: props.data?.label?.value,
      datasets: [
        {
          type: 'line',
          label: 'SLA NS',
          data: props.data?.service_level_scaled?.value,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 1,
          spanGaps: true,
          yAxisID: 'y',
          barPercentage: 0.1
        },
        {
          type: 'line',
          label: 'NS',
          data: props.data?.service_level_real?.value,
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 1,
          yAxisID: 'y'
        },

        {
          type: 'bar',
          label: 'Atendidas',
          data: props.data?.call_answered_real?.value,
          borderColor: '#f5a9a9',
          backgroundColor: '#f5a9a9',
          borderWidth: 1,
          pointRadius: 1,
          yAxisID: 'yS',
          barPercentage: 0.7
        },

        {
          type: 'bar',
          label: 'Perdidas',
          data: props.data?.call_received_real?.value,
          borderColor: '#fc0303',
          backgroundColor: '#fc0303',
          borderWidth: 1,
          pointRadius: 1,
          yAxisID: 'yS',
          barPercentage: 0.7
        },

        {
          type: 'line',
          label: 'Dimensionado',
          data: props.data?.scaled_call?.value,
          fill: true,
          borderColor: 'rgba(54, 162, 235, 0.8)',
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderWidth: 1,
          pointRadius: 1,
          tension: 0.4,
          yAxisID: 'yS'
        }
      ]
    }
  })
  const chartOptions = ref({
    interaction: {
      mode: 'index'
    },
    responsive: true,
    scales: {
      x: {
        border: {
          display: false
        },
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 9
          },
          maxRotation: 90,
          minRotation: 90
        }
      },
      y: {
        border: {
          display: false
        },
        position: 'right',
        max: 110,
        ticks: { beginAtZero: true, display: false },
        grid: {
          display: false
        }
      },
      yS: {
        border: {
          display: false
        },
        ticks: { display: false },
        stacked: true,
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          fullSize: true,
          boxWidth: 7,
          boxHeight: 7,

          textAlign: 'center',
          font: {
            size: 9
          }
        }
      }
    }
  })
</script>

<template>
  <!-- <pre>
    {{ chartData }}

  </pre> -->
  <v-card class="w-100 h-100">
    <v-card-title class="text-center text-brand_txt">Intraday</v-card-title>
    <v-card-text style="height: calc(100% - 48px)" class="pb-1 px-1 pt-2">
      <Bar class="" style="height: 100%; width: 100%" :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>
