<script setup>
import { nextTick } from 'vue'
import { coreStore, notifyStore } from '@/store'

const core = coreStore()
const notify = notifyStore()

const props = defineProps({
  value: { type: Boolean, default: false },
  dialogFullscreen: { type: Boolean, default: false },
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
  loading: { type: Boolean, default: false },
  persistent: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
  notify.setErrors([])
  focusParentElement()
}

function focusParentElement() {
  // Espera o fechamento do diálogo antes de tentar o foco
  setTimeout(() => {
    const parentElement = document.querySelector('.core-dialog-focus')
    if (parentElement) {
      parentElement.focus()
    } else {
    }
  }, 300) // Aguarda 1 segundo para garantir o fechamento do diálogo
}
</script>

<template>
  <v-dialog
    :value="value"
    :fullscreen="dialogFullscreen"
    :max-width="maxWidth"
    :min-width="minWidth"
    :min-height="minHeight"
    persistent
    @keydown.esc="close"
    class="v-dialog"
  >
    <v-card :class="cardClass">
      <v-card-title class="text-subtitle-1 py-1" :class="headerClass">
        <v-card
          class="d-flex justify-space-between pa-0 align-self-center"
          width="100%"
          :height="headerheight"
          color="transparent"
          flat
          tile
        >
          <span class="pl-0 text-truncate align-self-center">
            <v-icon v-if="!core.loading" :icon="headerIcon" />
            <v-progress-circular v-else size="25" indeterminate />
          </span>

          <span class="pl-4 text-truncate align-self-center">
            {{ headerTitle }}
          </span>
          <v-spacer />

          <v-btn
            class="align-self-center"
            color="transparent"
            elevation="0"
            rounded="0"
            icon
            @click="close()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card>
      </v-card-title>

      <v-card-text v-if="loading || core.loading" class="d-flex justify-center align-center h-100">
        <v-progress-circular
          :size="115"
          :width="4"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-card-text>

      <v-card-text
        v-show="!loading && !core.loading"
        :class="bodyClass"
        :style="'max-height: ' + maxHeight"
      >
        <div tabindex="-1" class="core-dialog-focus" style="height: 100%">
          <slot />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-overlay__scrim) {
  opacity: 0.07 !important;
}
.core-dialog-focus:focus {
  outline: none;
}
</style>
