<script setup>
import { ref, computed } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const props = defineProps({
  stage: Object,
  modelValue: Boolean,
  onUpdateModelValue: Function // Correção na declaração
})

const form = ref({
  id: props.stage.id,
  status: props.stage.status?.id,
  sector_n1: props?.stage?.sector_n1?.label,
  indicator: props?.stage?.indicator?.label,
  stage: props?.stage?.stage,
  date_ref: props?.stage?.date_ref,
  created_at: props?.stage?.created_at,
  updated_at: props?.stage?.updated_at
})

const statuses = computed(() => {
  return module.data.statuses.filter((item) => {
    if (!item?.disabled) {
      return item
    }
  })
})

const submit = async () => {
  try {
    await module.setStore(
      `api/management/control-center/stages/update/${form.value.id}`,
      form.value
    )
    if (notify.success) {
      closeDialog()
      await module.getDataPart('api/management/control-center/stages', ['stages'])
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="12">
          <v-text-field
            v-model="form.sector_n1"
            class="bg-disabled"
            readonly
            color="primary"
            density="compact"
            label="Setor"
            variant="outlined"
            hide-details=""
          />
        </v-col>
        <v-col class="pa-1" cols="8">
          <v-text-field
            v-model="form.indicator"
            class="bg-disabled"
            readonly
            color="primary"
            density="compact"
            label="Indicador"
            variant="outlined"
            hide-details=""
          />
        </v-col>
        <v-col class="pa-1" cols="4">
          <v-btn :color="form.stage.color" class="w-100">Stage: {{ form.stage.id }}</v-btn>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-text-field
            v-model="form.date_ref"
            class="bg-disabled"
            readonly
            type="date"
            color="primary"
            density="compact"
            label="Dt. Res."
            variant="outlined"
            hide-details=""
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-text-field
            v-model="form.created_at"
            class="bg-disabled"
            readonly
            type="date"
            color="primary"
            density="compact"
            label="Dt. Criação"
            variant="outlined"
            hide-details=""
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-text-field
            v-model="form.updated_at"
            class="bg-disabled"
            readonly
            type="date"
            color="primary"
            density="compact"
            label="Dt. Envio"
            variant="outlined"
            hide-details=""
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-autocomplete
            v-model="form.status"
            :items="statuses"
            color="primary"
            density="compact"
            label="Status"
            variant="outlined"
            hide-details=""
            menu-icon=""
            item-title="label"
            item-value="id"
            :error-messages="notify?.errors?.status"
          />
        </v-col>
        <v-col class="pa-1" cols="12">
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
      {{ props.status }}
    </v-card-text>
    <v-card-actions class="px-4 pt-1 pb-0">
      <v-spacer></v-spacer>
      <v-btn
        :loading="module.storing || module.showing"
        color="brand_verde_dark"
        class=""
        variant="flat"
        append-icon="mdi-content-save"
        type="submit"
      >
        Gravar
      </v-btn>
    </v-card-actions>
  </form>
</template>
