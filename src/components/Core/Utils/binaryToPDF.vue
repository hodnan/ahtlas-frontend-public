<script setup>
import { ref } from 'vue'

const props = defineProps({
  data: String,
  width: String,
  height: String
})
</script>
<template>
  <iframe
    v-show="data"
    frameborder="0"
    border="0"
    cellspacing="0"
    :src="`data:application/pdf;base64,${props.data}#zoom=95&page=1`"
    :width="width"
    :height="height"
  />
</template>
