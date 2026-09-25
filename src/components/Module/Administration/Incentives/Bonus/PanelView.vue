<script setup>
import { ref, onMounted } from 'vue'
import { moduleStore } from '@/store'

import PanelBlockCard from '@/components/Module/Administration/Incentives/Bonus/PanelBlockCard.vue'
import PanelUpdate from '@/components/Module/Administration/Incentives/Bonus/PanelUpdate.vue'
import PanelValidate from '@/components/Module/Administration/Incentives/Bonus/PanelValidate.vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'

import moment from 'moment'

const module = moduleStore()

const dialogUpdate = ref(false)
const dialogValidate = ref(false)

const dialogOpem = () => {
  dialogUpdate.value = true
}
const dialogValidateOpem = () => {
  if (module.data?.panel?.status.id == 1) {
    dialogValidate.value = true
  }
}

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  publicId: String
})

// Variável reativa para rastrear os painéis abertos
const activePanels = ref([])

// Função para verificar se o painel está ativo
const isPanelActive = (id) => {
  return activePanels.value === id
}

const blocks = ref(module?.data?.panel?.blocks)

onMounted(async () => {
  try {
    await module.getShow(
      `api/administration/incentives/bonus/panel/show/${props.publicId}`,
      ['panel'],
      true
    )
  } finally {
  }
})

const submit = async () => {}
</script>
<template>
  <div>
    <form @submit.prevent="submit">
      <v-card-text class="pa-0">
        <v-row class="ma-0">
          <v-col cols="12" class="pa-1">
            <v-card elevation="3">
              <v-card-text class="pa-2">
                <v-list-item
                  lines="one"
                  class="py-0"
                  :title="
                    module.data?.panel?.owner?.name +
                    ' - ' +
                    module.data?.panel?.hierarchical_level?.label
                  "
                  :subtitle="module.data?.panel?.area"
                >
                  <span class="d-flex block-inline pr-3">
                    Ano fiscal: {{ module.data?.panel?.fiscal_year?.label }} | Referência:
                    {{ moment(module.data?.activeMonth).format('YYYY - MMM') }}
                  </span>

                  <template #prepend>
                    <v-icon size="x-large" icon="mdi-chart-bar-stacked"></v-icon>
                  </template>
                  <template #append>
                    <div style="height: 75px" class="px-3 d-flex">
                      <v-btn
                        :color="module.data?.panel?.status?.color"
                        class="align-self-end mx-1"
                        density="compact"
                        @click="dialogValidateOpem"
                      >
                        {{ module.data?.panel?.status?.label }}
                      </v-btn>
                    </div>
                    <v-card elevation="0">
                      <v-card-subtitle class="px-1 text-center">Nota do painel</v-card-subtitle>
                      <v-card-text
                        class="pt-0 pb-1 px-1 text-h3 justify-center d-flex align-center"
                        style="height: 56px"
                      >
                        {{ module.data?.panel?.grade }}
                      </v-card-text>
                    </v-card>
                    <div style="height: 75px" class="pl-3">
                      <v-btn
                        elevation="0"
                        icon="mdi-pencil-box-outline"
                        class="rounded-0"
                        color="transparent"
                        density="compact"
                        @click.stop="dialogOpem"
                      >
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" class="pa-1">
            <v-card>
              <v-card-text class="bg-brand_verde_dark py-1 px-2">
                <v-row class="ma-0 px-0">
                  <v-col cols="6" class="pa-0">Bloco</v-col>
                  <v-col cols="2" class="pa-0 text-center">Nota do bloco</v-col>
                  <v-col cols="2" class="pa-0 text-center">Peso do bloco</v-col>
                  <v-col cols="2" class="pa-0 text-center">Nota x Peso</v-col>
                </v-row>
              </v-card-text>
              <v-card-text class="pa-0 overflow-auto" style="height: calc(100vh - 195px)">
                <v-expansion-panels
                  class="border-b"
                  v-model="activePanels"
                  variant="accordion"
                  hide-actions
                >
                  <v-expansion-panel
                    elevation="0"
                    v-for="(item, n) in module?.data?.panel?.blocks"
                    :key="item.id"
                    :class="{ 'bg-background': isPanelActive(n) }"
                  >
                    <v-expansion-panel-title class="px-2">
                      <v-list-item class="w-100 pa-0">
                        <v-row class="ma-0">
                          <v-col cols="6" class="pa-0">
                            <span
                              style="width: 550px; float: left"
                              class="d-inline-block text-truncate"
                            >
                              {{ item?.name }} {{ item?.owner?.name ? '-' : '' }}
                              {{ item?.owner?.name }}
                            </span>
                          </v-col>
                          <v-col cols="2" class="pa-0 text-center"> {{ item?.grade }}</v-col>
                          <v-col cols="2" class="pa-0 text-center">
                            {{ item?.weight }}
                          </v-col>
                          <v-col cols="2" class="pa-0 text-center"> {{ item?.grade_weight }}</v-col>
                        </v-row>
                      </v-list-item>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="pa-0">
                      <PanelBlockCard
                        v-for="(card, n) in item?.block_itens"
                        :key="card.id"
                        :item="card"
                      />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </form>
    <CoreDialog
      v-model="dialogUpdate"
      header-icon="mdi-code-block-brackets"
      header-title="Atualizar - Painel"
      body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
      headerheight="35px"
      max-width="950px"
      header-class="bg-brand_verde_dark"
      :loading="module.showing"
    >
      <PanelUpdate v-model="dialogUpdate" :data="module.data.panel" />
    </CoreDialog>
    <CoreDialog
      v-model="dialogValidate"
      header-icon="mdi-check"
      header-title="Validar painel "
      body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
      headerheight="35px"
      max-width="400px"
      header-class="bg-brand_verde_dark"
      :loading="module.showing"
    >
      <PanelValidate
        v-model="dialogValidate"
        :publicId="module.data.panel.public_id"
        :fiscalYear="module.data.panel.fiscal_year_id"
      />
    </CoreDialog>
  </div>
</template>
<style scoped>
:deep(.v-expansion-panel-title) {
  height: 52px !important;
  /* min-height: 32px !important; */
}
</style>
