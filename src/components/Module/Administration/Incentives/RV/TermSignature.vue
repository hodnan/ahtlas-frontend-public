<script setup>
import { ref, onMounted } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import binaryToPDF from '@/components/Core/Utils/binaryToPDF.vue'
import moment from 'moment'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()
const dialog = ref(false)

const props = defineProps({
  modelValue: Boolean,
  onUpdateModelValue: Function,
  id: Number,
  signedId: Number
})

const form = ref({
  accept: null,
  signature: props.signedId
})
const confirmText = ref(false)
const confirmClass = ref('')

const signature = ref(null)
const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  dialog.value = false
  emit('update:modelValue', false)
}

onMounted(async () => {
  await module.getShow(`api/for-me/incentives/terms-to-signature/show/${props.signedId}`, [
    'signature'
  ])

  signature.value = JSON.parse(JSON.stringify(module?.data?.signature ?? []))

  signature.value.term_file =
    signature.value.term_file == '' ? signature.value?.term?.term : signature.value.term_file
})

const openDialog = (n) => {
  form.value.accept = n
  confirmText.value = n == 1 ? 'ACEITAR' : 'REJEITAR'
  confirmClass.value = n == 1 ? 'bg-teal' : 'bg-error'
  dialog.value = true
}

const submit = async () => {
  try {
    await module.setStore(
      `api/for-me/incentives/terms-to-signature/update/${props.signedId}`,
      form.value
    )
    if (notify.success) {
      dialog.value = false
      closeDialog()
      await module.getDataPart('api/for-me/incentives/terms-to-signature', ['terms'])
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div v-if="module.showing" class="d-flex justify-center align-center h-100">
    <v-progress-circular :size="115" :width="4" color="primary" indeterminate></v-progress-circular>
  </div>
  <v-row v-else class="ma-0 pa-1">
    <v-col cols="12" md="12" class="py-1 px-1">
      <v-card>
        <v-card-text class="pa-0" style="height: calc(100vh - 130px)">
          <binaryToPDF
            v-if="signature?.term_file"
            :data="signature?.term_file"
            width="100%"
            height="100%"
          />
        </v-card-text>

        <v-card-actions class="px-1 bg-transparent">
          <v-row v-if="signature?.month_ref != moment().format('YYYY-MM')" class="ma-0">
            <v-col cols="12" class="pa-1 pb-2 text-center text-h6">
              Assinatura indisponível fora do mês de referência
            </v-col>
          </v-row>

          <v-row v-else class="ma-0">
            <v-col cols="6" class="pa-1">
              <v-btn
                :loading="module.storing"
                block
                rounded="0"
                class="px-4"
                color="teal"
                variant="flat"
                @click="openDialog(1)"
                :disabled="signature?.accept?.id != null"
              >
                Aceitar
              </v-btn>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-btn
                :loading="module.storing"
                block
                rounded="0"
                class="px-4"
                color="red-darken-2"
                variant="flat"
                @click="openDialog(0)"
                :disabled="signature?.accept?.id != null"
              >
                REJEITAR
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
    <!-- <v-col cols="12" md="5" class="py-0 px-1 py-1">
      <v-col class="pa-0">
        <v-card style="height: calc(100vh - 70px)">
          <div
            v-if="signature?.accept?.id != 1"
            style="height: calc(100vh - 70px)"
            class="d-flex justify-center align-center bg-surface-variant"
          >
            <div>
              <div class="text-h6 text-center px-10 py-4">
                Aqui, você acompanha diariamente sua evolução.
              </div>
              <div class="text-subtitle-2 text-center">
                *Dados disponíveis 24h após <b class="text-teal">ACEITE</b> do termo.
              </div>
            </div>
          </div>
          
          <div v-else>
            <v-card-title>
              Meu extrato
              <b class="text-red"> (Valores parciais) </b>
            </v-card-title>

            <v-card-text class="px-1 pb-2">
              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Produtividade </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-blue">
                  {{ evaluation.basket }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Acelerador </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-blue">
                  {{ evaluation.accelerator }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Deflator </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-red">
                  {{ evaluation.deflator }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Eliminatorio </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-red">
                  {{ evaluation.elimination }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Teto </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-yellow-darken-2">
                  {{ evaluation.roof }}
                </v-col>
              </v-row>

              <v-row class="ma-0 pt-1">
                <v-col cols="12" sm="7" class="py-0">Total </v-col>
                <v-col cols="12" sm="5" :class="evaluation.evaluation_value_color">
                  {{ evaluation.evaluation_value }}
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-text class="px-1 py-1">
              <v-row class="ma-0 pr-2 bg-primary">
                <v-col cols="12" sm="7" class="py-2 text-center"> Indicador </v-col>
                <v-col cols="12" sm="2" class="py-2 text-center"> Média </v-col>
                <v-col cols="12" sm="3" class="py-2 text-center"> Resultado </v-col>
              </v-row>
              <v-divider color="#f7f2f2" length="3"></v-divider>

              <v-virtual-scroll
                :items="evaluation.indicators_results"
                style="height: calc(50vh - 145px)"
                class=""
              >
                <template #default="{ item }">
                  <v-row class="mx-0 my-1">
                    <v-col cols="12" sm="7" class="py-1 d-inline-block text-truncate">
                      {{ item?.name }}
                    </v-col>
                    <v-col cols="12" sm="2" class="py-1 text-right">
                      {{
                        item?.avarage?.toLocaleString('pt-BR', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2
                        })
                      }}
                    </v-col>
                    <v-col cols="12" sm="3" class="py-1 text-right">
                      {{
                        item?.value?.toLocaleString('pt-BR', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2
                        })
                      }}
                    </v-col>
                  </v-row>
                </template>
              </v-virtual-scroll>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-title> Motivos de eliminação </v-card-title>

            <v-card-text class="px-1 pb-1">
              <v-virtual-scroll
                :items="evaluation.elimination_reasons"
                style="height: calc(50vh - 269px)"
                class="px-1"
              >
                <template #default="{ item }">
                  <v-row class="ma-0">
                    <v-col cols="12" sm="12" class="py-1">
                      {{ item?.name }}
                    </v-col>
                  </v-row>
                </template>
              </v-virtual-scroll>
            </v-card-text>
            <v-card-subtitle>
              Valores atualizados diariamente 24h após assinatura do termo.
            </v-card-subtitle>
          </div> 
        </v-card>
      </v-col>
    </v-col> -->
  </v-row>
  <CoreDialog
    v-model="dialog"
    header-icon="mdi-alert-outline"
    :header-title="confirmText + ' TERMO'"
    headerheight="35px"
    max-width="600px"
    card-class="bg-white"
    :header-class="confirmClass"
  >
    <v-card-text>
      <p>
        Você está prestes a
        <i :class="confirmClass">
          <b> {{ confirmText }} </b>
        </i>
        o termo. Gostaria de prosseguir?
      </p>
    </v-card-text>
    <v-card-actions class="px-4 bg-transparent">
      <v-row class="ma-0">
        <v-col cols="6">
          <v-btn
            :loading="module.storing"
            block
            rounded="0"
            class="px-4"
            color="teal"
            variant="outlined"
            @click="submit()"
            :disabled="signature?.accept?.id != null"
          >
            Confirmar
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn
            :loading="module.storing"
            block
            rounded="0"
            class="px-4"
            color="red-darken-2"
            variant="outlined"
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </CoreDialog>
</template>
