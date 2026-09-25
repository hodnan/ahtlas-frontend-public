<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { coreStore, notifyStore } from '@/store'
const core = coreStore()
const notify = notifyStore()

let intervalId = null

const fetchData = () => {
  if (notify.isFetching) return
  notify.getMessages()
}

const startFetching = () => {
  // Se já houver um intervalo ativo, não inicia outro
  if (!intervalId) {
    intervalId = setInterval(fetchData, 1 * 1000) // Chama a cada x segundos
  }
}

const stopFetching = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null // Limpa o ID do intervalo
  }
}

// onMounted(() => {
//   startFetching()
// })

// onBeforeUnmount(() => {
//   stopFetching()
// })
</script>

<template>
  <v-btn class="button" @click="core.notifyToggle()" rounded="0" color="transparent" elevation="0">
    <v-icon color="brand_silver" size="x-large" icon="mdi-bell-outline" />
  </v-btn>
</template>
<style scoped>
.button {
  position: absolute;
  display: block;
  top: 25px;
  right: -25px;

  z-index: 9999;
  transform: translate3d(-50%, -50%, 0) rotate(0deg);
}
</style>
