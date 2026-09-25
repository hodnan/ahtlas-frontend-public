<script setup>
import { ref, onMounted, computed } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  item: Object
})

const disabled = computed(() => {
  const formValues = form.value
  const blockValues = module.data?.block

  if (!blockValues) {
    return true
  }

  const fieldsToCompare = ['name', 'order', 'default', 'owner_id', 'weight']

  for (const key of fieldsToCompare) {
    if (formValues[key] !== blockValues[key]) {
      return false
    }
  }

  return true
})

const form = ref({})

const loadData = async () => {
  try {
    await module.getShow(
      `api/administration/incentives/bonus/block/show/${props.item.public_id}`,
      ['block'],
      true
    )

    if (module?.data?.block) {
      form.value.fiscal_year_id = module.data?.block?.fiscal_year_id
      form.value.name = module.data?.block?.name
      form.value.owner_id = module.data?.block?.owner_id
      form.value.default = module.data?.block?.default
      form.value.weight = module.data?.block?.weight
      form.value.order = module.data?.block?.order
      form.value.grade = module.data?.block?.grade
    }
  } finally {
  }
}

onMounted(async () => {
  await loadData()
})

const submit = async () => {
  try {
    await module.setStore(
      `api/administration/incentives/bonus/block/update/${props.item.public_id}`,
      form.value
    )

    if (notify.success) {
      module.data.submit = true

      await loadData()
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
        <v-col class="pa-1" cols="4">
          <v-autocomplete
            v-model="form.fiscal_year_id"
            readonly
            density="compact"
            label="Ano Fiscal"
            color="primary"
            class="inputH40"
            :items="module.data.fiscalYears"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="public_id"
            hide-spin-buttons
            closable-chips
            menu-icon=""
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
          >
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-text-field
            v-model="form.weight"
            density="compact"
            label="Peso padrão"
            color="primary"
            :items="module.data.fiscalYears"
            hide-details=""
            variant="outlined"
            hide-spin-buttons
            closable-chips
            class="inputCenter"
            type="number"
            step="0.01"
          >
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-text-field
            v-model="form.order"
            density="compact"
            label="Ordem Padrão"
            color="primary"
            hide-details=""
            variant="outlined"
            hide-spin-buttons
            closable-chips
            class="inputCenter"
            type="number"
            step="0.01"
          >
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-text-field
            v-model="form.grade"
            density="compact"
            readonly
            label="Nota"
            color="primary"
            hide-details=""
            variant="outlined"
            hide-spin-buttons
            closable-chips
            class="inputCenter bg-disabled"
            type="number"
            step="0.01"
          >
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="3">
          <v-checkbox
            v-model="form.default"
            density="compact"
            hide-details=""
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
    <v-card-actions class="px-3 pt-0">
      <v-alert
        border="start"
        border-color="deep-purple accent-4 d-flex align-center"
        class="pl-3 pr-0 py-1"
        elevation="0"
      >
        <div class="py-0 d-flex align-start text-caption">
          <div class="text-start pl-1 pr-0" style="width: 75px">Criação</div>
          <div
            class="d-inline-block text-caption text-truncate text-start px-1"
            style="width: calc(100% - 175px)"
          >
            {{ module?.data?.block?.created_by?.username }} -
            {{ module?.data?.block?.created_by?.nickname }}
          </div>
          <div class="d-inline-block text-caption text-truncate text-end pr-1" style="width: 95px">
            {{ module?.data?.block?.created_at }}
          </div>
        </div>
        <div class="py-0 d-flex align-start text-caption">
          <div class="text-start pl-1 pr-0" style="width: 75px">Atualiação</div>
          <div
            class="d-inline-block text-caption text-truncate text-start px-1"
            style="width: calc(100% - 175px)"
          >
            {{ module?.data?.block?.updated_by?.username }} -
            {{ module?.data?.block?.updated_by?.nickname }}
          </div>
          <div class="d-inline-block text-caption text-truncate text-end pr-1" style="width: 95px">
            {{ module?.data?.block?.updated_at }}
          </div>
        </div>
      </v-alert>
    </v-card-actions>
    <v-card-actions class="px-3 pt-0">
      <v-spacer />
      <v-btn
        :disabled="disabled"
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
