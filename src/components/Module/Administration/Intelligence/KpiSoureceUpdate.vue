<script setup>
import { ref, onMounted } from 'vue'
import { coreStore, moduleStore, notifyStore, authStore } from '@/store'

const core = coreStore()
const module = moduleStore()
const notify = notifyStore()
const auth = authStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const props = defineProps({
  id: Number,
  modelValue: Boolean
})

const form = ref({
  owner: '',
  sla: '',
  notes: '',
  report_id: '',
  data_location: '',
  rebuild: 0,
  sectors: []
})

const owners = ref()
const indicator = ref()
const indicators = ref()

onMounted(async () => {
  try {
    await module.getShow(`api/administration/intelligence/kpi-sources/show/${props.id}`, [
      'kpiSource'
    ])
    const kpiSourceData = JSON.parse(JSON.stringify(module.data?.kpiSource ?? []))

    form.value.id = kpiSourceData?.id
    form.value.owner = kpiSourceData?.owner.username
    form.value.indicator = kpiSourceData?.indicator.id
    form.value.sla = kpiSourceData?.sla
    form.value.notes = kpiSourceData?.notes
    form.value.data_location = kpiSourceData?.data_location
    form.value.report_id = kpiSourceData?.report_id
    form.value.sectors = kpiSourceData?.sectors
    form.value.active = kpiSourceData?.active.id

    owners.value = JSON.parse(JSON.stringify(module?.data?.owners ?? []))
    const isOwnerExists = owners.value.some(
      (owner) => owner.username === kpiSourceData?.owner?.username
    )

    if (!isOwnerExists) {
      owners.value.unshift(kpiSourceData?.owner)
    }

    indicators.value = JSON.parse(JSON.stringify(module?.data?.indicators ?? []))
    indicator.value = kpiSourceData?.indicator

    const isIndicatorExists = indicators.value.some(
      (indicator) => indicator.id === kpiSourceData?.indicator.id
    )

    if (!isIndicatorExists) {
      indicators.value.unshift(kpiSourceData?.indicator)
    }
  } catch (error) {}
})

const submit = async () => {
  try {
    await module.setStore(
      `api/administration/intelligence/kpi-sources/update/${props.id}`,
      form.value
    )
    if (notify.success) {
      closeDialog()
      await module.getDataPart('api/administration/intelligence/kpi-sources', ['kpiSources'])
    }
  } catch (error) {}
}

const addSector = () => {
  // Adicionar um novo objeto vazio ao array form.sectors
  form.value.sectors.unshift({
    sector_n1_id: null,
    report_id: form.value.report_id,
    data_location: form.value.data_location
  })
}

