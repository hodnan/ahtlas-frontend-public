<script setup>
import { ref, defineProps } from 'vue'
import BlockTargetUpdate from '@/components/Module/Administration/Incentives/Bonus/BlockTargetUpdate.vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import { moduleStore } from '@/store'

const module = moduleStore()
const dialogUpdate = ref(false)

const props = defineProps({
  item: Object
})

const dialogOpem = (event, item) => {
  dialogUpdate.value = true
}
</script>
<template>
  <v-card class="target-card" elevation="3" color="background">
    <v-card-title class="text-subtitle-1 text-brand_txt px-2 pb-1 d-flex flex-row">
      <v-sheet class="w-75 d-inline-block text-truncate bg-background">
        {{ item.indicator.direction.action }} - {{ item.indicator.name }}
      </v-sheet>
      <v-spacer />

      <v-sheet class="w-25 bg-background text-truncate text-right w-25">
        <v-btn
          icon="mdi-square-edit-outline"
          size="25"
          color="brand_txt rounded-0"
          variant="plain"
          @click.stop="dialogOpem"
        ></v-btn>
      </v-sheet>
    </v-card-title>

    <v-card-text class="pa-1">
      <table width="100%" cellspacing="5">
        <tbody>
          <tr>
            <td class="px-0 py-1 text-left">Ref.: {{ item?.grade?.month_ref }}</td>
            <td
              width="30%"
              class="px-2 py-1 text-center border-b-sm"
              :class="'bg-' + item?.grade?.month_detour?.color"
            >
              <v-icon :icon="item?.grade?.month_detour.icon" />
              Mensal
            </td>

            <td
              width="30%"
              class="px-2 text-center border-b-sm"
              :class="'bg-' + item?.grade?.accumulated_detour?.color"
            >
              <v-icon :icon="item?.grade?.accumulated_detour.icon" />
              Acumulado
            </td>

            <td class="px-2">Nota</td>
            <td class="px-2 text-right">{{ item?.grade?.grade }}</td>
          </tr>
          <tr>
            <td class="text-left px-0">Planejado</td>
            <td class="text-center px-2">{{ item?.grade?.month_target }}</td>

            <td class="text-center px-2">{{ item?.grade?.accumulated_target }}</td>

            <td class="text-left px-2">Peso</td>
            <td class="text-right px-2">{{ item.weight }}</td>
          </tr>
          <tr>
            <td class="text-left px-0">Realizado</td>
            <td class="text-center px-2">{{ item?.grade?.month_result }}</td>

            <td class="text-center px-2">{{ item?.grade?.accumulated_result }}</td>

            <td class="text-left px-2">P x N</td>
            <td class="text-right px-2">{{ item.grade?.grade_weight }}</td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
  </v-card>

  <CoreDialog
    v-model="dialogUpdate"
    header-icon="mdi-square-edit-outline"
    header-title="Atualizar - Meta"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
    headerheight="35px"
    max-width="1200px"
    min-height="575px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <BlockTargetUpdate v-model="dialogUpdate" :id="item?.id" :block_id="item.block_id" />
  </CoreDialog>
</template>
