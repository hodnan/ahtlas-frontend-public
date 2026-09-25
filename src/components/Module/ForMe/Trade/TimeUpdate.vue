<script setup>
import { coreStore, moduleStore, notifyStore } from '@/store'
const core = coreStore()
const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const props = defineProps({
  data: Object
})

const status = ref([
  { id: 0, name: 'Desativado' },
  { id: 1, name: 'Ativo' }
])

const form = ref({
  id: props.data.id,
  status: props.data.status,
  notes: props.data.notes
})

const submit = async () => {
  await module.setStore('/api/for-me/trade/time/update', form.value)
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
        <v-col class="pa-1 pb-2" cols="12" md="6">
          <v-text-field
            v-model="data.time_label"
            color="primary"
            density="compact"
            class="bg-disabled"
            label="Intervalo desejado"
            variant="outlined"
            hide-details=""
            item-title="label"
            readonly=""
          />
        </v-col>
        <v-col class="pa-1" cols="12" md="6">
          <v-autocomplete
            v-model="form.status"
            color="primary"
            density="compact"
            label="Status"
            variant="outlined"
            hide-details=""
            :error-messages="notify?.errors?.status"
            :items="module.data.statuses"
            item-title="title"
            item-value="id"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props" :disabled="item.raw.disabled" />
            </template>
          </v-autocomplete>
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
        class="bg-brand_azul1"
        color="white"
        append-icon="mdi-content-save"
        type="submit"
      >
        Gravar
      </v-btn>
    </v-card-actions>
  </form>
</template>

