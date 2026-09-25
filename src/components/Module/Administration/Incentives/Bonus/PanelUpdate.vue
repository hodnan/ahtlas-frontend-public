<script setup>
import { ref, onMounted } from 'vue'
import { moduleStore, notifyStore } from '@/store'
import { VueDraggableNext } from 'vue-draggable-next'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import BlockAdd from '@/components/Module/Administration/Incentives/Bonus/BlockAdd.vue'

const module = moduleStore()
const notify = notifyStore()

const dialogAdd = ref(false)

const dialogOpem = () => {
  dialogAdd.value = true
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  data: Object
})

const form = ref({
  public_id: null,
  copy: [],
  blocks: []
})

const totalWeight = computed(() => {
  // pega somente blocos delete false
  const filteredBlocks = form.value.blocks.filter((block) => !block.delete)

  // Calcula a soma
  return filteredBlocks.reduce((total, block) => total + Number(block.weight), 0)
})

const addBlock = () => {
  // Adicionar um novo objeto vazio ao array form.sectors
  form.value.blocks.push({
    block_id: '',
    weight: '',
    delete: false
  })
}

onMounted(async () => {
  form.value.area = props.data.area
  form.value.owner_id = props.data.owner_id
  form.value.fiscal_year_id = props.data.fiscal_year_id
  form.value.hierarchical_level = props.data.hierarchical_level.id
  form.value.status = props.data.status.id
  form.value.blocks = []
  props.data.blocks.forEach((element) => {
    form.value.blocks.push({
      id: element.id,
      block_id: element.public_id,
      weight: element.weight,
      delete: false
    })
  })
})

