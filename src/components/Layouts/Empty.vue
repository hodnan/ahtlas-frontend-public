<template>
  <v-container fluid className="pa-0 overflow-auto container_main ">
    <slot />
  </v-container>
</template>

<style scoped>
.container_main {
  height: calc(100vh);
}
</style>