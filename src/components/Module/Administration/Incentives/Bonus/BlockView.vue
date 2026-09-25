<script setup>
import BlockUpdate from '@/components/Module/Administration/Incentives/Bonus/BlockUpdate.vue'
import BlockTargetView from '@/components/Module/Administration/Incentives/Bonus/BlockTargetView.vue'

const props = defineProps({
  item: Object
})
</script>
<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col cols="6" class="pa-1">
          <v-card elevation="3">
            <BlockUpdate :item="item" />
          </v-card>
        </v-col>
        <v-col cols="6" class="pa-1 pb-0">
          <v-card elevation="3">
            <BlockTargetView :public_id="item?.public_id" />
          </v-card>
        </v-col>
      </v-row>
      <v-row class="ma-0"> </v-row>
    </v-card-text>
  </form>
</template>
