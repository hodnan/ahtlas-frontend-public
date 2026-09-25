<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  data: Object
})

const maxData = computed(() => {
  const maxBypass = Math.max(...Object.values(props.data?.bypass))
  const maxRes = Math.max(...Object.values(props.data?.result))

  const maxResult = Math.max(...[maxBypass, maxRes]) * 1.4
  return maxResult
})

const chartData = computed(() => {
  return {
    labels: props.data?.date_ref,
    datasets: [
      {
        type: 'line',
        label: 'Meta',
        data: props.data?.goal,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 1,
        spanGaps: true,
        yAxisID: 'y',
        barPercentage: 0.1
      },
      // {
      //   type: 'line',
      //   label: 'Tolerado',
      //   data: props.data?.bypass,
      //   fill: false,
      //   borderColor: 'rgb(54, 162, 235)',
      //   backgroundColor: 'transparent',
      //   borderWidth: 1,
      //   pointRadius: 1,
      //   yAxisID: 'y'
      // },
      {
        type: 'bar',
        label: 'Resultado',
        data: props.data?.result,
        borderColor: props.data?.border,
        backgroundColor: props.data?.color,
        borderWidth: 1,
        pointRadius: 1,
        yAxisID: 'y',
        barPercentage: 0.7
      }
    ]
  }
})

const chartOptions = ref({
  interaction: {
    mode: 'index'
  },
  responsive: true,
  maintainAspectRatio: false, // Não manter proporção automática
  scales: {
    x: {
      border: { display: false },
      stacked: true,
      grid: { display: false },
      ticks: {
        font: { size: 10 },

        maxRotation: 90,
        minRotation: 90
      }
    },
    y: {
      border: { display: false },
      position: 'right',
      max: maxData,
      ticks: { beginAtZero: true, display: false },
      grid: { display: false }
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      display: false,
      labels: {
        fullSize: true,
        boxWidth: 7,
        boxHeight: 7,
        textAlign: 'start',
        font: { size: 11 }
      }
    }
  }
})
</script>

<template>
  <div class="chart-container">
    <Bar class="chart" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  height: 100px; /* Achatado */
  width: 100%; /* Comprido */
}
</style>
