<script setup>
import { onMounted, onBeforeMount } from 'vue'
import { authStore } from '@/store'

const auth = authStore()

onMounted(async () => {
  await auth.guest()
})
</script>

<template>
  <v-app id="inspire">
    <v-main class="">
      <slot />
    </v-main>
  </v-app>
</template>
