<script setup>
import { computed, ref, onMounted } from 'vue'
import binaryToPDF from '@/components/Core/Utils/binaryToPDF.vue'
import moment from 'moment'
import { moduleStore } from '@/store'

const module = moduleStore()
const dialog = ref(false)

const props = defineProps({
  modelValue: Boolean,
  onUpdateModelValue: Function,
  signedId: Number
})

const evaluation = ref(null)
const signature = ref(null)
const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  dialog.value = false
  emit('update:modelValue', false)
}

onMounted(async () => {
  try {
    if (module.data?.signature?.id != props.signedId) {
      await module.getShow(`api/for-me/incentives/terms-to-signature/show/${props.signedId}`, [
        'signature'
      ])
    }
  } catch (error) {}
  signature.value = JSON.parse(JSON.stringify(module?.data?.signature ?? []))
  signature.value.term_file =
    signature.value.term_file == '' ? signature.value?.term?.term : signature.value.term_file
})

// const evaluation = computed(() => {
//   return [
//     {
//       name: 'NS',
//       dim: props.data.service_level?.scaled_general?.value,
//       real: props.data.service_level?.real_general?.value,
//       delta: props.data.service_level?.difference?.value
//     },
//     {
//       name: 'Receb.',
//       dim: props.data.volume?.scaled_call?.value,
//       real: props.data.volume?.real_call_received?.value,
//       delta: props.data.volume?.difference_call?.value
//     },
//     {
//       name: 'TMA',
//       dim: props.data.tma?.scaled?.value,
//       real: props.data.tma?.real_general?.value,
//       delta: props.data.tma?.difference?.value
//     },
//     {
//       name: 'Log',
//       dim: props.data.login?.scaled_agent?.value,
//       real: props.data.login?.real_agent?.value,
//       delta: props.data.login?.difference_agent?.value
//     },
//     {
//       name: 'Pausa',
//       dim: props.data.login?.scaled_break?.value,
//       real: props.data.login?.real_break?.value,
//       delta: props.data.login?.difference_break?.value
//     }
//   ]
// })
</script>
<template>
  <div v-if="module.showing" class="d-flex justify-center align-center h-100">
    <v-progress-circular :size="115" :width="4" color="primary" indeterminate></v-progress-circular>
  </div>
  <v-row v-else class="ma-0 pa-1">
    <v-col cols="7" class="py-1 px-1">
      <v-card>
        <v-card-text class="pa-0" style="height: calc(100vh - 60px)">
          <binaryToPDF
            v-if="signature?.term_file"
            :data="signature?.term_file"
            width="100%"
            height="100%"
          />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="5" class="py-0 px-1 py-1">
      <v-col class="pa-0">
        <v-card style="height: calc(100vh - 60px)">
          <div
            v-if="signature?.accept?.id != 1"
            style="height: calc(100vh - 60px)"
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
            <v-card-title class="pb-0"> Meu extrato </v-card-title>
            <v-card-subtitle class="pb-0">
              Apuração: {{ signature.term.evaluation_interval }} | Situação:
              <span :class="signature?.term?.evaluation ? 'text-blue' : 'text-red'">
                <b>{{ signature?.term?.evaluation ? 'Finalizado' : 'Em andamento' }}</b>
              </span>
            </v-card-subtitle>

            <v-card-text class="px-1 pb-2 pt-0">
              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Cesta </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-blue">
                  {{
                    signature?.evaluation_details?.basket?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })
                  }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Acelerador </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-blue">
                  {{
                    signature?.evaluation_details?.accelerator?.toLocaleString('pt-BR', {
                      style: 'percent'
                    })
                  }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Deflator </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-red">
                  {{
                    signature?.evaluation_details?.deflator?.toLocaleString('pt-BR', {
                      style: 'percent'
                    })
                  }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Eliminatorio </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-red">
                  {{
                    signature?.evaluation_details?.elimination?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })
                  }}
                </v-col>
              </v-row>

              <v-row class="ma-0 py-1">
                <v-col cols="12" sm="7" class="py-0">Teto </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-yellow-darken-2">
                  {{
                    signature?.evaluation_details?.roof?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })
                  }}
                </v-col>
              </v-row>

              <v-row class="ma-0 pt-1">
                <v-col cols="12" sm="7" class="py-0">Total </v-col>
                <v-col cols="12" sm="5" class="py-0 text-right text-blue">
                  {{
                    signature?.evaluation_details?.evaluation_value?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })
                  }}
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
                :items="signature?.evaluation_details?.indicators_results"
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
                :items="signature?.evaluation_details?.elimination_reasons"
                style="height: calc(50vh - 265px)"
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
            <v-card-subtitle class="text-center pb-3">
              Valores atualizados diariamente 24h após assinatura do termo.
            </v-card-subtitle>
          </div>
        </v-card>
      </v-col>
    </v-col>
  </v-row>
</template>