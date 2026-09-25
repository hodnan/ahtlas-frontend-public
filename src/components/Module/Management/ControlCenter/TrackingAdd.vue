<script setup>
import { ref, watch, onMounted } from 'vue'
import moment from 'moment'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const indicators = ref([])

const emit = defineEmits(['update'])
const props = defineProps({
  modelValue: Boolean,
  onUpdateModelValue: Function // Correção na declaração
})

const closeDialog = () => {
  emit('update:modelValue', false)
}

const form = ref({
  month_ref: moment().format('YYYY-MM'),
  sector_n1_id: null,
  indicator_id: null,
  notify_level: null,
  goal: null,
  bypass: 0,
  q1: 120,
  q2: 100,
  q3: 90,
  q4: 90,
  daily_goals: []
})

const percentInput = (event) => {
  const value = event.target.value
  // Aplica a validação diretamente no valor do campo
  if (value !== null && typeof value === 'string') {
    event.target.value = value.replace(',', '.').replace(/[^0-9.]/g, '')
  }
}

const level = ref([
  { value: null, label: 'Nenhuma notificação' },
  { value: 0, label: 'Somente Qualidade' },
  { value: 1, label: 'Gestores' },
  { value: 3, label: 'Diretores' },
  { value: 4, label: 'CEO' }
])

onMounted(() => {
  dailyGoals()
})

const dailyGoals = () => {
  const daysInMonth = moment().daysInMonth()
  let days = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = moment().date(day).format('YYYY-MM-DD')
    days.push({
      month_ref: moment(date).format('YYYY-MM'),
      date_ref: date,
      goal: form.value.goal,
      passed: moment(date).isSameOrBefore(moment(), 'day') // Verifica se o dia já passou
    })
  }

  form.value.daily_goals = days
}

watch(
  () => form.value.goal,
  () => {
    dailyGoals()
  }
)

watch(
  () => form.value.sector_n1_id,
  (newFilter) => {
    const kpi = module.data.kpis.filter((item) => item.id == newFilter)
    form.value.indicator_id = null

    indicators.value = kpi[0]?.indicators
  }
)

const submit = async () => {
  try {
    await module.setStore(`api/management/control-center/tracking/store`, form.value)
    if (notify.success) {
      closeDialog()
      await module.getDataPart('api/management/control-center/admin', ['trackings'])
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <form @submit.prevent="submit">
    <v-card-text class="pa-2">
      <v-row class="ma-0">
        <v-col class="pa-1" cols="12" md="4">
          <v-autocomplete
            v-model="form.sector_n1_id"
            :items="module?.data?.kpis"
            color="primary"
            density="compact"
            label="Setor"
            variant="outlined"
            hide-details=""
            itemTitle="label"
            itemValue="id"
            :error-messages="notify?.errors?.sector_n1_id"
          />
        </v-col>
        <v-col class="pa-1" cols="12" md="4">
          <v-autocomplete
            v-model="form.indicator_id"
            :items="indicators"
            color="primary"
            density="compact"
            label="Indicador"
            variant="outlined"
            hide-details=""
            item-title="label"
            item-value="id"
            :error-messages="notify?.errors?.indicator_id"
          />
        </v-col>
        <v-col class="pa-1" cols="12" md="4">
          <v-autocomplete
            v-model="form.notify_level"
            :items="module?.data?.notifications"
            color="primary"
            density="compact"
            label="Notificações"
            variant="outlined"
            hide-details=""
            item-title="label"
            item-value="id"
            :error-messages="notify?.errors?.notify_level"
          />
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="form.goal"
            class="centered-input"
            color="primary"
            density="compact"
            label="Meta"
            variant="outlined"
            hide-details=""
            @input="percentInput"
            :error-messages="notify?.errors?.goal"
          />
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="form.bypass"
            class="centered-input"
            color="primary"
            density="compact"
            label="Tolerância %"
            variant="outlined"
            hide-details
            @input="percentInput"
            :error-messages="notify?.errors?.bypass"
          />
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="form.q1"
            class="centered-input"
            color="primary"
            density="compact"
            :label="'1º Qd >' + form.q1 + '%'"
            variant="outlined"
            hide-details
            @input="percentInput"
            :error-messages="notify?.errors?.q1"
          />
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="form.q2"
            class="centered-input"
            color="primary"
            density="compact"
            :label="'2º Qd >' + form.q2 + '%'"
            variant="outlined"
            hide-details
            @input="percentInput"
            :error-messages="notify?.errors?.q2"
          />
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="form.q3"
            class="centered-input"
            color="primary"
            density="compact"
            :label="'3º Qd >' + form.q3 + '%'"
            variant="outlined"
            hide-details
            @input="percentInput"
            :error-messages="notify?.errors?.q3"
          />
        </v-col>
        <v-col class="pa-1" cols="2">
          <v-text-field
            v-model="form.q4"
            class="centered-input"
            color="primary"
            density="compact"
            :label="'4º Qd >' + form.q4 + '%'"
            variant="outlined"
            hide-details
            @input="percentInput"
            :error-messages="notify?.errors?.q4"
          />
        </v-col>
      </v-row>
      <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
        <v-card-text class="bg-brand_verde_dark py-1 d-flex">
          <span class="py-1"> Metas ao dia </span>
          <v-spacer />
        </v-card-text>
        <v-card-text class="pa-0 overflow-auto" style="height: 300px">
          <v-row class="ma-0 pt-2" style="height: 52.38px !important">
            <v-col cols="12" md="2" class="pa-1" v-for="(item, n) in form.daily_goals" :key="n">
              <v-text-field
                v-model="form.daily_goals[n].goal"
                :readonly="item.passed"
                :color="item.passed ? '' : 'primary'"
                :bg-color="item.passed ? 'disabled' : ''"
                density="compact"
                :label="item.date_ref.substring(5)"
                variant="outlined"
                class="centered-input"
                hide-details=""
                @input="percentInput"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card-text>

    <v-card-actions class="px-4">
      <v-spacer></v-spacer>
      <v-btn
        :loading="module.storing"
        color="white"
        class="bg-brand_verde_dark"
        variant="tonal"
        append-icon="mdi-content-save"
        type="submit"
      >
        Gravar
      </v-btn>
    </v-card-actions>
  </form>
</template>

<style scoped>
.centered-input :deep(input) {
  text-align: center;
}
</style>
