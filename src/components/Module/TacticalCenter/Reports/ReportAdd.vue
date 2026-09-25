<script setup>
import { computed, ref, watch } from 'vue'
import { moduleStore, notifyStore } from '@/store'
import CoreDialog from '@/components/Core/Utils/Dialog.vue'

const module = moduleStore()
const notify = notifyStore()
const urlView = ref(false)

const emit = defineEmits(['update:modelValue'])

const closeDialog = () => {
  emit('update:modelValue', false)
}

const props = defineProps({
  modelValue: Boolean
})

const form = ref({
  title: null,
  type: null,
  group: null,
  schedule_time: null,
  file: null,
  url: null,
  atd: null,
  interval_type: null,
  interval_values: [],
  owners: [],
  active: 1,
  notes: null
})

const intervalValues = ref([])

const reportTypes = computed(() => {
  return module.data.reportTypes.filter((item) => {
    if (item.id != null) {
      return item
    }
  })
})

const reportGroups = computed(() => {
  return module.data?.groups.filter((item) => {
    if (item.id) {
      return item
    }
  })
})

const statuses = computed(() => {
  return module.data.statuses.filter((item) => {
    if (item.id != null) {
      return item
    }
  })
})

const firstName = (v) => {
  const first = v.split(' ')
  return first[0]
}

function loadValues(id) {
  form.value.interval_values = []
  const temp = module.data.intervals.find((item) => {
    if (item.id === id) {
      return item
    }
  })
  intervalValues.value = temp.data
}

watch(
  () => form.value.interval_type,
  () => {
    loadValues(form.value.interval_type)
  }
)
watch(
  () => form.value.type,
  () => {
    if (form.value.type == 2) {
      form.value.file = null
    }
    if (form.value.type == 1) {
      form.value.url = null
    }
  }
)

const viewUrl = () => {
  urlView.value = true
}

