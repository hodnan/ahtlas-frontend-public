<script setup>
import { moduleStore } from '@/store'
const module = moduleStore()

const props = defineProps({
  id: Number
})

const loading = ref(false)

const downloadFile = async (id) => {
  try {
    loading.value = true
    await module.getDownload(`/api/administration/planning/file-load/download-model/${id}`)
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}
</script>
<template>
  <div>
    <v-btn
      :disabled="id == null"
      :loading="loading"
      prependIcon="mdi-download"
      variant="outlined"
      style="height: 40px"
      @click.stop="downloadFile(id)"
    >
      Modelo
    </v-btn>
  </div>
</template>