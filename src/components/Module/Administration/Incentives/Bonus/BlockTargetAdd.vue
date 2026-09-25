<script setup>
import { ref } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  public_id: String
})

const form = ref({
  fiscal_year_id: module?.data?.activefiscalYear ?? null,
  block_id: props.public_id,
  owner_id: null,
  leader_id: null,
  area: null,
  accumulation_type: null,
  target: null,
  weight: null,
  range: [
    { id: 2, gr: module.data.blockRanges[2]?.gr, grade: module.data.blockRanges[2]?.grade },
    { id: 3, gr: module.data.blockRanges[3]?.gr, grade: module.data.blockRanges[3]?.grade },
    { id: 4, gr: module.data.blockRanges[4]?.gr, grade: module.data.blockRanges[4]?.grade }
  ]
})

const submit = async () => {
  try {
    await module.setStore('api/administration/incentives/bonus/block/item/store', form.value)

    if (notify.success) {
      emit('update:modelValue', false)
      module.getShow(
        `api/administration/incentives/bonus/block/show/${props.public_id}`,
        ['block'],
        true
      )
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
        <v-col cols="6" class="pa-1">
          <v-card elevation="3">
            <v-card-text class="pa-2">
              <v-row class="ma-0">
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
                            <img
                              :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                              width="40"
                            />
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col class="pa-1" cols="12">
                  <v-autocomplete
                    v-model="form.leader_id"
                    density="compact"
                    label="Líder"
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
                    :error-messages="notify?.errors?.leader_id"
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
                            <img
                              :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                              width="40"
                            />
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col class="pa-1" cols="12">
                  <v-autocomplete
                    v-model="form.area"
                    :items="module.data?.areas"
                    color="primary"
                    density="compact"
                    label="Área"
                    variant="outlined"
                    hide-details=""
                    menu-icon=""
                    clearable
                    item-title="name"
                    item-value="name"
                    :error-messages="notify?.errors?.area"
                  />
                </v-col>

                <v-col class="pa-1" cols="12" md="12">
                  <v-textarea
                    v-model="form.proof"
                    label="Comprovação"
                    color="primary"
                    density="compact"
                    variant="outlined"
                    hide-details=""
                    rows="5"
                    :error-messages="notify?.errors?.proof"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" class="pa-1">
          <v-card elevation="3">
            <v-card-text class="pa-2">
              <v-row class="ma-0">
                <v-col class="pa-1" cols="12">
                  <v-autocomplete
                    v-model="form.indicator_id"
                    :items="module.data?.indicators"
                    color="primary"
                    density="compact"
                    label="Indicador"
                    variant="outlined"
                    hide-details=""
                    menu-icon=""
                    clearable
                    item-title="label"
                    item-value="id"
                    :error-messages="notify?.errors?.indicator_id"
                  />
                </v-col>
                <v-col class="pa-1" cols="8">
                  <v-autocomplete
                    v-model="form.accumulation_type"
                    :items="module.data?.accumulationTypes"
                    color="primary"
                    density="compact"
                    label="Tipo de acumulado"
                    variant="outlined"
                    hide-details=""
                    menu-icon=""
                    clearable
                    item-title="name"
                    item-value="id"
                    :error-messages="notify?.errors?.accumulation_type"
                  />
                </v-col>

                <v-col class="pa-1" cols="4">
                  <v-text-field
                    v-model="form.weight"
                    density="compact"
                    label="Peso"
                    color="primary"
                    hide-details=""
                    variant="outlined"
                    hide-spin-buttons
                    closable-chips
                    menu-icon=""
                    type="number"
                    step="0.01"
                    min="-Infinity"
                    :error-messages="notify?.errors?.weight"
                  />
                </v-col>
                <v-col class="py-1 px-1" cols="12">
                  <table width="100%" density="compact">
                    <thead>
                      <tr>
                        <th width="35%">Nota</th>
                        <th>
                          <v-tooltip>
                            <template v-slot:activator="{ props }">
                              <span v-bind="props">GR (Grau de realização)</span>
                            </template>
                            <span>
                              GR = % de atingimento da meta<br />
                              P = Planejado <br />
                              R = Realizado <br />
                              Para calcular o atingimento da meta:<br />
                              MAIOR MELHOR<br />
                              (R/P)*100 <br />
                              - MENOR MELHOR<br />
                              ((P-R) / P) * 100 + 100
                            </span>
                          </v-tooltip>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="d-flex justify-start align-center text-left pt-1">
                          <v-btn
                            :icon="module.data.blockRanges[1]?.icon"
                            :color="module.data.blockRanges[1]?.color"
                            density="compact"
                            class="rounded-0"
                          />
                        </td>
                        <td class="text-center">Nota abaixo de 0,00</td>
                      </tr>
                      <tr v-for="(item, n) in form.range" :key="item.id">
                        <td class="d-flex justify-start align-center text-left pt-1">
                          <v-btn
                            :icon="module.data.blockRanges[item.id]?.icon"
                            :color="module.data.blockRanges[item.id]?.color"
                            density="compact"
                            class="rounded-0"
                          />
                          <div
                            class="d-inline-block d-flex justify-center"
                            style="width: calc(100% - 45px)"
                          >
                            <span>
                              {{ module.data.blockRanges[item.id]?.grade }}
                            </span>
                          </div>
                        </td>
                        <td class="text-center">
                          <input
                            v-model="item.gr"
                            :readonly="module.data.blockRanges[item.id]?.readonly"
                            type="number"
                            step="0.01"
                            min="-Infinity"
                            :class="
                              notify?.errors?.['range.' + n + '.gr']
                                ? 'input-error'
                                : '' || module.data.blockRanges[item.id]?.readonly
                                  ? 'bg-disabled'
                                  : ''
                            "
                            class="border-sm text-center text-caption rounded basicInput"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-col>
              </v-row>
            </v-card-text>
            <!-- <pre>
              {{ form }}
            </pre> -->
          </v-card>
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
<style scoped>
.basicInput {
  width: 100%;
  height: 25px;
  outline: none;
}
.basicInput:focus {
  width: 100%;
  height: 25px;
  outline: none;
  border-width: 2px !important;
}

.input-error {
  border-color: red !important;
}
</style>
