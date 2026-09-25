<script setup>
import { ref, onMounted } from 'vue'
import { moduleStore } from '@/store'

const module = moduleStore()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  publicId: String,
  fiscalYear: String
})

const form = ref({
  fiscal_year_id: props.fiscalYear,
  public_id: props.publicId,
  status: null
})

const submit = async () => {
  try {
    await module.setStore(`api/administration/incentives/bonus/panel/validate`, form.value)
    if (notify.success) {
      emit('update:modelValue', false)
      module.data.submit = true
      await module.getShow(
        `api/administration/incentives/bonus/panel/show/${form.value.public_id}`,
        ['panel'],
        true
      )
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div>
    <form @submit.prevent="submit">
      <v-card-text class="pa-0">
        <v-row class="ma-0">
          <v-col cols="6" class="pa-1">
            <v-btn
              block
              rounded="0"
              class="px-4"
              :color="form.status == 2 ? 'teal' : 'background'"
              variant="flat"
              @click="form.status = 2"
            >
              Aprovar
            </v-btn>
          </v-col>
          <v-col cols="6" class="pa-1">
            <v-btn
              block
              rounded="0"
              class="px-4"
              :color="form.status == 3 ? 'red-darken-2' : 'background'"
              variant="flat"
              @click="form.status = 3"
            >
              REPROVAR
            </v-btn>
          </v-col>
          <v-col cols="12" class="pa-1">
            <v-btn
              :loading="module.storing"
              block
              rounded="0"
              class="px-4"
              variant="flat"
              type="submit"
            >
              Gravar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </form>
  </div>
</template>
<style scoped></style>
