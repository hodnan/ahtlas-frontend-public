<script setup>
import { ref } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

// const emit = defineEmits(['update:modelValue'])

// const closeDialog = () => {
//   emit('update:modelValue', false)
// }

const form = ref({
  title: null,
  route: 1,
  external_link: null,
  is_percent: null,
  symbol: null,
  calc: null,
  notes: null
})

const submit = async () => {
  try {
    console.log('error')
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-row class="pa-0 ma-0">
      <v-col cols="6" class="pa-1 pt-3">
        <v-card-text class="pa-1">
          <v-row class="ma-0">
            <v-col class="pa-1" cols="6">
              <v-text-field
                v-model="form.start"
                color="primary"
                density="compact"
                label="Data Início"
                variant="outlined"
                type="date"
                hide-details=""
                placeholder=""
                :error-messages="notify?.errors?.name"
              >
                &nbsp;
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="6">
              <v-text-field
                v-model="form.end"
                color="primary"
                density="compact"
                label="Data Fim"
                variant="outlined"
                type="date"
                hide-details=""
                placeholder=""
                :error-messages="notify?.errors?.name"
              >
                &nbsp;
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12">
              <v-text-field
                v-model="form.title"
                color="primary"
                density="compact"
                label="Título"
                variant="outlined"
                hide-details=""
                placeholder=""
                :error-messages="notify?.errors?.name"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="12">
              <v-textarea
                v-model="form.notes"
                label="Mensagem"
                color="primary"
                density="compact"
                variant="outlined"
                hide-details=""
                rows="2"
                :error-messages="notify?.errors?.notes"
              />
            </v-col>
            <v-col class="pa-1" cols="12">
              <v-text-field
                v-model="form.route"
                color="primary"
                density="compact"
                label="Rota"
                variant="outlined"
                hide-details=""
                placeholder=""
                :error-messages="notify?.errors?.name"
              />
            </v-col>
            <v-col class="pa-1" cols="12">
              <v-text-field
                v-model="form.external_link"
                color="primary"
                density="compact"
                label="Link externo"
                variant="outlined"
                hide-details=""
                placeholder=""
                :error-messages="notify?.errors?.name"
              />
            </v-col>
            <v-col cols="12" class="pa-1">
              <v-file-input
                color="primary"
                density="compact"
                label="Imagem"
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
      </v-col>

      <v-col cols="6" class="pa-1 pt-4">
        <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
          <v-card-text class="bg-brand_verde_dark py-1 d-flex">
            <span class="py-1"> Público Alvo </span>
            <v-spacer />
          </v-card-text>

          <v-card-text class="pa-1" style="height: calc(100vh - 470px)">
            <v-row class="ma-0" style="height: 52.38px !important">
              <v-col cols="12" class="pa-1">
                <v-autocomplete
                  v-model="form.indicator"
                  color="primary"
                  density="compact"
                  label="Setor"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col cols="12" class="pa-1">
                <v-autocomplete
                  v-model="form.indicator"
                  color="primary"
                  density="compact"
                  label="Gestor"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col cols="12" class="pa-1">
                <v-autocomplete
                  v-model="form.indicator"
                  color="primary"
                  density="compact"
                  label="Hierarquia"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>

              <v-col cols="6" class="pa-1">
                <v-autocomplete
                  v-model="form.indicator"
                  color="primary"
                  density="compact"
                  label="UF"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col cols="6" class="pa-1">
                <v-autocomplete
                  v-model="form.indicator"
                  color="primary"
                  density="compact"
                  label="Staff"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
              <v-col cols="12" class="pa-1">
                <v-autocomplete
                  v-model="form.indicator"
                  color="primary"
                  density="compact"
                  label="Cargo"
                  hide-details=""
                  variant="outlined"
                  item-title="label"
                  item-value="id"
                  :error-messages="notify?.errors?.active"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
