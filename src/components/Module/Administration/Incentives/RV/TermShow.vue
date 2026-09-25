<script setup>
import { computed, ref, onMounted } from 'vue'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import binaryToPDF from '@/components/Core/Utils/binaryToPDF.vue'
import TermUpdate from '@/components/Module/Administration/Incentives/RV/TermUpdate.vue'
import { moduleStore } from '@/store'
const mailDomain = import.meta.env.VITE_MAIL_DOMAIN

const module = moduleStore()
const dialog = ref(false)

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  dialog.value = false
  emit('update:modelValue', false)
}

const props = defineProps({
  modelValue: Boolean,
  onUpdateModelValue: Function,
  id: Number
})

const data = computed(() => {
  return {
    monthRef: module?.data?.term?.month_ref,
    sectorN1: module?.data?.term?.sector_n1,
    sectorN2: module?.data?.term?.sector_n2,
    level: module?.data?.term?.level,
    position: module?.data?.term?.position,
    payment: module?.data?.term?.payment,
    owner: module?.data?.term?.owner,
    approvedMeta: module?.data?.term?.approved_meta,
    approvedAt: module?.data?.term?.approved_at,
    statusLabel: module?.data?.term?.status_label,
    term: module?.data?.term?.term,
    accelerator: module?.data?.term?.accelerator
  }
})

onMounted(async () => {
  try {
    if (module.data?.term?.id === props.id) {
    } else {
      await module.getShow(`/api/administration/incentives/rv/terms/show/${props.id}`, ['term'])
    }
  } catch (error) {}
})
</script>
<template>
  <v-row class="ma-0">
    <v-col sm="8">
      <v-card>
        <v-card-text class="pa-0" style="height: calc(100vh - 70px)">
          <binaryToPDF :data="module?.data?.term?.term" width="100%" height="100%" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col sm="4" class="pl-1">
      <v-card style="height: calc(100vh - 70px)">
        <v-card-title> Termo </v-card-title>
        <v-card-text class="px-1 py-1">
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Referência: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right">
              {{ data?.monthRef }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Setor: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ data?.sectorN1?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Sub-setor: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ data?.sectorN2?.name }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Público: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ data?.position?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="8" class="py-0">Tempo de casa: </v-col>
            <v-col cols="12" sm="4" class="py-0 text-right text-truncate">
              {{ data?.level?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="3" class="py-0">Método: </v-col>
            <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
              {{ data?.payment?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Responsável: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              <a
                :href="
                  'mailto:' +
                  data?.owner?.username +
                  '@' + mailDomain + '?subject=Ahtlas RV - Termo ' +
                  data?.term_name
                "
              >
                {{ data?.owner?.name }}
              </a>
            </v-col>
          </v-row>
          <v-divider color="#f7f2f2" length="3"></v-divider>
        </v-card-text>

        <v-card-title> Meta dados - Aprovação</v-card-title>
        <v-card-text class="px-1 py-1 overflow-auto" style="height: calc(100vh - 425px)">
          <div v-if="data?.approvedMeta">
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Status: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.statusLabel }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Data: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedAt }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Usuário: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.user?.name }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Cargo: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.user?.position_summary }}
              </v-col>
            </v-row>

            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="4" class="py-0">IP: </v-col>
              <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.ip }}
              </v-col>
            </v-row>

            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="2" class="py-0">Host: </v-col>
              <v-col cols="12" sm="10" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.hostname }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Browser: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.browser_name }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">SO: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.platform_name }}
              </v-col>
            </v-row>

            <v-divider color="#f7f2f2" length="3"></v-divider>
          </div>
        </v-card-text>
        <v-card-actions class="px-0 bg-transparent">
          <v-row class="ma-0">
            <v-col cols="6" class="pa-1">
              <v-btn block rounded="0" class="px-4" color="light-blue-accent-4" variant="outlined">
                Simular
              </v-btn>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-btn
                block
                rounded="0"
                class="px-4"
                color="amber-accent-4"
                variant="outlined"
                @click="dialog = true"
              >
                Editar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
        <!-- <v-card-title> Termo </v-card-title>
        <v-card-text class="px-1 py-1">
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Referência: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right">
              {{ data?.dateRef }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Setor: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ data?.sectorN1?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Sub-setor: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ data?.sectorN2?.name }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Público: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              {{ data?.position }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="8" class="py-0">Tempo de casa: </v-col>
            <v-col cols="12" sm="4" class="py-0 text-right text-truncate">
              {{ data?.level }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="3" class="py-0">Método: </v-col>
            <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
              {{ data?.payment?.label }}
            </v-col>
          </v-row>
          <v-row class="ma-0 py-1">
            <v-col cols="12" sm="4" class="py-0">Responsável: </v-col>
            <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
              <a
                :href="
                  'mailto:' +
                  data?.owner?.username +
                  '@' + mailDomain + '?subject=Ahtlas RV - Termo ' +
                  data?.term_name
                "
              >
                {{ data?.owner?.name }}
              </a>
            </v-col>
          </v-row>
          <v-divider color="#f7f2f2" length="3"></v-divider>
        </v-card-text>
        <v-card-title> Meta dados</v-card-title>
        <v-card-text class="px-1 py-1 overflow-auto" style="height: calc(100vh - 425px)">
          <div v-if="data?.approvedMeta">
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Status: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.statusLabel }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Data: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedAt }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Usuário: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.user?.name }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Cargo: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.user?.position_summary }}
              </v-col>
            </v-row>

            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="4" class="py-0">IP: </v-col>
              <v-col cols="12" sm="8" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.ip }}
              </v-col>
            </v-row>

            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="2" class="py-0">Host: </v-col>
              <v-col cols="12" sm="10" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.hostname }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">Browser: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.browser_name }}
              </v-col>
            </v-row>
            <v-row class="ma-0 py-1">
              <v-col cols="12" sm="3" class="py-0">SO: </v-col>
              <v-col cols="12" sm="9" class="py-0 text-right text-truncate">
                {{ data?.approvedMeta?.platform_name }}
              </v-col>
            </v-row>

            <v-divider color="#f7f2f2" length="3"></v-divider>
          </div>
        </v-card-text>
        <v-card-actions class="px-0 bg-transparent">
          <v-row class="ma-0">
            <v-col cols="6" class="pa-1">
              <v-btn block rounded="0" class="px-4" color="light-blue-accent-4" variant="outlined">
                Simular
              </v-btn>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-btn
                block
                rounded="0"
                class="px-4"
                color="amber-accent-4"
                variant="outlined"
                @click="dialog = true"
              >
                Editar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions> -->
      </v-card>
    </v-col>
  </v-row>
  <CoreDialog
    v-model="dialog"
    header-icon="mdi-file-document-edit-outline"
    header-title="Editar - Termo"
    body-class="overflow-auto overflow-x-hidden pa-2"
    headerheight="35px"
    header-class="bg-brand_roxo2"
    :dialogFullscreen="true"
  >
    <TermUpdate v-model="dialog" />
  </CoreDialog>
</template>
