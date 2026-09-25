<script setup>
import { Bar } from "vue-chartjs";
import { Chart } from "chart.js/auto";

const props = defineProps({
  data: Object,
});

const getColor = (value, direction, opacity) => {
  value = direction ? value * -1 : value;

  const color =
    value >= 0
      ? `rgba(255, 102, 0, ${opacity})`
      : `rgba(47, 172, 159, ${opacity})`;

  return color;
};

const chartData = computed(() => {
  return {
  labels: ["NS", "Rec.",  "TMA",  "Log",  "Pausa"],
  datasets: [
    {
      label: "",
      type: "bar",
      data: [
        props.data.service_level.difference?.value,
        props.data.volume?.difference_call?.value, 
        props.data.tma?.difference?.value,
        props.data.login?.difference_agent?.value,
        props.data.login?.difference_break?.value,

      ],
      borderColor: [
        getColor(props.data.service_level.difference?.value,true, 1),
        getColor(props.data.volume?.difference_call?.value, false, 1),
        getColor(props.data.tma?.difference?.value,false, 1),
        getColor(props.data.login?.difference_agent?.value,true, 1),
        getColor(props.data.login?.difference_break?.value,false, 1),
      ],

      backgroundColor: [
        getColor(props.data.service_level.difference?.value,true, 0.2),
        getColor(props.data.volume?.difference_call?.value, false, 0.2),
        getColor(props.data.tma?.difference?.value,false, 0.2),
        getColor(props.data.login?.difference_agent?.value,true, 0.2),
        getColor(props.data.login?.difference_break?.value,false, 0.2),
      ],
      borderWidth: 1,
      pointRadius: 1,
    },
  ],
}
})

// const chartData = ref();

const chartOptions = ref({
  interaction: {
    mode: "index",
  },
  responsive: true,
  scales: {
    x: {
      border: {
        display: false,
      },

      grid: {
        display: false,
      },
      ticks: {
        display: true,
        font: {
          size: 9,
        },
      },
    },
    y: {
      border: {
        display: false,
      },
      position: "right",
      ticks: { display: false },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "top",
      labels: {
        fullSize: true,
        boxWidth: 7,
        boxHeight: 7,

        textAlign: "center",
        font: {
          size: 109,
        },
      },
    },
  },
});
</script>
<template>
  <Bar
    class="w-100"
    style="height: 125px; width: 100%"
    :data="chartData"
    :options="chartOptions"
  />
</template>