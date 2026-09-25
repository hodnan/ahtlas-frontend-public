<script setup>
import { ref } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const form = ref({
  fiscal_year_id: module?.data?.activefiscalYear ?? null,
  name: null,
  owner_id: null,
  default: null,
  weight: null
})

const submit = async () => {
  try {
    await module.setStore('api/administration/incentives/bonus/block/store', form.value)

    if (notify.success) {
      emit('update:modelValue', false)
      module.data.submit = true
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div>
    <v-form @submit.prevent="submit">
      <v-card-text class="pa-0">
        <v-row class="ma-0">
          <v-col class="pa-1" cols="4">
            <v-autocomplete
              v-model="form.fiscal_year_id"
              readonly
              density="compact"
              label="Ano Fiscal"
              color="primary"
              class="inputH40 bg-disabled"
              :items="module.data.fiscalYears"
              hide-details=""
              variant="outlined"
              item-title="label"
              item-value="public_id"
              menu-icon=""
              hide-spin-buttons
              :error-messages="notify?.errors?.fiscal_year_id"
            >
            </v-autocomplete>
          </v-col>
          <v-col class="pa-1" cols="8">
            <v-text-field
              v-model="form.name"
              density="compact"
              label="Nome do Bloco"
              color="primary"
              hide-details=""
              variant="outlined"
              hide-spin-buttons
              closable-chips
              menu-icon=""
              :error-messages="notify?.errors?.name"
            >
            </v-text-field>
          </v-col>
          <v-col class="pa-1" cols="4">
            <v-text-field
              v-model="form.weight"
              density="compact"
              label="Peso padrão"
              color="primary"
              :items="module.data.fiscalYears"
              hide-details=""
              variant="outlined"
              hide-spin-buttons
              type="number"
              step="0.01"
              :error-messages="notify?.errors?.weight"
            >
            </v-text-field>
          </v-col>
          <v-col class="pa-1" cols="4">
            <v-text-field
              v-model="form.order"
              density="compact"
              label="Ordem Padrão"
              color="primary"
              hide-details=""
              variant="outlined"
              hide-spin-buttons
              closable-chips
              type="number"
              step="0.01"
              :error-messages="notify?.errors?.order"
            >
            </v-text-field>
          </v-col>
          <v-col class="pa-1" cols="4">
            <v-checkbox
              v-model="form.default"
              density="compact"
              hide-details=""
              value="1"
              label="é padrão?"
            ></v-checkbox>
          </v-col>
          <v-col class="pa-1" cols="12">
            <v-autocomplete
              v-model="form.owner_id"
              density="compact"
              label="Responsável"
              color="primary"
              class="inputH40"
              :items="module.data.owners"
              hide-details=""
              variant="outlined"
              item-title="label"
              item-value="username"
              hide-spin-buttons
              closable-chips
              menu-icon=""
              :error-messages="notify?.errors?.owner_id"
            >
              <template #chip="{ props, item, index }">
                <v-chip
                  v-bind="props"
                  class="rounded-0"
                  variant="text"
                  :key="index"
                  :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                >
                  {{ item.raw.nickname }}
                </v-chip>
              </template>

              <template #item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :subtitle="item.raw.position_summary + ' | ' + item.raw.username"
                  :title="item.raw.nickname"
                >
                  <template v-slot:prepend>
                    <v-avatar>
                      <img :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar" width="40" />
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
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
    </v-form>
  </div>
</template>
