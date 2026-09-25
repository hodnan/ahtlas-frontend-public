<script setup>
import { computed, ref, onMounted } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import binaryToPDF from '@/components/Core/Utils/binaryToPDF.vue'
import moment from 'moment'
import { moduleStore } from '@/store'
const mailDomain = import.meta.env.VITE_MAIL_DOMAIN

const module = moduleStore()
const dialog = ref(false)

const props = defineProps({
  modelValue: Boolean,
  onUpdateModelValue: Function,
  id: Number
})

const form = ref({
  status: null
})
const confirmText = ref(false)
const confirmClass = ref('')

const term = ref(null)
const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  dialog.value = false
  emit('update:modelValue', false)
}

onMounted(async () => {
  try {
    if (module.term?.id === props.id) {
    } else {
      await module.getShow(`/api/administration/incentives/rv/terms/show/${props.id}`, ['term'])
      term.value = JSON.parse(JSON.stringify(module?.data?.term ?? []))
    }
  } catch (error) {}
})

const openDialog = (n) => {
  form.value.status = n
  confirmText.value = n == 2 ? 'APROVAR' : 'REPROVAR'
  confirmClass.value = n == 2 ? 'bg-teal' : 'bg-error'
  dialog.value = true
  console.log(form.value)
}

const submit = async () => {
  try {
    await module.setStore(`api/management/myteam/terms-to-approve/update/${props.id}`, form.value)
    if (notify.success) {
      dialog.value = false
      closeDialog()
      await module.getDataPart('api/management/myteam/terms-to-approve', ['terms'])
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
    <v-col cols="12" md="7" class="py-1 px-1">
      <v-card>
        <v-card-text class="pa-0" style="height: calc(100vh - 120px)">
          <binaryToPDF v-if="term?.term" :data="term?.term" width="100%" height="100%" />
        </v-card-text>
        <v-card-actions class="px-1 bg-transparent">
          <v-row
            v-if="
              !moment().startOf('month').isSameOrBefore(moment(term?.month_ref).startOf('month'))
            "
            class="ma-0"
          >
            <v-col cols="12" class="pa-1 pb-2 text-center text-h6">
              Termo fora do período de aprovação
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
                @click="openDialog(2)"
                :disabled="term?.status?.id != 1"
              >
                Aprovar
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
                @click="openDialog(3)"
                :disabled="term?.status?.id != 1"
              >
                REPROVAR
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="5" class="py-0 px-1 py-1">
      <v-card>
        <v-card-title> Termo </v-card-title>
        <v-card-text class="px-1 py-1">
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Referência: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right">
              {{ term?.month_ref }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Setor: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ term?.sector_n1?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Sub-setor: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ term?.sector_n2?.name }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Público: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ term?.position?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="8" class="py-0">Tempo de casa: </v-col>
            <v-col cols="12" sm="4" class="py-0 text-right text-truncate">
              {{ term?.level?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="3" class="py-0">Método: </v-col>
            <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
              {{ term?.payment?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Responsável: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              <a
                :href="
                  'mailto:' +
                  term?.owner?.username +
                  '@' + mailDomain + '?subject=Ahtlas RV - Termo ' +
                  term?.term_name
                "
              >
                {{ term?.owner?.name }}
              </a>
            </v-col>
          </v-row>
          <v-divider color="#f7f2f2" length="3"></v-divider>
        </v-card-text>

        <v-card-title> Meta dados - Aprovação</v-card-title>
        <v-card-text class="px-1 py-1 overflow-auto" style="height: calc(100vh - 360px)">
          <div v-if="term?.approved_meta">
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Status: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ term?.status.label }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Data: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ term?.approved_at }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Usuário: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ term?.approved_meta?.user?.name }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Cargo: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ term?.approved_meta?.user?.position_summary }}
              </v-col>
            </v-row>

            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="4" class="py-0">IP: </v-col>
              <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
                {{ term?.approved_meta?.ip }}
              </v-col>
            </v-row>

            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="2" class="py-0">Host: </v-col>
              <v-col cols="12" sm="10" class="py-0 text-right text-truncate">
                {{ term?.approved_meta?.hostname }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Browser: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ term?.approved_meta?.browser_name }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">SO: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ term?.approved_meta?.platform_name }}
              </v-col>
            </v-row>

            <v-divider color="#f7f2f2" length="3"></v-divider>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
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
