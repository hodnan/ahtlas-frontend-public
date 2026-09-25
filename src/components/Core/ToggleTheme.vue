<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}
</script>

<template>
  <v-btn @click="toggleTheme()" rounded="0" color="transparent" elevation="0">
    <v-icon size="x-large">mdi-circle-half-full</v-icon>
  </v-btn>
</template>