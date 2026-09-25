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
    await module.getDownload(`/api/administration/planning/file-load/download/${id}`)
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}
</script>
<template>
  <div>
    <v-btn
      :loading="loading"
      icon="mdi-download"
      class="rounded-0"
      size="23"
      variant="outlined"
      density="compact"
      @click.stop="downloadFile(id)"
    >
    </v-btn>
  </div>
</template>