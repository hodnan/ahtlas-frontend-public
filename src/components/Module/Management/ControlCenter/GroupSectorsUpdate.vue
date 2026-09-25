<script setup>
import { ref, onMounted } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const props = defineProps({
  data: Object
})

const form = ref({
  active: props?.data?.active
})

const submit = async () => {
  try {
    await module.setStore(`api/management/control-center/group/update/${props.data.id}`, form.value)
    if (notify.success) {
      closeDialog()
      await module.getDataPart('api/management/control-center/admin', ['groups', 'kpis'])
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-0 pr-1" cols="8">
          <v-text-field
            v-model="data.name"
            color="primary"
            density="compact"
            label="Nome do grupo"
            variant="outlined"
            hide-details=""
            :error-messages="notify?.errors?.name"
          />
        </v-col>
        <v-col class="pa-0 pl-3" cols="4">
          <v-switch
            v-model="form.active"
            density="compact"
            :label="form?.active ? 'Ativo' : 'Inativo'"
            color="info"
            hide-details
          ></v-switch>
        </v-col>
      </v-row>

      <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
        <v-card-text class="bg-brand_verde_dark py-1 d-flex">
          <span class="py-1"> Setores relacionados </span>
          <v-spacer />
        </v-card-text>

        <v-card-text class="pa-1 overflow-auto" style="height: calc(100vh - 370px)">
          <v-row
            v-for="(item, n) in data?.sectors"
            :key="n"
            class="ma-0"
            style="height: 52.38px !important"
          >
            <v-col cols="12" class="pa-1">
              <div class="d-inline-flex w-100">
                <v-autocomplete
                  v-model="data.sectors[n].sector_n1_id"
                  readonly
                  color="primary"
                  class="sectors_select w-25"
                  density="compact"
                  variant="outlined"
                  :label="'Setor: ' + n"
                  hide-details=""
                  :items="module.data.sectors"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.['sectors.' + n + '.sector_n1_id']"
                />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
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