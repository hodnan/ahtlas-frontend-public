<script setup>
  import { ref, watch, onMounted } from 'vue'

  import { moduleStore, notifyStore } from '@/store'

  const module = moduleStore()
  const notify = notifyStore()

  const emit = defineEmits(['update:modelValue'])

  const closeDialog = () => {
    emit('update:modelValue', false)
  }

  const form = ref({})

  const addBasket = () => {
    // Adicionar um novo objeto vazio ao array form.sectors
    form.value.basket.push({
      indicator_id: null
    })
  }

  const removeBasket = (index) => {
    if (form.value.basket.length > 1) {
      form.value.basket.splice(index, 1)
    }
    notify.setErrors([])
  }

  const addAccelerator = () => {
    form.value.accelerator.push({
      indicator_id: null,
      operation: null,
      target: null,
      value: null
    })
  }

  const removeAccelerator = (index) => {
    form.value.accelerator.splice(index, 1)
    notify.setErrors([])
  }

  const addDeflator = () => {
    form.value.deflator.push({
      indicator_id: null,
      operation: null,
      target: null,
      value: null
    })
  }

  const removeDeflator = (index) => {
    form.value.deflator.splice(index, 1)
    notify.setErrors([])
  }

  const addElimination = () => {
    form.value.elimination.push({
      indicator_id: null,
      operation: null,
      target: null,
      value: null
    })
  }

  const removeElimination = (index) => {
    form.value.elimination.splice(index, 1)
    notify.setErrors([])
  }

  const sectorsN2 = ref([{ id: 0, name: '', label: 'Vazio' }])
  const indicators = ref([])
  const inficatorsBasket = ref([])
  const inficatorsElimination = ref([])

  const percentInput = (event) => {
    const value = event.target.value
    // Aplica a validação diretamente no valor do campo
    if (value !== null && typeof value === 'string') {
      event.target.value = value.replace(',', '.').replace(/[^0-9.]/g, '')
    }
  }

  const addonsBasket = (index) => {
    const indicatorId = form.value.basket[index].indicator_id
    if (!indicatorId) {
      form.value.basket[index].indicator_id = null
      form.value.basket[index].range = null
      form.value.basket[index].operation = null
      form.value.basket[index].calc = null
      form.value.basket[index].calcs = []
      return
    }

    const operation = getOperation(indicatorId)
    const calc = getCalc(indicatorId)

    const range = getRange(indicatorId, 1)
    form.value.basket[index].range = range
    form.value.basket[index].operation = operation
    form.value.basket[index].calc = calc?.calc ?? null
    form.value.basket[index].calcs = calc?.calcs ?? []
  }

  const addonsElimination = (index) => {
    const indicatorId = form.value.elimination[index].indicator_id

    if (!indicatorId) {
      form.value.elimination[index].indicator_id = null
      form.value.elimination[index].range = null
      form.value.elimination[index].operation = null
      form.value.elimination[index].calc = null
      form.value.elimination[index].calcs = []
      return
    }
    const operation = getOperation(indicatorId, true)
    const calc = getCalc(indicatorId)
    form.value.elimination[index].operation = operation
    form.value.elimination[index].calc = calc?.calc ?? null
    form.value.elimination[index].calcs = calc?.calcs ?? []
  }

  const addonsAccelerator = (index) => {
    const indicatorId = form.value.accelerator[index].indicator_id
    if (!indicatorId) {
      form.value.accelerator[index].indicator_id = null
      form.value.accelerator[index].range = null
      form.value.accelerator[index].operation = null
      form.value.accelerator[index].calc = null
      form.value.accelerator[index].calcs = []
      return
    }
    const operation = getOperation(indicatorId)
    const calc = getCalc(indicatorId)
    const range = getRange(indicatorId, 2)
    form.value.accelerator[index].range = range
    form.value.accelerator[index].operation = operation
    form.value.accelerator[index].calc = calc?.calc ?? null
    form.value.accelerator[index].calcs = calc?.calcs ?? []
  }

  const addonsDeflator = (index) => {
    const indicatorId = form.value.deflator[index].indicator_id
    if (!indicatorId) {
      form.value.deflator[index].indicator_id = null
      form.value.deflator[index].range = null
      form.value.deflator[index].operation = null
      form.value.deflator[index].calc = null
      form.value.deflator[index].calcs = []
      return
    }
    const operation = getOperation(indicatorId, true)
    const calc = getCalc(indicatorId)

    const range = getRange(indicatorId, 3)
    form.value.deflator[index].range = range

    form.value.deflator[index].operation = operation
    form.value.deflator[index].calc = calc?.calc ?? null
    form.value.deflator[index].calcs = calc?.calcs ?? []
  }

  // Conta indicadores repetidos para gerar o range/faixa
  const getRange = (indicator_id, type) => {
    let count = 0
    if (indicator_id && type == 1) {
      form.value.basket.forEach((item) => {
        if (item.indicator_id === indicator_id) {
          count++
        }
      })
    }

    if (indicator_id && type == 2) {
      form.value.accelerator.forEach((item) => {
        if (item.indicator_id === indicator_id) {
          count++
        }
      })
    }

    if (indicator_id && type == 3) {
      form.value.deflator.forEach((item) => {
        if (item.indicator_id === indicator_id) {
          count++
        }
      })
    }

    return count
  }

  const getOperation = (indicator_id, reverse = false) => {
    let ind = indicators.value.find((item) => item.id == indicator_id)

    let direction = ind.direction.id == 1

    direction = reverse ? !direction : direction
    return direction ? '>=' : '<='
  }

  const getCalc = (indicator_id) => {
    let ind = indicators.value.find((item) => item.id == indicator_id)

    if (ind) {
      let calcs = ind.calc.caclRV

      let calc = ind.calc.id == 1 ? 0 : 1

      calc = calcs.find((item) => item.id == calc)

      return { calcs, calc }
    }
  }

  watch(
    () => form.value.campaign,
    (newFilter) => {
      if (newFilter) {
        form.value.campaign = newFilter
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^A-Z_ ^0-9]/g, '') // Mantém letras do alfabeto, o caractere "_" e espaços
          .replace(/\s+/g, ' ') // Remove espaços duplicados
          .trim() // Remove espaços no início e no final
          .replace(/ /g, '_') // Substitui espaços por underscores
      }
    }
  )

  watch(
    () => form.value.sector_n1_id,
    (newFilter) => {
      const sectorsFind = module.data.sectors.find((item) => item.id == newFilter)
      sectorsN2.value = sectorsFind.sectors_n2
        ? [...module.data.sectors.find((item) => item.id == newFilter).sectors_n2]
        : []
      if (sectorsN2.value.length == 0) {
        sectorsN2.value = [{ id: 0, name: '', label: 'Vazio' }]
      }

      indicators.value = module.data.kpis.filter((item) => item.sector_n1_id == newFilter)

      indicators.value = indicators.value.map(function (item) {
        return item.indicator
      })

      inficatorsBasket.value = indicators.value.filter((item) => item.calc.id == 1)

      inficatorsElimination.value = indicators.value

      // Item a ser adicionado no início
      const newItem = {
        id: 747,
        name: 'Monitoria - Falha Crítica',
        direction: { id: 0, name: 'Menor melhor', icon: 'mdi-arrow-down' },
        symbol: { id: 0, name: 'Ñ se aplica', position: null },
        calc: {
          id: 0,
          name: 'Divisão',
          caclRV: [{ id: 1, label: 'Total' }]
        },
        is_percent: { value: true, label: 'sim' },
        label: '0747 - Monitoria - Falha Crítica'
      }

      // Item a ser adicionado no início
      const newItem2 = {
        id: 761,
        name: 'Monitoria - Gestor (%)',
        direction: { id: 1, name: 'Maior melhor', icon: 'mdi-arrow-up' },
        symbol: { id: 0, name: 'Ñ se aplica', position: null },
        calc: {
          id: 0,
          name: 'Divisão',
          caclRV: [{ id: 1, label: 'Total' }]
        },
        is_percent: { value: true, label: 'sim' },
        label: '0761 - Monitoria - Gestor (%)'
      }

      // Adicionar o item ao início do array
      inficatorsElimination.value.unshift(newItem)
      inficatorsElimination.value.unshift(newItem2)
    }
  )

  onMounted(async () => {
    let temp = JSON.parse(JSON.stringify(module.data?.term ?? []))

    form.value.id = temp.id
    form.value.month_ref = temp.month_ref
    form.value.owner = temp?.owner?.username
    form.value.sector_n1_id = temp.sector_n1_id
    form.value.sector_n2_id = temp.sector_n2_id
    form.value.campaign = temp.campaign
    form.value.payment_id = temp.payment_id
    form.value.position = temp.position.id
    form.value.level = temp.level.id
    form.value.roof = temp.roof
    form.value.apprentice = temp.apprentice
    form.value.notes = temp.notes
    form.value.basket = temp.basket
    form.value.accelerator = temp.accelerator
    form.value.deflator = temp.deflator
    form.value.elimination = temp.elimination
    form.value.status = temp.status.id
  })

  const submit = async () => {
    try {
      await module.setStore(
        `api/administration/incentives/rv/terms/update/${module.data.term.id}`,
        form.value
      )
      if (notify.success) {
        closeDialog()
        await module.getShow(
          `/api/administration/incentives/rv/terms/show/${module.data.term.id}`,
          ['term']
        )
        await module.getDataPart('api/administration/incentives/rv/terms', ['terms'])
      }
    } catch (error) {
      console.log(error)
    }
  }
