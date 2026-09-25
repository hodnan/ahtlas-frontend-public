<script setup>
import { ref } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const props = defineProps({
  data: Object
})

const form = ref({
  id: props.data.id,
  name: props.data.name,
  active: props.data.active?.id,
  direction: props.data.direction?.id,
  is_percent: props.data.is_percent?.value,
  symbol: props.data.symbol?.id,
  calc: props.data.calc?.id,
  kpi: props.data.kpi,
  rv: props.data.rv,
  bonus: props.data.bonus,
  notes: props.data.notes
})

const submit = async () => {
  try {
    await module.setStore('api/administration/intelligence/indicators/update', form.value)

    if (notify.success) {
      closeDialog()
      await module.getDataPart('api/administration/intelligence/indicators', ['indicators'])
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="12">
          <v-text-field
            v-model="form.name"
            color="primary"
            density="compact"
            label="Indicador"
            variant="outlined"
            hide-details=""
            placeholder=""
            :error-messages="notify?.errors?.name"
          />
        </v-col>

        <v-col class="pa-1" cols="3">
          <v-autocomplete
            v-model="form.direction"
            color="primary"
            density="compact"
            label="Direção"
            variant="outlined"
            hide-details=""
            menu-icon=""
            :items="module.data.directions"
            item-title="name"
            item-value="id"
            :error-messages="notify?.errors?.direction"
          />
        </v-col>

        <v-col class="pa-1" cols="3">
          <v-autocomplete
            v-model="form.calc"
            color="primary"
            density="compact"
            variant="outlined"
            hide-details=""
            menu-icon=""
            label="Cálculo"
            :items="module.data.calcs"
            item-title="name"
            item-value="id"
            :error-messages="notify?.errors?.calc"
          />
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-autocomplete
            v-model="form.symbol"
            color="primary"
            density="compact"
            variant="outlined"
            hide-details=""
            menu-icon=""
            label="Simbolo"
            :items="module.data.symbols"
            item-title="name"
            item-value="id"
            :error-messages="notify?.errors?.symbol"
          />
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-autocomplete
            v-model="form.active"
            color="primary"
            density="compact"
            label="Status"
            hide-details=""
            menu-icon=""
            variant="outlined"
            item-title="name"
            item-value="id"
            :items="module.data.statuses"
            :error-messages="notify?.errors?.active"
          />
        </v-col>
        <v-col class="pa-1" cols="4">
          <v-checkbox
            v-model="form.is_percent"
            label="É percentual?"
            density="compact"
            hide-details=""
            :error-messages="notify?.errors?.is_percent"
          ></v-checkbox>
        </v-col>

        <v-col class="pa-1" cols="2">
          <v-checkbox
            v-model="form.kpi"
            label="KPI"
            density="compact"
            hide-details=""
            :error-messages="notify?.errors?.is_percent"
          ></v-checkbox>
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-checkbox
            v-model="form.rv"
            label="RV"
            density="compact"
            hide-details=""
            :error-messages="notify?.errors?.is_percent"
          ></v-checkbox>
        </v-col>
        <v-col class="pa-1" cols="4">
          <v-checkbox
            v-model="form.bonus"
            label="Bônus"
            density="compact"
            hide-details=""
            :error-messages="notify?.errors?.is_percent"
          ></v-checkbox>
        </v-col>

        <v-col class="pa-1" cols="12" md="12">
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
        <v-col class="pa-1" cols="12" md="12">
          <v-alert border="start" border-color="deep-purple accent-4" elevation="2">
            Criação: {{ props.data.created_by }} - {{ props.data.created_at }} <br />
            Atualização: {{ props.data.updated_by }} - {{ props.data.updated_at }} <br />
          </v-alert>
        </v-col>
      </v-row>
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
