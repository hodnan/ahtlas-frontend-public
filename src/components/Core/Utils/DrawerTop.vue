<script setup>
  import { watch } from 'vue'
  import { coreStore } from '@/store'

  const core = coreStore()

  const props = defineProps({
    headerClass: { type: String, default: '' },
    bodyClass: { type: String, default: '' },
    headerheight: { type: String, default: '35px' },
    headerIcon: { type: String, default: null },
    headerTitle: { type: String, default: null },
    maxWidth: { type: String, default: null },
    minWidth: { type: String, default: null },
    maxHeight: { type: String, default: null },
    minHeight: { type: String, default: null },
    cardClass: { type: String, default: null },

    persistent: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update:modelValue'])

  function focusParentElement() {
    // Espera o fechamento do diálogo antes de tentar o foco
    setTimeout(() => {
      const parentElement = document.querySelector('.core-dialog-focus')
      if (parentElement) {
        parentElement.focus()
      } else {
      }
    }, 300)
  }
  watch(
    () => core.drawerTop,
    (newValue, oldValue) => {
      if (!newValue) {
        focusParentElement()
      }
    }
  )
</script>
<template>
  <v-navigation-drawer
    v-model="core.drawerTop"
    width="197"
    elevation="0"
    color="transparent"
    floating
    scrim=""
    :border="0"
    location="top"
    hide-overlay
    temporary
    class="pb-0"
  >
    <v-card
      class="rounded-0 rounded-b-lg pa-1"
      style="max-height: calc(100% - 5px); width: calc(100% - 16px); margin: 0 auto"
      elevation="3"
    >
      <v-card-title class="pa-1" @click.stop="core.drawerTopClose()">
        <v-icon icon="mdi-chevron-up" />
        Filtros
      </v-card-title>
      <v-card-text class="pa-1 overflow-auto" style="max-height: calc(100% - 40px)">
        <slot></slot>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>
