<script setup>
import CoreDialog from '@/components/Core/Utils/Dialog.vue'
import { coreStore } from '@/store'
const core = coreStore()
const drawer = ref(false)
</script>
<template>
  <v-btn
    v-if="core.routeInfo"
    class="button mr-14"
    rounded="0"
    color="transparent"
    elevation="0"
    @click="drawer = !drawer"
  >
    <v-icon color="yellow-darken-2" size="x-large" icon="mdi-information-variant-circle-outline" />
  </v-btn>

  <CoreDialog
    v-model="drawer"
    :header-icon="core?.routeInfo?.icon"
    :header-title="core?.routeInfo?.title"
    body-class="overflow-auto overflow-x-hidden bg-dialog pa-3"
    headerheight="35px"
    max-width="700"
    max-height="75vw"
    header-class="bg-yellow-darken-2"
  >
    <div v-for="(item, i) in core?.routeInfo?.data" :key="i">
      <v-card variant="outlined" border="brand_txt" class="pb-2 mb-2">
        <v-card-title class="bg-brand_txt mb-3 py-0 pb-0 font-weight-black text-subtitle-1">
          {{ item.title }}
        </v-card-title>
        <div v-for="(subItem, i) in item.data" :key="i">
          <v-card-text v-if="subItem?.text" class="py-0">
            {{ subItem?.text }}
          </v-card-text>

          <v-card-text v-if="subItem?.video" class="d-flex justify-center px-3 pb-2">
            <iframe
              width="100%"
              height="300"
              :src="subItem.video"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </v-card-text>

          <v-card-text v-if="subItem?.list" class="py-0">
            <v-card-title class="pt-1 pb-0 pl-3">
              <span class="font-weight-black text-body-1">Título</span>
            </v-card-title>

            <ul class="px-4">
              <li class="py-1">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea aliquid reiciendis
                laboriosam doloribus quisquam deserunt asperiores aperiam. Debitis, ratione alias.
                Temporibus, magnam ut! Nisi vitae aspernatur ab tenetur dolorum odit.
              </li>
              <li class="py-1">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia, dolorem quas
                nulla, totam aperiam nesciunt suscipit inventore eum perspiciatis repellendus
                doloribus earum neque dignissimos ex. Veniam molestiae libero ab quo!
              </li>
            </ul>
          </v-card-text>
        </div>
      </v-card>
    </div>
  </CoreDialog>
</template>

<style scoped>
.button {
  position: absolute;
  display: block;
  top: 25px;
  right: -25px;

  z-index: 9999;
  transform: translate3d(-50%, -50%, 0) rotate(0deg);
}
</style>