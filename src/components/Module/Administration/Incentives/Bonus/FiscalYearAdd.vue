<script setup>
import { ref } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const form = ref({
  month_start: null,
  month_end: null,
  active: null
})

const submit = async () => {
  try {
    await module.setStore('api/administration/incentives/bonus/fiscalyear/store', form.value)
    if (notify.success) {
      module.data.submit = true
      emit('update:modelValue', false)
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
        <v-col class="pa-1" cols="6">
          <v-text-field
            v-model="form.month_start"
            density="compact"
            color="primary"
            label="Início"
            hide-details=""
            type="month"
            variant="outlined"
            :error-messages="notify?.errors?.month_start"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="6">
          <v-text-field
            v-model="form.month_end"
            density="compact"
            color="primary"
            label="Fim"
            hide-details=""
            type="month"
            variant="outlined"
            :error-messages="notify?.errors?.month_end"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="12">
          <v-autocomplete
            v-model="form.active"
            :items="module.data?.year_statuses"
            color="primary"
            density="compact"
            label="Status"
            variant="outlined"
            hide-details=""
            menu-icon=""
            clearable
            item-title="name"
            item-value="id"
            :error-messages="notify?.errors?.active"
          />
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
