<script setup>
import { ref } from 'vue'
import { coreStore, moduleStore, notifyStore } from '@/store'
import DownloadModel from '@/components/Module/Administration/Planning/FileLoad/DownloadModel.vue'
// import moment from 'moment'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const type = ref()

const form = ref({
  month_ref: null,
  type: null,
  file: null
})

const submit = async () => {
  try {
    form.value.type = type?.value?.id
    await module.setStore('api/administration/planning/file-load/store', form.value)
    if (notify.success) {
      closeDialog()
      await module.getDataPart('api/administration/planning/file-load', ['charges'])
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="7">
          <v-text-field
            v-model="form.month_ref"
            class="w-100"
            density="compact"
            color="primary"
            label="Mês"
            hide-details=""
            variant="outlined"
            type="month"
            :error-messages="notify?.errors?.month_ref"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="5">
          <v-autocomplete
            v-model="type"
            color="primary"
            density="compact"
            label="Tipo"
            hide-details=""
            variant="outlined"
            item-title="name"
            item-value="id"
            return-object
            :items="module.data.types"
            :error-messages="notify?.errors?.type"
          />
        </v-col>
        <v-col class="pa-1" cols="4">
          <DownloadModel :id="type?.id" />
        </v-col>
        <v-col class="pa-1" cols="8">
          <v-file-input
            v-model="form.file"
            color="primary"
            density="compact"
            label="Arquivo"
            variant="outlined"
            hide-details=""
            placeholder=""
            prepend-inner-icon="mdi-paperclip"
            prepend-icon
            :error-messages="notify?.errors?.file"
          ></v-file-input>
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
        type="submit"
      >
        Gravar
      </v-btn>
    </v-card-actions>
  </form>
</template>