<script setup>
import { ref, onMounted } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  id: Number,
  block_id: String
})

const form = ref({})
const dataItem = ref({})

onMounted(async () => {
  try {
    await loadData()
  } finally {
  }
})

const loadData = async () => {
  await module.getShow(
    `api/administration/incentives/bonus/block/item/show/${props.id}`,
    ['bonusBlockItem'],
    true
  )
  if (module?.data?.bonusBlockItem) {
    form.value.fiscal_year_id = module.data.bonusBlockItem.fiscal_year_id
    form.value.block_id = module.data.bonusBlockItem.block_id
    form.value.owner_id = module.data?.bonusBlockItem?.owner_id
    form.value.leader_id = module.data?.bonusBlockItem?.leader_id
    form.value.area = module.data?.bonusBlockItem?.area
    form.value.weight = module.data?.bonusBlockItem?.weight
    form.value.proof = module.data?.bonusBlockItem?.proof

    form.value.accumulation_type = module.data?.bonusBlockItem?.accumulation_type?.id
    form.value.range = module.data?.bonusBlockItem?.range

    form.value.targets = module.data.bonusBlockItem.targets
    form.value.indicator_id = module.data?.bonusBlockItem?.indicator_id
    dataItem.value.indicator = module.data?.bonusBlockItem?.indicator.label
    dataItem.value.direction = module.data?.bonusBlockItem?.indicator?.direction?.name
    dataItem.value.grade = module.data?.bonusBlockItem?.grade?.grade
    dataItem.value.grade_weight = module.data?.bonusBlockItem?.grade?.grade_weight
    dataItem.value.month_ref = module.data?.bonusBlockItem?.grade?.month_ref
  }
}

const inputStatus = (disabled, errror) => {
  let status = ''

  if (disabled) {
    status = ' bg-disabled '
  }
  if (errror) {
    status = status + ' input-error '
  }

  return status
}

