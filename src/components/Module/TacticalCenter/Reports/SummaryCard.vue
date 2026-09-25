<script setup>
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import ReportUpdate from '@/components/Module/TacticalCenter/Reports/ReportUpdate.vue'
import ReportShow from '@/components/Module/TacticalCenter/Reports/ReportShow.vue'
import { moduleStore } from '@/store'
const mailDomain = import.meta.env.VITE_MAIL_DOMAIN

const module = moduleStore()
const props = defineProps({
  report: Object
})

const urlView = ref(false)
const urlData = ref()
const dialogUpdate = ref(false)
const dialogShow = ref(false)
const updateId = ref(false)
const loading = ref(false)

const openData = async (item) => {
  if (item.type.id == 1) {
    try {
      loading.value = true
      await module.getDownload(`/api/tactical-center/reports/download/${item.uuid}`)
      loading.value = false
    } catch (error) {
      loading.value = false
    }
  }
  if (item.type.id == 2) {
    urlView.value = true
    urlData.value = item
  }
  if (item.type.id == 3 || item.type.id == 4) {
    dialogShow.value = true
    loading.value = true

    loading.value = false
  }
}

const updateOpen = (item) => {
  // updateId.value = item.uuid
  dialogUpdate.value = true
}

const favorite = (report_id) => {
  try {
    if (loading) {
      loading.value = true

      module.getDataPart(
        'api/tactical-center/reports/favorite',
        [],
        { report_id: report_id },
        false
      )
    }
  } catch (error) {
    loading.value = false
  } finally {
    props.report.is_favorite = !props.report.is_favorite
    loading.value = false
  }
}
</script>
<template>
  <v-col cols="12" sm="4" md="3" lg="3" xl="2" class="pa-1">
    <v-card class="w-100" elevation="3">
      <v-card-title class="d-flex py-1 pt-1 px-2 text-subtitle-1 text-left">
        <span :title="report.title" class="text-truncate w-75">
          {{ report.label }}
        </span>

        <span
          title="Favorito"
          :loading="module.loading"
          class="text-truncate text-right w-25 cursor-pointer"
        >
          <v-btn
            :disabled="loading"
            title="Notificações"
            density="compact"
            variant="plain"
            class="pb-2"
            :color="report?.is_favorite ? 'yellow-darken-3' : 'brand_txt'"
            :icon="report?.is_favorite ? 'mdi-pin' : 'mdi-pin-off-outline'"
            size="small"
            @click.stop="favorite(report.id)"
          ></v-btn>
        </span>
      </v-card-title>

      <v-card-subtitle
        @click="openData(report)"
        class="d-flex py-1 pt-1 px-2 mt-n3 text-subtitle-2 text-brand_txt text-left cursor-pointer"
      >
        <span
          @click.stop
          :title="report.title"
          class="text-truncate w-75 cursor-default"
          style="height: 22px"
        >
          {{ report?.group?.label }}
        </span>
        <span
          :title="report?.type?.label"
          class="text-truncate text-right w-25 mt-1 mr-7 mb-2 cursor-pointer"
        >
          <v-btn :loading="loading" size="small" icon variant="plain">
            <v-icon
              size="40"
              :color="
                report.report || report?.type?.id == 3 || report?.type?.id == 4
                  ? 'brand_txt'
                  : 'deep-orange-darken-3'
              "
              :icon="report?.type?.icon"
            />
          </v-btn>
        </span>
      </v-card-subtitle>

      <v-card-text @click.stop="" class="d-flex py-0 px-2 pb-1 text-brand_txt">
        <v-btn
          title="Status"
          density="compact"
          variant="plain"
          class="pl-1 pt-0 mt-1"
          :color="report.active.color"
          prepend-icon="mdi-circle"
          size="small"
        >
          {{ report.active.name }}
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
          v-if="module?.data?.isOwner"
          :loading="module.loading"
          title="Editar"
          density="compact"
          variant="plain"
          class="mx-2 pb-2"
          color="medium-emphasis"
          icon="mdi-square-edit-outline"
          size="small"
          @click.stop="updateOpen(report)"
        ></v-btn>

        <v-btn
          :loading="module.loading"
          title="Notificações"
          density="compact"
          variant="plain"
          class="mx-2 pb-2"
          color="medium-emphasis"
          icon="mdi-information-variant-circle-outline"
          size="small"
          @click.stop=""
        ></v-btn>
        <!-- <v-btn
        :loading="module.loading"
        title="Notificações"
        density="compact"
        variant="plain"
        class="mx-2 pb-2"
        color="medium-emphasis"
        icon="mdi-information-variant-circle-outline"
        size="small"
        @click.stop=""
      ></v-btn> -->

        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              :loading="module.loading"
              title="Responsáveis"
              density="compact"
              variant="plain"
              class="ml-2 mr-1 pb-2"
              v-bind="props"
              :color="report?.owners?.length > 0 ? 'brand_txt' : 'deep-orange-darken-3'"
              icon="mdi-account-group"
              size="small"
            ></v-btn>
          </template>
          <v-list v-if="report?.owners?.length > 0">
            <v-list-item
              v-for="owner in report.owners"
              :key="owner?.username"
              :title="owner?.user?.name ?? owner?.username"
              :subtitle="owner?.user?.position_summary"
              prepend-icon="mdi-email-fast-outline"
              :href="`mailto:${owner?.username}@${mailDomain}?subject= Ahtlas Reports | Sobre o relatório ${report.title}`"
            >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-text>
      <!-- <pre>

      {{ report }}
    </pre> -->
    </v-card>
  </v-col>
  <CoreDialog
    v-model="urlView"
    header-icon="mdi-presentation"
    :header-title="urlData?.title"
    body-class="overflow-hidden bg-dialog pa-0 "
    :dialog-fullscreen="true"
    header-class="bg-brand_roxo1"
  >
    <iframe
      v-show="urlData?.report"
      class="mb-16 w-100"
      width="780px"
      height="100%"
      :src="urlData?.report"
      frameborder="0"
      allowFullScreen="true"
    />
    <div class="footer bg-brand_roxo1"></div>
  </CoreDialog>
  <CoreDialog
    v-model="dialogUpdate"
    header-icon="mdi-pencil-outline"
    header-title="Update - Report"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-0 pb-3 px-0"
    headerheight="35px"
    max-width="650px"
    header-class="bg-brand_verde_dark"
  >
    <ReportUpdate v-model="dialogUpdate" :uuid="report.uuid" />
  </CoreDialog>
  <CoreDialog
    v-model="dialogShow"
    header-icon="mdi-file"
    :header-title="report.label"
    body-class="overflow-auto overflow-x-hidden bg-dialog pt-0 pb-3 px-0"
    headerheight="35px"
    max-width="350px"
    header-class="bg-brand_verde_dark"
  >
    <ReportShow v-model="dialogShow" :uuid="report.uuid" />
  </CoreDialog>
</template>
