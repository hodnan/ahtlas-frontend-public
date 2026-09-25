<script setup>
  import { ref, watch, onMounted } from 'vue'
  import { debounce } from 'lodash'
  import axios from 'axios' // Para CancelToken
  import axiosInstance from '@/Plugins/axios' // Instância configurada

  // Definir props
  const props = defineProps({
    modelValue: { type: String || Array },
    employees: { type: Object || Array },
    label: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    hide_spin_buttons: { type: Boolean, default: false },
    hierarchical_level: { type: Array, default: () => [] },
    active: { type: Number, default: 1 },
    multiple: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    first_letter: { type: Boolean, default: false },
    accept_1: { type: String, default: '' },
    accept_2: { type: String, default: '' }
  })

  // Definir emits
  const emit = defineEmits(['update:modelValue', 'update:employees'])

  // Dados reativos
  const dataList = ref([])
  const value = ref(props.modelValue)
  const loading = ref(false)

  const form = ref({
    search: null,
    hierarchical_level: props.hierarchical_level ?? [],
    accept_1: props.accept_1 ?? '',
    accept_2: props.accept_2 ?? ''
  })

  const employees = ref(null)

  const getEmployes = async () => {
    employees.value = dataList.value?.find((item) => item.username === value.value)

    emit('update:employees', employees.value) // Emitir o valor atualizado
  }

  const cancelTokenSource = ref(null)

  // Função para buscar dados na API
  const getNewData = async (filter) => {
    // Cancelar requisição anterior, se existir
    if (cancelTokenSource.value) {
      cancelTokenSource.value.cancel('Requisição cancelada')
    }
    // Criar novo CancelToken
    cancelTokenSource.value = axios.CancelToken.source()

    loading.value = true
    try {
      const response = await axiosInstance.post('/api/people/employee/select', filter, {
        cancelToken: cancelTokenSource.value.token
      })

      if (response?.data?.dataModule?.employee) {
        dataList.value = response.data.dataModule.employee

        await getEmployes()
        emit('update:employees', employees)
      }
    } catch (error) {
    } finally {
      loading.value = false
    }
  }

  const handleSearch = (searchValue) => {
    form.value.search = searchValue || ''
  }

  watch(value, (newValue) => {
    emit('update:modelValue', newValue)
    getEmployes()
  })

  watch(
    () => form.value.search,
    debounce(async (newValue) => {
      if (newValue && !searchExistsInDataList(newValue)) {
        getNewData(form.value)
      }
    }, 1000),

    { deep: true }
  )

  // Verificar se o valor de busca existe em dataList
  const searchExistsInDataList = (searchValue) => {
    if (!searchValue) return false
    const searchLower = searchValue.toLowerCase()
    return dataList.value.some((item) => {
      const label = item.label?.toLowerCase() || ''
      return label.includes(searchLower)
    })
  }

  onMounted(async () => {
    let firstLoad = form.value
    firstLoad.username = props.modelValue
    await getNewData(firstLoad)
  })
</script>
<template>
  <div>
    <v-autocomplete
      v-model="value"
      :loading="loading"
      density="compact"
      :label="label"
      color="primary"
      class="inputH40"
      :items="dataList"
      hide-details=""
      menu-icon=""
      variant="outlined"
      item-title="label"
      item-value="username"
      :hide-spin-buttons="hide_spin_buttons"
      :clearable="clearable"
      :multiple="multiple"
      @update:search="handleSearch"
    >
      <template #no-data>
        <v-list-item v-if="loading">Procurando...</v-list-item>
        <v-list-item v-else>Não localizado</v-list-item>
      </template>

      <template #chip="{ props, item }">
        <v-avatar
          v-if="item.raw.avatar?.avatar"
          :image="'data:image/jpeg;base64,' + item.raw.avatar?.avatar"
          size="22"
        ></v-avatar>
        <span class="d-inline-block text-truncate pl-2" style="width: 150px">
          {{ item.raw.name }}
        </span>
      </template>
      <template #item="{ props, item }">
        <v-list-item
          v-bind="props"
          :subtitle="item.raw.hierarchical_level?.label + ' | ' + item.raw.username"
          :title="item.raw.name"
        >
          <template v-slot:prepend>
            <v-avatar v-if="item.raw.avatar?.avatar">
              <img :src="'data:image/jpeg;base64,' + item.raw.avatar?.avatar" width="40" />
            </v-avatar>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
    <!-- <pre>{{ form }}</pre> -->
  </div>
</template>

<style scoped lang="scss">
  .compact :deep(.v-field__input) {
    padding-left: 3px !important;
    padding-right: 4px !important;
    text-align: center !important;
  }

  .font-lg :deep(.v-field__input) {
    font-size: 14px;
    padding: 5px !important;
    padding-left: 25px !important;
    height: 56px !important;
    text-align: center !important;
  }

  .bg-opacity-10 {
    background-color: rgb(var(--v-theme-background2), 0.7);
  }
</style>