</script>
<template>
  <v-form @submit.prevent="submit">
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col cols="12" md="10" class="pb-0">
          <v-row>
            <v-col class="pa-1" cols="12" md="2">
              <v-text-field
                v-model="form.month_ref"
                density="compact"
                color="primary"
                class="bg-disabled"
                label="Referência"
                hide-details=""
                readonly=""
                type="month"
                variant="outlined"
                :error-messages="notify?.errors?.month_ref"
              >
                &nbsp;
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" md="3">
              <v-autocomplete
                v-model="form.owner"
                :items="module?.data?.owners"
                density="compact"
                label="Gestor"
                color="primary"
                hide-details=""
                variant="outlined"
                item-title="label"
                item-value="username"
                hide-spin-buttons
                :error-messages="notify?.errors?.owner"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-if="item.raw.avatar?.avatar"
                    variant="text"
                    v-bind="props"
                    :prepend-avatar="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                  >
                    {{ item.raw.name }}
                  </v-chip>
                </template>

                <template #item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :subtitle="item.raw.hierarchical_level?.label + ' | ' + item.raw.username"
                    :title="item.raw.name"
                  >
                    <template v-slot:prepend>
                      <v-avatar>
                        <img
                          :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
                          width="40"
                        />
                      </v-avatar>
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col class="pa-1" cols="12" md="3">
              <v-autocomplete
                v-model="form.sector_n1_id"
                :items="module?.data?.sectors"
                color="primary"
                readonly=""
                class="bg-disabled"
                density="compact"
                label="Setor"
                variant="outlined"
                hide-details=""
                menu-icon=""
                clearable
                item-title="label"
                item-value="id"
                :error-messages="notify?.errors?.sector_n1_id"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="4">
              <v-autocomplete
                v-model="form.sector_n2_id"
                :items="sectorsN2"
                color="primary"
                readonly=""
                class="bg-disabled"
                density="compact"
                label="Sub-setor"
                variant="outlined"
                hide-details=""
                menu-icon=""
                clearable
                item-title="label"
                item-value="id"
                :error-messages="notify?.errors?.sector_n2_id"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pa-1" cols="12" md="3">
              <v-text-field
                v-model="form.campaign"
                density="compact"
                color="primary"
                label="Campanha"
                readonly=""
                class="bg-disabled"
                hide-details=""
                variant="outlined"
                :error-messages="notify?.errors?.campaign"
              />
            </v-col>
            <v-col class="pa-1" cols="12" md="3">
              <v-autocomplete
                v-model="form.payment_id"
                :items="module?.data?.payments"
                color="primary"
                density="compact"
                label="Pagamento"
                variant="outlined"
                hide-details=""
                menu-icon=""
                item-title="label"
                item-value="id"
                :error-messages="notify?.errors?.payment_id"
              />
            </v-col>

            <v-col class="pa-1" cols="12" md="6">
              <div class="d-inline-flex w-100">
                <v-autocomplete
                  v-model="form.position"
                  :items="module?.data?.positions"
                  color="primary"
                  readonly=""
                  class="mr-2 bg-disabled"
                  item-title="short"
                  item-value="id"
                  density="compact"
                  label="Tipo"
                  variant="outlined"
                  style="width: 30px"
                  menu-icon=""
                  hide-details=""
                  :error-messages="notify?.errors?.position"
                />

                <v-autocomplete
                  v-model="form.level"
                  :items="module?.data?.levels"
                  color="primary"
                  readonly=""
                  class="mr-2 bg-disabled"
                  density="compact"
                  label="Tempo"
                  variant="outlined"
                  item-title="short"
                  item-value="id"
                  hide-details=""
                  style="width: 30px"
                  menu-icon=""
                  :error-messages="notify?.errors?.level"
                />
                <v-text-field
                  v-model="form.roof"
                  color="primary"
                  class="mr-2"
                  density="compact"
                  label="Teto"
                  variant="outlined"
                  hide-details=""
                />

                <v-autocomplete
                  v-model="form.apprentice"
                  :items="[
                    { id: false, value: 'Não' },
                    { id: true, value: 'Sim' }
                  ]"
                  color="primary"
                  class=""
                  density="compact"
                  label="Jovem"
                  variant="outlined"
                  hide-details=""
                  menu-icon=""
                  style="width: 30px"
                  item-title="value"
                  item-value="id"
                  :error-messages="notify?.errors?.apprentice"
                />
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="2">
          <v-row>
            <v-col class="pa-1">
              <v-textarea
                v-model="form.notes"
                color="primary"
                class="notes"
                :rows="4"
                density="compact"
                label="Notas"
                variant="outlined"
                hide-details=""
              ></v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="ma-0">
        <v-col cols="6" class="pa-1">
          <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
            <v-card-text class="text-teal-darken-4 bg-grey-lighten-2 py-1 d-flex">
              <span class="py-1">Cesta</span>
              <v-spacer />
              <v-btn
                icon="mdi-plus"
                rounded="0"
                elevation="0"
                color="transparent"
                density="compact"
                @click="addBasket"
              />
            </v-card-text>

            <v-card-text class="pa-1 overflow-auto indicator_box">
              <v-row v-for="(item, n) in form.basket" :key="n" class="ma-0">
                <v-col cols="4" class="pa-1">
                  <v-autocomplete
                    v-model="form.basket[n].indicator_id"
                    :items="inficatorsBasket"
                    color="primary"
                    density="compact"
                    :label="'Indicador: ' + n"
                    variant="outlined"
                    menu-icon=""
                    clearable
                    hide-details=""
                    @update:model-value="addonsBasket(n)"
                    item-title="label"
                    item-value="id"
                    :error-messages="notify?.errors?.['basket.' + n + '.indicator_id']"
                  />
                  <!-- :error-messages="form.errors['basket.' + n + '.indicator_id']" -->
                </v-col>

                <v-col cols="12" md="8" class="pa-1">
                  <div class="d-inline-flex w-100">
                    <input
                      readonly
                      placeholder="Faixa"
                      v-model="form.basket[n].range"
                      class="mr-2 bg-disabled px-2 rounded text-center"
                      style="width: 40px !important; height: 40px; border: 1px solid grey"
                      :error-messages="notify?.errors?.['basket.' + n + '.range']"
                    />
                    <input
                      readonly
                      v-model="form.basket[n].operation"
                      class="mr-2 bg-disabled px-2 rounded text-center"
                      style="width: 40px !important; height: 40px; border: 1px solid grey"
                      :error-messages="notify?.errors?.['basket.' + n + '.operation']"
                    />

                    <v-autocomplete
                      v-model="form.basket[n].calc"
                      :items="form.basket[n].calcs"
                      color="primary"
                      density="compact"
                      label="Calc"
                      variant="outlined"
                      menu-icon=""
                      class="mr-2"
                      return-object
                      hide-details=""
                      item-title="label"
                      item-value="id"
                      style="width: 60px !important"
                      :error-messages="notify?.errors?.['basket.' + n + '.calc']"
                    />
                    <!-- :error-messages="form.errors['basket.' + n + '.calc']" -->
                    <v-text-field
                      v-model="form.basket[n].target"
                      color="primary"
                      density="compact"
                      class="mr-2"
                      label="Meta"
                      variant="outlined"
                      hide-details=""
                      @input="percentInput"
                      :error-messages="notify?.errors?.['basket.' + n + '.target']"
                    />
                    <!-- :error-messages="form.errors['basket.' + n + '.target']" -->
                    <v-text-field
                      v-model="form.basket[n].value"
                      color="primary"
                      density="compact"
                      label="Valor"
                      variant="outlined"
                      hide-details=""
                      @input="percentInput"
                      :error-messages="notify?.errors?.['basket.' + n + '.value']"
                    />
                    <!-- :error-messages="form.errors['basket.' + n + '.value']" -->
                    <v-btn
                      icon="mdi-minus"
                      rounded="0"
                      class="my-auto ml-2"
                      elevation="0"
                      color="transparent"
                      density="compact"
                      @click="removeBasket(n)"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="6" class="pa-1">
          <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
            <v-card-text class="text-light-blue-darken-4 bg-grey-lighten-2 py-1 d-flex">
              <span class="py-1">Acelerador</span>

              <v-spacer />
              <v-btn
                icon="mdi-plus"
                rounded="0"
                elevation="0"
                color="transparent"
                density="compact"
                @click="addAccelerator"
              />
            </v-card-text>
            <v-card-text class="pa-1 overflow-auto indicator_box">
              <v-row v-for="(item, n) in form.accelerator" :key="n" class="ma-0">
                <v-col cols="12" md="4" class="pa-1">
                  <v-autocomplete
                    v-model="form.accelerator[n].indicator_id"
                    :items="indicators"
                    color="primary"
                    density="compact"
                    :label="'Indicador: ' + n"
                    variant="outlined"
                    menu-icon=""
                    clearable
                    hide-details=""
                    @update:model-value="addonsAccelerator(n)"
                    item-title="label"
                    item-value="id"
                    :error-messages="notify?.errors?.['accelerator.' + n + '.indicator_id']"
                  />
                </v-col>

                <v-col cols="12" md="8" class="pa-1">
                  <div class="d-inline-flex w-100">
                    <input
                      readonly
                      placeholder="Faixa"
                      v-model="form.accelerator[n].range"
                      class="mr-2 bg-disabled px-2 rounded text-center"
                      style="width: 40px !important; height: 40px; border: 1px solid grey"
                      :error-messages="notify?.errors?.['accelerator.' + n + '.range']"
                    />
                    <input
                      readonly
                      v-model="form.accelerator[n].operation"
                      class="mr-2 bg-disabled px-2 rounded text-center"
                      style="width: 40px !important; border: 1px solid grey"
                      :error-messages="notify?.errors?.['accelerator.' + n + '.operation']"
                    />

                    <v-autocomplete
                      v-model="form.accelerator[n].calc"
                      :items="form.accelerator[n].calcs"
                      color="primary"
                      density="compact"
                      label="Calc"
                      variant="outlined"
                      menu-icon=""
                      class="mr-2"
                      return-object
                      hide-details=""
                      item-title="label"
                      item-value="id"
                      style="width: 60px !important"
                      :error-messages="notify?.errors?.['accelerator.' + n + '.calc']"
                    />

                    <v-text-field
                      v-model="form.accelerator[n].target"
                      color="primary"
                      density="compact"
                      class="mr-2"
                      label="Meta"
                      variant="outlined"
                      hide-details=""
                      @input="percentInput"
                      :error-messages="notify?.errors?.['accelerator.' + n + '.target']"
                    />

                    <v-text-field
                      v-model="form.accelerator[n].value"
                      color="primary"
                      density="compact"
                      label="Ac %"
                      variant="outlined"
                      hide-details=""
                      @input="percentInput"
                      :error-messages="notify?.errors?.['accelerator.' + n + '.value']"
                    />

                    <v-btn
                      icon="mdi-minus"
                      rounded="0"
                      class="my-auto ml-2"
                      elevation="0"
                      color="transparent"
                      density="compact"
                      @click="removeAccelerator(n)"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col cols="6" class="pa-1">
          <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
            <v-card-text class="text-lime-darken-3 bg-grey-lighten-2 py-1 d-flex">
              <span class="py-1">Deflator</span>

              <v-spacer />
              <v-btn
                icon="mdi-plus"
                rounded="0"
                elevation="0"
                color="transparent"
                density="compact"
                @click="addDeflator"
              />
            </v-card-text>
            <v-card-text class="pa-1 overflow-auto indicator_box">
              <v-row v-for="(item, n) in form.deflator" :key="n" class="ma-0">
                <v-col cols="12" md="4" class="pa-1">
                  <v-autocomplete
                    v-model="form.deflator[n].indicator_id"
                    :items="indicators"
                    color="primary"
                    density="compact"
                    :label="'Indicador: ' + n"
                    variant="outlined"
                    menu-icon=""
                    clearable
                    hide-details=""
                    @update:model-value="addonsDeflator(n)"
                    item-title="label"
                    item-value="id"
                    :error-messages="notify?.errors?.['deflator.' + n + '.indicator_id']"
                  />
                </v-col>

                <v-col cols="12" md="8" class="pa-1">
                  <div class="d-inline-flex w-100">
                    <input
                      readonly
                      placeholder="Faixa"
                      v-model="form.deflator[n].range"
                      class="mr-2 bg-disabled px-2 rounded text-center"
                      style="width: 40px !important; height: 40px; border: 1px solid grey"
                      :error-messages="notify?.errors?.['deflator.' + n + '.range']"
                    />
                    <input
                      readonly
                      v-model="form.deflator[n].operation"
                      class="mr-2 bg-disabled px-2 rounded text-center"
                      style="width: 40px !important; border: 1px solid grey"
                      :error-messages="notify?.errors?.['deflator.' + n + '.operation']"
                    />

                    <v-autocomplete
                      v-model="form.deflator[n].calc"
                      :items="form.deflator[n].calcs"
                      color="primary"
                      density="compact"
                      label="Calc"
                      variant="outlined"
                      menu-icon=""
                      class="mr-2"
                      return-object
                      hide-details=""
                      item-title="label"
                      item-value="id"
                      style="width: 60px !important"
                      :error-messages="notify?.errors?.['deflator.' + n + '.calc']"
                    />
                    <v-text-field
                      v-model="form.deflator[n].target"
                      color="primary"
                      density="compact"
                      class="mr-2"
                      label="Meta"
                      variant="outlined"
                      hide-details=""
                      @input="percentInput"
                      :error-messages="notify?.errors?.['deflator.' + n + '.target']"
                    />
                    <v-text-field
                      v-model="form.deflator[n].value"
                      color="primary"
                      density="compact"
                      label="Def %"
                      variant="outlined"
                      hide-details=""
                      @input="percentInput"
                      :error-messages="notify?.errors?.['deflator.' + n + '.value']"
                    />

                    <v-btn
                      icon="mdi-minus"
                      rounded="0"
                      class="my-auto ml-2"
                      elevation="0"
                      color="transparent"
                      density="compact"
                      @click="removeDeflator(n)"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" class="pa-1">
          <v-card color="h-auto rounded-0 elevation-10 bg-transparent pt-1" elevation="1">
            <v-card-text class="text-red-accent-4 bg-grey-lighten-2 py-1 d-flex">
              <span class="py-1">Eliminatório</span>
              <v-spacer />

              <v-spacer />
              <v-btn
                icon="mdi-plus"
                rounded="0"
                elevation="0"
                color="transparent"
                density="compact"
                @click="addElimination"
              />
            </v-card-text>
            <v-card-text class="pa-1 overflow-auto indicator_box">
              <v-row v-for="(item, n) in form.elimination" :key="n" class="ma-0">
                <v-col cols="12" md="6" class="pa-1">
                  <v-autocomplete
                    v-model="form.elimination[n].indicator_id"
                    :items="indicators"
                    color="primary"
                    density="compact"
                    :label="'Indicador: ' + n"
                    variant="outlined"
                    @update:model-value="addonsElimination(n)"
                    menu-icon=""
                    clearable=""
                    hide-details=""
                    item-title="label"
                    item-value="id"
                    :error-messages="notify?.errors?.['elimination.' + n + '.indicator_id']"
                  />
                </v-col>

                <v-col cols="12" md="6" class="pa-1">
                  <div class="d-inline-flex w-100">
                    <input
                      readonly
                      v-model="form.elimination[n].operation"
                      class="mr-2 bg-disabled px-2 rounded text-center"
                      style="width: 40px !important; border: 1px solid grey"
                      :error-messages="notify?.errors?.['elimination.' + n + '.operation']"
                    />

                    <v-autocomplete
                      v-model="form.elimination[n].calc"
                      :items="form.elimination[n].calcs"
                      color="primary"
                      density="compact"
                      label="Calc"
                      variant="outlined"
                      menu-icon=""
                      class="mr-2"
                      return-object
                      hide-details=""
                      item-title="label"
                      item-value="id"
                      style="width: 60px !important"
                      :error-messages="notify?.errors?.['elimination.' + n + '.calc']"
                    />

                    <v-text-field
                      v-model="form.elimination[n].target"
                      color="primary"
                      density="compact"
                      label="Meta"
                      variant="outlined"
                      hide-details=""
                      @input="percentInput"
                      :error-messages="notify?.errors?.['elimination.' + n + '.target']"
                    />
                    <v-btn
                      icon="mdi-minus"
                      rounded="0"
                      class="my-auto ml-2"
                      elevation="0"
                      color="transparent"
                      density="compact"
                      @click="removeElimination(n)"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="px-4 pt-1 pb-0">
      <!-- <v-autocomplete
        class="w-25 mr-2"
        v-model="copyTerm"
        :items="page.props.terms"
        color="primary"
        density="compact"
        label="Termo"
        variant="outlined"
        hide-details=""
        menu-icon=""
        clearable
        item-title="term_name"
        item-value="id"
      />
      <v-btn @click="copy(copyTerm ?? 0)"> copiar </v-btn> -->
      <v-spacer></v-spacer>
      <v-spacer />

      <v-col cols="2" class="pa-0">
        <v-autocomplete
          v-model="form.status"
          :items="module.data.statuses"
          color="primary"
          class="mr-3"
          density="compact"
          label="Status"
          variant="outlined"
          hide-details=""
          menu-icon=""
          item-title="label"
          item-value="id"
          style="width: 130px !important"
        />
      </v-col>

      <v-btn
        :loading="module.storing"
        color="brand_verde_dark"
        class=""
        variant="flat"
        append-icon="mdi-content-save"
        type="submit"
      >
        Gravar
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<style scoped>
  .notes :deep(.v-field__input) {
    height: 88px !important;
  }

  .indicator_box {
    height: calc(50vh - 154px);
  }

  select:focus,
  input:focus {
    outline: none;
  }

  :deep(.v-field__input) {
    height: 40px !important;
    overflow: hidden;
  }
</style>
