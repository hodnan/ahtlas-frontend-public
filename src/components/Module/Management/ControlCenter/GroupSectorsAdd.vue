<script setup>
import { ref } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const form = ref({
  name: '',
  sectors: []
})

const addSector = () => {
  // Adicionar um novo objeto vazio ao array form.sectors
  form.value.sectors.push({
    sector_n1_id: null
  })
}

const removeSector = (index) => {
  // Remover o item do array com o índice especificado
  form.value.sectors.splice(index, 1)
}

const submit = async () => {
  try {
    await module.setStore(`api/management/control-center/group/store`, form.value)
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
        <v-col class="pa-0" cols="12">
          <v-text-field
            v-model="form.name"
            color="primary"
            density="compact"
            label="Nome do grupo"
            variant="outlined"
            hide-details=""
            :error-messages="notify?.errors?.name"
          />
        </v-col>
      </v-row>

      <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
        <v-card-text class="bg-brand_verde_dark py-1 d-flex">
          <span class="py-1"> Setores relacionados </span>
          <v-spacer />
          <v-btn
            icon="mdi-plus"
            rounded="0"
            elevation="0"
            color="transparent"
            density="compact"
            @click="addSector"
          ></v-btn>
        </v-card-text>

        <v-card-text class="pa-1 overflow-auto" style="height: calc(100vh - 370px)">
          <v-row
            v-for="(item, n) in form.sectors"
            :key="n"
            class="ma-0"
            style="height: 52.38px !important"
          >
            <v-col cols="12" class="pa-1">
              <div class="d-inline-flex w-100">
                <v-autocomplete
                  v-model="form.sectors[n].sector_n1_id"
                  color="primary"
                  class="sectors_select mr-2 w-25"
                  density="compact"
                  variant="outlined"
                  :label="'Setor: ' + n"
                  hide-details=""
                  clearable
                  :items="module.data.sectors"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.['sectors.' + n + '.sector_n1_id']"
                />

                <v-btn
                  icon="mdi-minus"
                  rounded="0"
                  class="my-auto"
                  elevation="0"
                  color="transparent"
                  density="compact"
                  @click="removeSector(n)"
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