<script setup>
import { ref } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import BlockTargetAdd from '@/components/Module/Administration/Incentives/Bonus/BlockTargetAdd.vue'
import BlockTargetCard from '@/components/Module/Administration/Incentives/Bonus/BlockTargetCard.vue'
import { moduleStore } from '@/store'

const module = moduleStore()

const props = defineProps({
  public_id: String
})

const dialogAdd = ref(false)
</script>
<template>
  <v-card-text class="d-flex pa-2">
    <div class="pt-1 px-3" style="min-width: 120px">
      Metas | Peso das metas {{ module.data?.block?.itensWeight }} / 100
    </div>
    <v-spacer />

    <v-btn density="comfortable" color="brand_roxo2" @click="dialogAdd = true">
      <v-icon icon="mdi-plus" />
    </v-btn>
  </v-card-text>

  <v-card-text class="pa-0 overflow-auto" style="height: calc(100vh - 157px)">
    <v-card-text class="pa-1 px-2" v-for="item in module.data?.block?.block_itens" :key="item.id">
      <BlockTargetCard :item="item" />
    </v-card-text>
  </v-card-text>

  <CoreDialog
    v-model="dialogAdd"
    header-icon="mdi-target-variant"
    header-title="Nova - Meta"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-2 pb-2 px-2"
    headerheight="35px"
    max-width="800px"
    header-class="bg-brand_verde_dark"
    :loading="module.showing"
  >
    <BlockTargetAdd v-model="dialogAdd" :public_id="public_id" />
  </CoreDialog>
</template>