const submit = async () => {
  try {
    await module.setStore(
      `api/administration/incentives/bonus/block/item/update/${props.id}`,
      form.value
    )

    if (notify.success) {
      module.data.submit = true
      await Promise.all([
        module.getShow(
          `api/administration/incentives/bonus/block/show/${props.block_id}`,
          ['block'],
          true
        ),
        loadData()
      ])
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
        <v-col cols="4" class="pa-0">
          <v-row class="ma-0">
            <v-col cols="12" class="pa-1">
              <v-card elevation="3">
                <v-card-text class="pa-2">
                  <v-row class="ma-0">
                    <v-col class="pa-1" cols="3">
                      <v-text-field
                        v-model="form.weight"
                        density="compact"
                        label="Peso"
                        color="primary"
                        class="inputCenter"
                        hide-details=""
                        variant="outlined"
                        hide-spin-buttons
                        closable-chips
                        type="number"
                        step="0.01"
                        :error-messages="notify?.errors?.weight"
                      />
                    </v-col>
                    <v-col cols="3" class="pa-1 text-h6">
                      <v-text-field
                        v-model="dataItem.month_ref"
                        readonly
                        density="compact"
                        label="Mês"
                        class="inputCenter bg-disabled"
                        color="primary"
                        hide-details=""
                        variant="outlined"
                        hide-spin-buttons
                      />
                    </v-col>
                    <v-col cols="3" class="pa-1 text-h6">
                      <v-text-field
                        v-model="dataItem.grade"
                        readonly
                        density="compact"
                        label="Nota"
                        class="inputCenter bg-disabled"
                        color="primary"
                        hide-details=""
                        variant="outlined"
                        hide-spin-buttons
                      />
                    </v-col>
                    <v-col cols="3" class="pa-1 text-h6">
                      <v-text-field
                        v-model="dataItem.grade_weight"
                        readonly
                        density="compact"
                        label="N x P"
                        class="inputCenter bg-disabled"
                        color="primary"
                        hide-details=""
                        variant="outlined"
                        hide-spin-buttons
                      />
                    </v-col>

                    <v-col class="pa-1" cols="6">
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
                    <v-col class="pa-1" cols="6">
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
                  </v-row>

                  <v-row class="ma-0">
                    <v-col class="pa-1" cols="12">
                      <v-text-field
                        v-model="dataItem.indicator"
                        density="compact"
                        readonly
                        class="rounded-0 bg-disabled"
                        label="Indicador"
                        color="primary"
                        hide-details=""
                        variant="outlined"
                      >
                        <template #append-inner>
                          <v-btn
                            density="compact"
                            elevation="0"
                            class="rounded-0 rounded-e px-3 h-100"
                            >DNA</v-btn
                          >
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col class="pa-1" cols="5">
                      <v-text-field
                        v-model="dataItem.direction"
                        density="compact"
                        class="bg-disabled"
                        readonly
                        label="Direção"
                        color="primary"
                        hide-details=""
                        variant="outlined"
                        hide-spin-buttons
                      />
                    </v-col>

                    <v-col class="pa-1" cols="7">
                      <v-autocomplete
                        v-model="form.accumulation_type"
                        :items="module.data?.accumulationTypes"
                        color="primary"
                        density="compact"
                        label="Acumulado"
                        variant="outlined"
                        hide-details=""
                        menu-icon=""
                        item-title="name"
                        item-value="id"
                        :error-messages="notify?.errors?.accumulation_type"
                      />
                    </v-col>
                    <v-col class="pa-1" cols="12">
                      <v-autocomplete
                        v-model="form.area"
                        :items="module.data?.areas"
                        class="inputH40"
                        color="primary"
                        density="compact"
                        label="Área"
                        variant="outlined"
                        hide-details=""
                        menu-icon=""
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
                        rows="3"
                        :error-messages="notify?.errors?.proof"
                      />
                    </v-col>
                    <v-col class="pt-1 pb-2 px-1" cols="12">
                      <div class="text-caption w-100 text-center">
                        <v-tooltip>
                          <template v-slot:activator="{ props }">
                            <span v-bind="props" class="font-weight-bold">GR </span>
                          </template>
                          <span>
                            GR (Grau de realização) = % de atingimento da meta<br />
                            P = Planejado <br />
                            R = Realizado <br />
                            Para calcular o atingimento da meta:<br />
                            MAIOR MELHOR<br />
                            (R/P)*100 <br />
                            - MENOR MELHOR<br />
                            ((P-R) / P) * 100 + 100
                          </span>
                        </v-tooltip>
                      </div>
                      <v-divider />

                      <v-row class="ma-0 pt-1">
                        <v-col cols="6" class="pa-1 d-flex">
                          <div class="w-25 d-flex justify-center align-center text-left pt-1">
                            <v-btn
                              :icon="module.data.blockRanges[1]?.icon"
                              :color="module.data.blockRanges[1]?.color"
                              density="compact"
                              class="rounded-0"
                            />
                          </div>

                          <div class="w-75 d-flex justify-center align-center text-caption pt-1">
                            Nota abaixo de 0,00
                          </div>
                        </v-col>
                        <v-col
                          cols="6"
                          class="pa-1 d-flex"
                          v-for="(item, n) in form.range"
                          :key="item.id"
                        >
                          <div class="w-25 d-flex justify-center align-center text-left pt-1">
                            <v-btn
                              :icon="module.data.blockRanges[item.id]?.icon"
                              :color="module.data.blockRanges[item.id]?.color"
                              density="compact"
                              class="rounded-0"
                            />
                          </div>
                          <div class="w-25 d-flex justify-center align-center text-left pt-1">
                            {{ module.data.blockRanges[item.id]?.grade }}
                          </div>

                          <div class="w-50 d-flex justify-start align-center">
                            <input
                              v-model="item.gr"
                              type="number"
                              step="0.01"
                              min="-Infinity"
                              :class="
                                inputStatus(notify?.errors?.['range.' + n + '.gr'])
                                  ? 'input-error'
                                  : ''
                              "
                              class="border-sm text-center text-caption rounded basicInput w-100"
                            />
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="8" class="pa-1">
          <v-card elevation="3">
            <v-card-text class="pa-0 px-0">
              <table width="100%" cellspacing="0">
                <thead>
                  <tr class="bg-teal-darken-3">
                    <th rowspan="2" class="py-1 pb-2 border-e-md">Mês<br />Ano</th>
                    <th colspan="4" class="py-1 pt-2 border-e-md">Mensal</th>
                    <th colspan="4" class="py-1">Acumulado</th>
                  </tr>
                  <tr class="bg-teal-darken-3">
                    <th width="14%" class="py-1">Planejado</th>
                    <th width="14%" class="py-1">Realizado</th>
                    <th width="100px" class="py-1">Desvio</th>
                    <th width="25px" class="py-1 border-e-md"></th>
                    <th width="14%" class="py-1">Planejado</th>
                    <th width="14%" class="py-1">Realizado</th>
                    <th width="100px" class="py-1">Desvio</th>
                    <th width="25px" class="py-1"></th>
                  </tr>
                </thead>
                <tbody class="pt-3">
                  <tr v-for="(item, n) in form.targets" :key="item.id" class="row-hover">
                    <td class="text-center py-1 border-e-md">{{ item.month_ref }}</td>
                    <td class="text-center py-1">
                      <input
                        v-model="form.targets[n].month_target"
                        type="number"
                        step="0.01"
                        min="-Infinity"
                        :class="
                          notify?.errors?.['targets.' + n + '.month_target'] ? 'input-error' : ''
                        "
                        class="border-sm text-center text-caption rounded basicInput"
                      />
                    </td>
                    <td class="text-center py-1">
                      <input
                        v-model="form.targets[n].month_result"
                        type="number"
                        step="0.01"
                        min="-Infinity"
                        :class="
                          notify?.errors?.['targets.' + n + '.month_result'] ? 'input-error' : ''
                        "
                        class="border-sm text-center text-caption rounded basicInput"
                      />
                    </td>
                    <td width="100px" class="pl-2 py-1 text-caption d-inline-block text-center">
                      <span :title="n">{{ form.targets[n].month_detour?.percentage }}</span>
                    </td>
                    <td class="px-1 border-e-md text-caption">
                      <v-sheet
                        height="27"
                        class="d-flex align-center px-1"
                        :class="'bg-' + form.targets[n].month_detour?.color"
                      >
                        <v-icon
                          :icon="form.targets[n].month_detour?.icon"
                          class="bg-transparent"
                        ></v-icon>
                      </v-sheet>
                    </td>
                    <td class="text-center py-1">
                      <input
                        v-model="form.targets[n].accumulated_target"
                        :disabled="form.accumulation_type != 0"
                        type="number"
                        step="0.01"
                        min="-Infinity"
                        :class="
                          inputStatus(
                            form.accumulation_type != 0,
                            notify?.errors?.['targets.' + n + '.accumulated_target']
                          )
                        "
                        class="border-sm text-center text-caption rounded basicInput"
                      />
                    </td>
                    <td class="text-center py-1">
                      <input
                        v-model="form.targets[n].accumulated_result"
                        :disabled="form.accumulation_type != 0"
                        type="number"
                        step="0.01"
                        min="-Infinity"
                        :class="
                          inputStatus(
                            form.accumulation_type != 0,
                            notify?.errors?.['targets.' + n + '.accumulated_target']
                          )
                        "
                        class="border-sm text-center text-caption rounded basicInput"
                      />
                    </td>
                    <td width="100px" class="pl-2 py-1 text-caption d-inline-block text-center">
                      <span :title="n">{{ form.targets[n].accumulated_detour?.percentage }}</span>
                    </td>

                    <td class="px-1 border-e-md text-caption">
                      <v-sheet
                        height="27"
                        class="d-flex align-center px-1"
                        :class="'bg-' + form.targets[n].accumulated_detour?.color"
                      >
                        <v-icon
                          :icon="form.targets[n].accumulated_detour?.icon"
                          class="bg-transparent"
                        ></v-icon>
                      </v-sheet>
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-card-text>
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
.row-hover:hover {
  background-color: rgba(177, 171, 171, 0.2) !important;
}
.basicInput {
  width: 90%;
}

.input-error {
  border-color: red !important;
}

ul {
  list-style-type: none;
}

.rangeRow {
  background-color: rgb(230, 204, 253);
  height: 41px !important;
}
.rangeBlock {
  height: 19px !important;
  border-radius: 5px;
  margin-top: 3px;
  margin-bottom: -3px;
  /* font-size: 5px !important; */
}

:deep(.v-field__append-inner) {
  margin-right: -12px;
}

/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 2px 2px;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 247px);
}
</style>
