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

const form = ref({
  fiscal_year_id: module?.data?.activefiscalYear ?? null,
  owner_id: null,
  area: null,
  hierarchical_level: null,
  blocks: []
})

const totalWeight = computed(() => {
  return form.value.blocks.reduce((total, block) => total + Number(block.weight), 0)
})

const addBlock = () => {
  // Adicionar um novo objeto vazio ao array form.sectors
  form.value.blocks.push({
    block_id: '',
    weight: ''
  })
}

const removeBlock = (index) => {
  // Remover o item do array com o índice especificado
  form.value.blocks.splice(index, 1)
}

const defultBlocks = () => {
  let blocks = module.data.bonusBlock

  let filteredBlocks = blocks.filter((block) => block.default === true)
  filteredBlocks = filteredBlocks.sort((a, b) => a.order - b.order)

  filteredBlocks.forEach(function (item) {
    form.value.blocks.push({
      block_id: item.public_id,
      weight: item.weight
    })
  })
}

const gethierarchicalLevel = (username) => {
  let owners = module.data.owners

  const owner = owners.filter((item) => item.username === username)[0]

  form.value.hierarchical_level = owner ? owner.hierarchical_level.id : null
}

onMounted(() => {
  defultBlocks()
  addBlock()
})

const submit = async () => {
  try {
    await module.setStore('api/administration/incentives/bonus/panel/store', form.value)
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
    <v-card-text class="pa-0">
      {{ gethierarchicalLevel(form.owner_id) }}
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
            label="Responsável"
            color="primary"
            class="inputH40"
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
                    <img :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar" width="40" />
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
          <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
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
                      append-icon="mdi-minus"
                      @click:append="removeBlock(n)"
                      :error-messages="notify?.errors?.['blocks.' + n + '.weight']"
                    />
                  </v-col>
                </v-row>
              </VueDraggableNext>
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
</style>