const removeSector = (index) => {
  // Remover o item do array com o índice especificado
  form.value.sectors.splice(index, 1)
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-skeleton-loader
      :loading="module.showing"
      class="bg-dialog"
      elevation="0"
      type="article,  card , card"
    >
      <v-card-text class="pa-0">
        <v-row class="ma-0">
          <v-col class="pa-0" cols="8">
            <v-row class="ma-0">
              <v-col class="pa-1" cols="9">
                <v-autocomplete
                  v-model="form.owner"
                  density="compact"
                  label="Responsável"
                  color="primary"
                  :items="owners"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="username"
                  hide-spin-buttons
                  clearable
                >
                  <template #chip="{ props, item }">
                    <v-chip
                      v-if="item.raw.avatar?.avatar"
                      variant="text"
                      v-bind="props"
                      :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                    >
                      {{ item.raw.name }}
                    </v-chip>
                  </template>

                  <template #item="{ props, item }">
                    <v-list-item
                      v-bind="props"
                      :subtitle="item.raw.hierarchical_level?.label + ' | ' + item.raw.username"
                      :title="item.raw.name"
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

              <v-col class="pa-1" cols="3">
                <v-autocomplete
                  v-model="form.active"
                  color="primary"
                  density="compact"
                  label="Status"
                  hide-details=""
                  variant="outlined"
                  item-title="name"
                  item-value="id"
                  :items="module.data.statuses"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col class="pa-1" cols="6">
                <v-autocomplete
                  v-model="indicator"
                  disabled=""
                  color="primary"
                  density="compact"
                  label="Indicador"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :items="indicators"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col class="pa-1" cols="3">
                <v-text-field
                  v-model="form.sla"
                  color="primary"
                  density="compact"
                  label="SLA (D -1)"
                  variant="outlined"
                  type="number"
                  hide-details=""
                />
              </v-col>
              <v-col class="pa-1" cols="3">
                <v-autocomplete
                  v-model="form.rebuild"
                  color="primary"
                  density="compact"
                  label="Recriar Tabela"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :items="[
                    { id: 0, label: 'Não' },
                    { id: 1, label: 'Sim' }
                  ]"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col class="pa-1" cols="5">
                <v-autocomplete
                  v-model="form.report_id"
                  color="primary"
                  density="compact"
                  label="Relatório"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :items="module.data.reports"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col class="pa-1" cols="7">
                <v-text-field
                  v-model="form.data_location"
                  color="primary"
                  density="compact"
                  label="Localização do dado"
                  variant="outlined"
                  hide-details=""
                  placeholder="Aba, coluna e linha. Exp.: Aba Operador, [AT:52]"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col class="pa-1" cols="4">
            <v-textarea
              v-model="form.notes"
              label="Observações"
              color="primary"
              density="compact"
              variant="outlined"
              hide-details=""
              rows="5"
              :error-messages="notify?.errors?.notes"
            />
          </v-col>
        </v-row>

        <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
          <v-card-text class="bg-brand_verde_dark py-1 d-flex">
            <span class="py-1"> Setores </span>
            <v-spacer />
            <v-btn
              icon="mdi-plus"
              rounded="0"
              elevation="0"
              color="transparent"
              density="compact"
              @click="addSector"
            ></v-btn>
          </v-card-text>

          <v-card-text class="pa-1 overflow-auto" style="height: calc(100vh - 370px)">
            <v-row
              v-for="(item, n) in form.sectors"
              :key="n"
              class="ma-0"
              style="height: 52.38px !important"
            >
              <v-col cols="12" class="pa-1">
                <div class="d-inline-flex w-100">
                  <v-autocomplete
                    v-model="form.sectors[n].sector_n1_id"
                    color="primary"
                    class="sectors_select mr-2 w-25"
                    density="compact"
                    variant="outlined"
                    :label="'Setor: ' + n"
                    hide-details=""
                    clearable
                    :items="module.data.sectors"
                    itemTitle="label"
                    itemValue="id"
                    :error-messages="notify?.errors?.['sectors.' + n + '.sector_n1_id']"
                  />

                  <v-autocomplete
                    v-model="form.sectors[n].report_id"
                    color="primary"
                    class="mr-2 w-25"
                    density="compact"
                    label="Relatório"
                    variant="outlined"
                    hide-details=""
                    clearable
                    :items="module.data.reports"
                    itemTitle="label"
                    itemValue="id"
                  />

                  <v-text-field
                    v-model="form.sectors[n].data_location"
                    color="primary"
                    class="mr-5 w-25"
                    density="compact"
                    label="Localização do dado"
                    variant="outlined"
                    hide-details=""
                    placeholder="Aba, coluna e linha. Exp.: Aba Operador, [AT:52]"
                  />

                  <v-btn
                    icon="mdi-minus"
                    rounded="0"
                    class="my-auto"
                    elevation="0"
                    color="transparent"
                    density="compact"
                    @click="removeSector(n)"
                  />
                </div>
              </v-col>
            </v-row>
            <!-- <pre>
            {{ form }}
          </pre
            > -->
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-skeleton-loader>
    <v-card-actions class="px-4 bg-dialog">
      <v-spacer></v-spacer>
      <v-btn
        :loading="module.storing || module.showing"
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

