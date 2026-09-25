<script setup>
import { coreStore, moduleStore, notifyStore } from '@/store'
import debounce from 'lodash.debounce'
const core = coreStore()
const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const status = ref([
  { id: 0, name: 'Desativado' },
  { id: 1, name: 'Ativo' }
])

const form = ref({
  time: null,
  notes: null
})

const submit = async () => {
  await module.setStore('/api/for-me/trade/time/store', form.value)
  if (notify.success) {
    closeDialog()
    await module.getDataPart('/api/for-me/trade/time', ['trades'])
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col class="pa-1 pb-2" cols="12" md="12">
          <v-autocomplete
            v-model="form.time"
            color="primary"
            density="compact"
            label="Intervalo desejado"
            variant="outlined"
            hide-details=""
            item-title="label"
            clearable
            return-object
            :items="module.data.times"
            :error-messages="notify?.errors?.['time.label']"
          ></v-autocomplete>
        </v-col>
      </v-row>

      <v-col cols="12" md="12">
        <v-row>
          <v-col class="pa-1">
            <v-textarea
              v-model="form.notes"
              label="Observações"
              color="primary"
              density="compact"
              variant="outlined"
              hide-details=""
              rows="3"
              :error-messages="notify?.errors?.notes"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-card-text>
    <v-card-actions class="px-4">
      <v-spacer></v-spacer>
      <v-btn
        :loading="module.storing"
        class="bg-brand_verde_dark"
        color="white"
        append-icon="mdi-content-save"
        type="submit"
      >
        Gravar
      </v-btn>
    </v-card-actions>
  </form>
</template>

