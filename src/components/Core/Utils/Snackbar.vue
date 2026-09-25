<script setup>
  import { ref, watch } from 'vue'
  import { notifyStore } from '@/store'
  import router from '@/router/index'

  const notify = notifyStore()
  const dialog = ref(false)
  const dialogSuccess = ref(false)

  watch(
    () => notify.errors,
    (newFilter) => {
      if (newFilter) {
        const hasUnauthorized = Object.values(newFilter).some(
          (item) => item.message === 'Acesso não autorizado'
        )

        dialog.value = Object.keys(newFilter).length > 0 && !hasUnauthorized ? true : false
      }
    },
    { deep: true }
  )
  watch(
    () => notify.success,
    (newFilter) => {
      if (newFilter) {
        dialogSuccess.value = true
      }
    }
  )
</script>
<template>
  <v-snackbar v-model="dialogSuccess" color="green-lighten-1" class="pa-0">
    <div class="d-inline-flex w-100">
      <span class="text-subtitle-1 pb-2">
        <v-icon icon="mdi-check-circle" size="large" />
        Sucesso
      </span>
      <v-spacer />

      <v-btn
        icon="mdi-close"
        rounded="0"
        elevation="0"
        color="transparent"
        density="compact"
        @click="dialogSuccess = false"
      />
    </div>
    <span style="white-space: pre-line">
      <!-- {{ notify.messages }} -->
      {{ notify.success }}
    </span>
  </v-snackbar>
  <v-snackbar v-model="dialog" color="background">
    <div class="d-inline-flex w-100">
      <span class="text-subtitle-1 pb-2">
        <v-icon icon="mdi-alert-rhombus-outline" size="x-large" class="text-amber" />
        Atenção
      </span>
      <v-spacer />

      <v-btn
        icon="mdi-close"
        rounded="0"
        elevation="0"
        color="transparent"
        density="compact"
        @click="dialog = false"
      />
    </div>
    <v-list lines="one" class="bg-transparent pa-1">
      <div v-for="item in notify.errors" :key="item">
        <div v-for="subitem in item" :key="subitem">
          <v-list-item v-show="subitem" density="compact" :subtitle="subitem" />
        </div>
      </div>
    </v-list>
  </v-snackbar>
</template>
