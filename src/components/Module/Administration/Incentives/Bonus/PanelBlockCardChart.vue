<script setup>
import { ref } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart } from 'chart.js/auto'

const props = defineProps({
  title: String,
  label: Object,
  line: Object,
  bar: Object,
  barRGB: Object
})

const chartData = computed(() => {
  return {
    labels: props.label,
    datasets: [
      {
        type: 'line',
        label: 'Planejado',
        data: props?.line,
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 1,
        spanGaps: true,
        yAxisID: 'y',
        barPercentage: 0.1
      },
      {
        type: 'bar',
        label: 'Realizado',
        data: props?.bar,
        borderColor: props?.barRGB,
        backgroundColor: props?.barRGB,
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
        font: { size: 12 },

        maxRotation: 90,
        minRotation: 90
      }
    },
    y: {
      border: { display: false },
      position: 'right',

      ticks: { beginAtZero: true, display: false },
      grid: { display: false }
    }
  },
  plugins: {
    title: {
      display: true,
      text: props.title
    },
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
