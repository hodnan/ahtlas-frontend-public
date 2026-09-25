<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import moment from 'moment'
import { moduleStore, notifyStore } from '@/store'

const module = moduleStore()
const notify = notifyStore()

const sector_n1 = ref(null)
const indicator = ref(null)
const isMounted = ref(false)

const emit = defineEmits(['update'])
const props = defineProps({
  modelValue: Boolean,
  onUpdateModelValue: Function, // Correção na declaração
  data: Object
})

const closeDialog = () => {
  emit('update:modelValue', false)
}

const form = ref({
  notify_level: null,
  goal: null,
  bypass: 0,
  q1: 120,
  q2: 100,
  q3: 90,
  q4: 90,
  daily_goals: [],
  active: false
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

const dailyGoals = (dailyGoals, goal = null) => {
  const temp = dailyGoals.map(function (item) {
    const passed = moment(item.date_ref).isSameOrBefore(moment(), 'day')

    return {
      month_ref: item.month_ref,
      date_ref: item.date_ref,
      goal: passed || goal == null ? item.goal : goal,
      passed: passed // Verifica se o dia já passou
    }
  })
  form.value.daily_goals = temp
}

watch(
  () => form.value.goal,
  (newFilter) => {
    if (isMounted.value) {
      dailyGoals(form.value.daily_goals, form.value.goal)
    }
  }
)

onMounted(async () => {
  let temp = JSON.parse(JSON.stringify(props?.data ?? []))

  form.value.month_ref = temp.month_ref
  form.value.sector_n1_id = temp.sector_n1_id
  form.value.indicator_id = temp.indicator_id
  form.value.notify_level = temp.notify_level
  form.value.goal = temp.goal
  form.value.bypass = temp.bypass
  form.value.q1 = temp.q1
  form.value.q2 = temp.q2
  form.value.q3 = temp.q3
  form.value.q4 = temp.q4
  form.value.active = temp.active

  sector_n1.value = temp.sector_n1
  indicator.value = temp.indicator

  dailyGoals(temp.daily_goals)

  await nextTick()

  isMounted.value = true
})

const submit = async () => {
  try {
    await module.setStore(
      `api/management/control-center/tracking/update/${props.data.id}`,
      form.value
    )
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
        <v-col class="pa-1" cols="12" md="12">
          <v-autocomplete
            v-model="sector_n1"
            readonly
            color="primary"
            density="compact"
            label="Setor"
            variant="outlined"
            hide-details=""
            itemTitle="label"
            itemValue="id"
          />
        </v-col>
        <v-col class="pa-1" cols="12" md="5">
          <v-autocomplete
            v-model="indicator"
            readonly
            color="primary"
            density="compact"
            label="Indicador"
            variant="outlined"
            hide-details=""
            item-title="label"
            item-value="id"
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
        <v-col class="pa-0 pl-3" cols="3">
          <v-switch
            v-model="form.active"
            density="compact"
            :label="form?.active ? 'Ativo' : 'Inativo'"
            color="info"
            hide-details
            :error-messages="notify?.errors?.active"
          ></v-switch>
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
                :error-messages="notify?.errors?.['daily_goals.' + n + '.goal']"
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