const submit = async () => {
  try {
    await module.setStore(
      `api/administration/incentives/bonus/panel/update/${props.data.public_id}`,
      form.value
    )
    if (notify.success) {
      emit('update:modelValue', false)
      module.data.submit = true
      await module.getShow(
        `api/administration/incentives/bonus/panel/show/${props.data.public_id}`,
        ['panel'],
        true
      )
      getData()
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div>
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col cols="6" class="pa-1">
          <v-card>
            <v-card-text class="pa-1">
              <v-row class="ma-0">
                <v-col class="pa-1" cols="5">
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
                    hide-spin-buttons
                    closable-chips
                    menu-icon=""
                    :error-messages="notify?.errors?.fiscal_year_id"
                  >
                  </v-autocomplete>
                </v-col>

                <v-col class="pa-1" cols="7">
                  <v-autocomplete
                    v-model="form.owner_id"
                    density="compact"
                    readonly
                    label="Responsável"
                    color="primary"
                    class="inputH40 bg-disabled"
                    :items="module.data.owners"
                    hide-details=""
                    variant="outlined"
                    item-title="label"
                    item-value="username"
                    hide-spin-buttons
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
                <v-col class="pa-1" cols="8">
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
                <v-col class="pa-1" cols="4">
                  <v-autocomplete
                    v-model="form.hierarchical_level"
                    :items="module.data?.hierarchicalLevel"
                    readonly
                    color="primary"
                    class="bg-disabled"
                    density="compact"
                    label="Hierarquia"
                    variant="outlined"
                    hide-details=""
                    menu-icon=""
                    clearable
                    item-title="name"
                    item-value="id"
                    :error-messages="notify?.errors?.hierarchical_level"
                  />
                </v-col>

                <v-col class="pa-0" cols="12">
                  <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="0">
                    <v-card-text class="bg-brand_verde_dark py-1 d-flex">
                      <span class="py-1"> Blocos </span>
                      <v-spacer />
                      <span
                        class="py-1 px-2"
                        :class="notify?.errors?.full_weight ? 'text-error bg-background2' : ''"
                      >
                        Peso Total: {{ totalWeight }}</span
                      >
                      <v-spacer />
                      <span class="py-1 px-2" @click.stop="dialogOpem()">
                        <div class="rounded-sm bg-brand_silver px-1 elevation-3 cursor-pointer">
                          Novo Bloco
                        </div>
                      </span>
                      <v-btn
                        icon="mdi-plus"
                        rounded="0"
                        elevation="0"
                        color="transparent"
                        density="compact"
                        @click.stop="addBlock"
                      />
                    </v-card-text>

                    <v-card-text class="pa-1 overflow-auto" style="height: calc(100vh - 370px)">
                      <VueDraggableNext :list="form.blocks">
                        <v-row
                          v-for="(block, n) in form.blocks"
                          :key="n"
                          class="ma-0"
                          style="height: 52.38px !important"
                        >
                          <v-col cols="9" class="pa-1">
                            <v-autocomplete
                              v-model="form.blocks[n].block_id"
                              :items="module.data.bonusBlock"
                              color="primary"
                              density="compact"
                              variant="outlined"
                              hide-details=""
                              item-title="name"
                              item-value="public_id"
                              prepend-icon="mdi-drag-vertical"
                              clearable
                              :error-messages="notify?.errors?.['blocks.' + n + '.block_id']"
                            >
                              <template #selection="{ props, item, index }">
                                <v-list-item
                                  class="pa-0"
                                  v-bind="props"
                                  :key="index"
                                  :title="item?.raw?.name"
                                  :subtitle="item?.raw?.owner?.name"
                                ></v-list-item>
                              </template>
                              <template #item="{ props, item, index }">
                                <v-list-item
                                  v-bind="props"
                                  :key="index"
                                  :title="item.raw?.name"
                                  :subtitle="item.raw?.owner?.name"
                                ></v-list-item>
                              </template>
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="3" class="pa-1">
                            <v-text-field
                              v-model="form.blocks[n].weight"
                              color="primary"
                              density="compact"
                              label="Peso"
                              class="inputCenter"
                              variant="outlined"
                              type="number"
                              step="0.01"
                              hide-details=""
                              :error-messages="notify?.errors?.['blocks.' + n + '.weight']"
                            >
                              <template #append>
                                <v-icon
                                  icon="mdi-trash-can-outline"
                                  :color="form.blocks[n].delete ? 'error' : ''"
                                  @click.stop="form.blocks[n].delete = !form.blocks[n].delete"
                                />
                              </template>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </VueDraggableNext>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" class="pa-1">
          <v-card>
            <v-card-text class="pa-1">
              <v-row class="ma-0">
                <v-col cols="12" class="pa-0">
                  <v-autocomplete
                    v-model="form.status"
                    density="compact"
                    label="Status"
                    color="primary"
                    class="mt-2"
                    :items="module.data.panelStatuses"
                    hide-details=""
                    variant="outlined"
                    item-title="label"
                    item-value="id"
                    hide-spin-buttons
                    menu-icon=""
                    :error-messages="notify?.errors?.status"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pa-0" style="height: 158px">
                  <v-autocomplete
                    v-model="form.copy"
                    density="compact"
                    label="Criar cópia"
                    color="primary"
                    class="copy_panel mt-2"
                    :items="data.team"
                    hide-details=""
                    variant="outlined"
                    item-title="label"
                    item-value="username"
                    hide-spin-buttons
                    menu-icon=""
                    multiple=""
                    clearable=""
                    :error-messages="notify?.errors?.copy"
                  >
                    <template #chip="{ props, item, index }">
                      <v-chip
                        v-bind="props"
                        class="rounded-0"
                        variant="text"
                        :key="index"
                        :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                      >
                        {{ item.raw.name }} - {{ item.raw.position_summary }}
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
                <v-col cols="12" class="pa-0 pt-2">
                  <v-table class="" density="compact">
                    <thead>
                      <tr style="height: 25px !important">
                        <th width="33%" class="text-center text-caption pa-1">Usuário.</th>
                        <th width="33%" class="text-center text-caption pa-1">Data</th>
                        <th width="33%" class="text-center text-caption pa-1">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in data?.historical" :key="item?.id">
                        <td style="height: 25px !important" class="text-center text-caption pa-0">
                          {{ item?.created_by }}
                        </td>
                        <td style="height: 25px !important" class="text-center text-caption pa-0">
                          {{ item?.created_at }}
                        </td>
                        <td style="height: 25px !important" class="text-center text-caption pa-0">
                          <span :class="'bg-' + item.status.color" class="px-2 rounded-lg">
                            {{ item.status.label }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-col>
              </v-row>
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
        @click.stop="submit"
      >
        Gravar
      </v-btn>
    </v-card-actions>
    <CoreDialog
      v-model="dialogAdd"
      header-icon="mdi-code-block-brackets"
      header-title="Novo - Bloco"
      body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
      headerheight="35px"
      max-width="450px"
      header-class="bg-brand_verde_dark"
      :loading="module.showing"
    >
      <BlockAdd v-model="dialogAdd" />
    </CoreDialog>
  </div>
</template>
<style scoped>
:deep(.v-input__prepend) {
  padding-right: 2px !important;

  margin-right: 0 !important;
}
.copy_panel :deep(.v-field__field) {
  /* background-color: blue !important; */
  max-height: 150px;
  overflow: auto;
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
  height: calc(100vh - 448px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
