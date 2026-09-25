<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import moment from 'moment'
import { moduleStore, notifyStore } from '@/store'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'

const module = moduleStore()
const notify = notifyStore()

const props = defineProps({
  uuid: String,
  modelValue: Boolean
})

const uploadDialog = ref(false)
const currentYear = moment().year()

const filter = ref({
  year: currentYear
})

const years = computed(() => {
  const years = []
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(i)
  }
  return years
})

const form = ref({
  month_ref: moment().format('YYYY-MM'),
  report_uuid: props.uuid,
  file: null
})

const headers = ref([
  {
    title: 'Mês',
    // align: 'center',
    key: 'month_label',
    sortable: true
  },
  {
    title: 'Update',
    align: 'center',
    key: 'updated_at',
    sortable: true
  }
])

const showFiles = async () => {
  await module.getShow(
    `api/tactical-center/reports/files/show/${props.uuid}/${filter.value.year}`,
    ['report_files']
  )
}

const downloadFile = async (event, item) => {
  try {
    await module.getDownload(`/api/tactical-center/reports/files/download/${item.item.id}`)
  } catch (error) {
    console.log('download falhou')
  }
}

onMounted(async () => {
  await showFiles()
})

const submit = async () => {
  try {
    await module.setStore('api/tactical-center/reports/files/store', form.value)
    if (notify.success) {
      uploadDialog.value = false
      await showFiles()
    }
  } catch (error) {
    console.log(error)
  }
}

watch(
  () => filter,
  async () => {
    await showFiles()
  },
  { deep: true }
)
</script>
<template>
  <v-card-text class="pa-0 body">
    <v-row class="ma-0">
      <v-col cols="12" md="6" class="pa-2">
        <v-select
          v-model="filter.year"
          color="primary"
          density="compact"
          label="Ano"
          hide-details=""
          variant="outlined"
          item-title="name"
          item-value="id"
          :items="years"
        />
      </v-col>
      <v-col cols="12" md="4" class="pa-2">
        <v-btn
          v-if="module?.data?.isOwner"
          :loading="module.storing || module.downloading"
          title=""
          class="bg-brand_verde_dark"
          color="white"
          prepend-icon="mdi-upload"
          @click="uploadDialog = true"
        >
          Upload
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
    <v-row class="ma-0">
      <v-col cols="12" md="12" class="px-2">
        <div
          v-if="module.showing || module.downloading"
          class="d-flex justify-center align-center loading"
        >
          <v-progress-circular
            :size="115"
            :width="4"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>

        <v-data-table-virtual
          v-else
          :headers="headers"
          :items="module.data.report_files"
          :loading="module.loading"
          fixed-header
          density="compact"
          class="elevation-0"
          @click:row="downloadFile"
        >
          <template #[`item.month_label`]="{ item }">
            <v-icon icon="mdi-download" /> {{ item.month_label }}
          </template>
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-card-text>

  <CoreDialog
    v-model="uploadDialog"
    header-icon="mdi-upload"
    header-title="Upload"
    body-class="overflow-auto overflow-x-hidden bg-dialog pa-2 "
    headerheight="35px"
    max-width="300px"
    maxHeight="600px"
    header-class="bg-brand_verde_dark"
  >
    <form @submit.prevent="submit">
      <v-card-text class="pa-1">
        <v-row>
          <v-col cols="12" class="pb-1">
            <v-text-field
              v-model="form.month_ref"
              class="w-100"
              density="compact"
              color="primary"
              label="Data"
              hide-details=""
              variant="outlined"
              type="month"
            >
              &nbsp;
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-1">
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
            ></v-file-input>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-2">
        <v-spacer></v-spacer>
        <v-btn
          :loading="module.storing"
          title=""
          class="bg-brand_verde_dark"
          color="white"
          append-icon="mdi-content-save"
          type="submit"
        >
          Gravar
        </v-btn>
      </v-card-actions>
    </form>
  </CoreDialog>
</template>

<style scoped>
.body {
  height: 550px;
}

.loading {
  height: 450px;
}
/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: 480px;
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
