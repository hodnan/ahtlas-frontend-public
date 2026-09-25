<script setup>
import { ref, onMounted } from 'vue'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const urlParams = new URLSearchParams(window.location.search)

const filter = ref({
  username: urlParams.get('username') ?? null
})

onMounted(async () => {
  await module.setUrlParams(filter.value)
})

const headers = ref([
  {
    title: 'Mês',
    align: 'left',
    key: 'month_ref'
  },
  {
    title: 'Termo',
    align: 'left',
    key: 'term.term_name'
  },

  {
    title: 'Disponível em',
    align: 'left',
    key: 'available_at'
  },
  {
    title: 'Assinado em',
    align: 'left',
    key: 'accepted_at'
  },
  {
    title: 'Status',
    align: 'center',
    key: 'accept.label',
    width: '150'
  }
])

const submit = async () => {
  await module.setUrlParams(filter.value)
  await module.getDataPart(
    'api/administration/incentives/rv/terms-query',
    ['employee', 'terms'],
    filter.value
  )
}
const submitDownload = async () => {
  try {
    await module.getDownload(
      `/api/administration/incentives/rv/terms-query/${filter.value.username}`,
      filter.value
    )
  } catch (error) {}
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-card>
      <v-card-text class="pa-2 py-1">
        <v-row class="ma-0">
          <v-col class="pa-1" cols="2">
            <v-text-field
              v-model="filter.username"
              density="compact"
              color="primary"
              label="Matícula"
              hide-details
              variant="outlined"
              :error-messages="notify?.errors?.username"
            />
          </v-col>

          <v-col cols="1" class="pa-1">
            <v-btn class="w-100" style="height: 40px" type="submit">Buscar</v-btn>
          </v-col>

          <v-col cols="9" class="pa-0 pl-3 d-flex align-center">
            <v-list v-show="module.data.employee" class="py-0 px-2 user_card bg-transparent">
              <v-list-item class="pa-0" density="compact">
                <template v-slot:prepend>
                  <v-avatar size="35px">
                    <img
                      v-if="module.data.employee.avatar?.avatar"
                      :src="'data:image/jpeg;base64,' + module.data.employee.avatar?.avatar"
                      width="35"
                      alt=""
                    />
                    <img v-else src="/assets/avatar/default.jpg" width="35" alt="" />
                  </v-avatar>
                </template>
                <template v-slot:title>
                  <div class="text-truncate">
                    {{ module.data.employee.name }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </form>

  <v-card class="mt-3 pb-4">
    <v-card-text class="d-flex pa-2">
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">Termos</div>
      <v-spacer />
      <div class="pt-1 px-3 text-brand_txt" style="min-width: 120px">
        Registros: {{ module.data?.terms?.length }}
      </div>

      <v-btn
        density="comfortable"
        color="brand_roxo2"
        @click="submitDownload()"
        :loading="module.downloading"
      >
        <v-icon icon="mdi-download" />
      </v-btn>
    </v-card-text>
    <v-card-text class="py-0 pa-2">
      <v-data-table-virtual
        :headers="headers"
        :items="module.data.terms"
        :loading="module.loading"
        fixed-header
        density="compact"
        class="elevation-0"
      >
        <template #[`item.accept.label`]="{ item }">
          <v-chip :class="'bg-' + item.accept.color" size="small">
            {{ item.accept.label }}
          </v-chip>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>
<style scoped>
:deep(.v-field__input) {
  max-height: 38px !important;
  overflow: hidden;
}
ul {
  list-style-type: none;
}

/* v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th */
:deep(.v-table__wrapper table thead tr th) {
  background-color: #08544c !important;
  color: #eeebeb !important;
  padding-left: 32px;
  height: 30px !important;
}

:deep(.v-table__wrapper) {
  height: calc(100vh - 222px);
}

:deep(.v-table__wrapper table thead tr th:hover) {
  color: #eeebeb !important;
}
</style>