const submit = async () => {
  try {
    await module.setStore('api/tactical-center/reports/store', form.value)
    if (notify.success) {
      closeDialog()
      await module.getDataPart('api/tactical-center/reports', ['reports'])
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-2 pt-0">
      <v-row class="ma-0">
        <v-col class="pa-1 pt-2" cols="8">
          <v-text-field
            v-model="form.title"
            color="primary"
            density="compact"
            label="Título"
            variant="outlined"
            hide-details=""
            placeholder=""
            :error-messages="notify?.errors?.title"
          />
        </v-col>
        <v-col class="pa-1 pt-2" cols="4">
          <v-autocomplete
            v-model="form.type"
            density="compact"
            class="inputH40"
            label="Tipo"
            color="primary"
            hide-details=""
            variant="outlined"
            hide-spin-buttons
            :items="reportTypes"
            item-title="label"
            item-value="id"
            :error-messages="notify?.errors?.type"
          >
            <template #selection="{ item, index }">
              <v-chip
                class="rounded-0"
                size="large"
                variant="text"
                :key="index"
                :prepend-icon="item.raw.icon"
              >
                {{ item.raw.label }}
              </v-chip>
            </template>

            <template #item="{ props, item }">
              <v-list-item class="px-2 py-0">
                <v-chip
                  v-bind="props"
                  class="rounded-0 w-100"
                  size="large"
                  variant="text"
                  :prepend-icon="item.raw.icon"
                >
                  {{ item.raw.label }}
                </v-chip>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col class="pa-1" cols="4">
          <v-autocomplete
            v-model="form.group"
            color="primary"
            density="compact"
            variant="outlined"
            hide-details=""
            label="Grupo"
            :items="reportGroups"
            item-title="label"
            item-value="id"
            :error-messages="notify?.errors?.group"
          />
        </v-col>

        <v-col class="pa-1" cols="4">
          <v-text-field
            v-model="form.schedule_time"
            color="primary"
            density="compact"
            label="Carga Prevista"
            type="time"
            variant="outlined"
            hide-details=""
            placeholder=""
            :error-messages="notify?.errors?.schedule_time"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="4">
          <v-text-field
            v-model="form.atd"
            color="primary"
            density="compact"
            label="TMD"
            type="time"
            variant="outlined"
            hide-details=""
            placeholder=""
            :error-messages="notify?.errors?.atd"
          >
            &nbsp;
          </v-text-field>
        </v-col>
        <v-col class="pa-1" cols="4">
          <v-autocomplete
            v-model="form.interval_type"
            color="primary"
            density="compact"
            variant="outlined"
            hide-details=""
            label="Tipo de Intervalo"
            :items="module.data.intervals"
            item-title="label"
            item-value="id"
            :error-messages="notify?.errors?.interval_type"
          />
        </v-col>

        <v-col class="pa-1" cols="8">
          <v-autocomplete
            v-model="form.interval_values"
            color="primary"
            class="inputH40"
            density="compact"
            variant="outlined"
            hide-details=""
            label="Intervalos"
            :items="intervalValues"
            item-title="label"
            return-object
            multiple
            closable-chips
            chips
            :error-messages="notify?.errors?.interval_values"
          />
        </v-col>

        <v-col class="pa-1" cols="8">
          <v-autocomplete
            v-model="form.owners"
            density="compact"
            label="Responsáveis"
            color="primary"
            class="inputH40"
            :items="module.data.owners"
            hide-details=""
            variant="outlined"
            item-title="label"
            item-value="username"
            hide-spin-buttons
            clearable
            multiple
            closable-chips
            chips
            :error-messages="notify?.errors?.owners"
          >
            <template #chip="{ props, item, index }">
              <v-chip
                v-bind="props"
                class="rounded-0"
                variant="text"
                :key="index"
                :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
              >
                {{ firstName(item.raw.name) }}
              </v-chip>
            </template>

            <template #item="{ props, item }">
              <v-list-item
                v-bind="props"
                :subtitle="item.raw.position_summary + ' | ' + item.raw.username"
                :title="item.raw.name"
              >
                <template v-slot:prepend>
                  <v-avatar>
                    <img :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar" width="40" />
                  </v-avatar>
                </template>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col class="pa-1" cols="4">
          <v-autocomplete
            v-model="form.active"
            color="primary"
            density="compact"
            label="Status"
            hide-details=""
            variant="outlined"
            item-title="name"
            item-value="id"
            :items="statuses"
            :error-messages="notify?.errors?.active"
          />
        </v-col>
        <v-col v-if="form.type == 1" class="pa-1" cols="12">
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
        <v-col v-if="form.type == 2" class="pa-1" cols="12">
          <v-text-field
            v-model="form.url"
            color="primary"
            class="append-action"
            density="compact"
            label="URL"
            variant="outlined"
            hide-details=""
            placeholder=""
            append-inner-icon="mdi-presentation"
            :error-messages="notify?.errors?.url"
            @click:append-inner.stop="viewUrl()"
          >
            &nbsp;
          </v-text-field>
        </v-col>

        <v-col class="pa-1" cols="12">
          <v-textarea
            v-model="form.notes"
            label="Observações"
            color="primary"
            density="compact"
            variant="outlined"
            hide-details=""
            rows="3"
            :error-messages="notify?.errors?.notes"
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="px-4">
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
  <CoreDialog
    v-model="urlView"
    header-icon="mdi-presentation"
    :header-title="form.title"
    body-class="overflow-hidden bg-dialog pa-0 "
    :dialog-fullscreen="true"
    header-class="bg-brand_roxo1"
  >
    <iframe
      class="mb-16"
      width="100%"
      height="100%"
      :src="form.url"
      frameborder="0"
      allowFullScreen="true"
    />
    <div class="footer bg-brand_roxo1"></div>
  </CoreDialog>
</template>

<style scoped>
.inputH40 :deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
}
.append-action :deep(.v-field__append-inner) {
  background-color: rgba(0, 0, 0, 0.2) !important;
  padding: 0 10px !important;
  margin-right: -12px !important;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.footer {
  position: absolute;
  bottom: 0;
  background-color: aqua;
  width: 100%;
  height: 40px;
}
</style>
