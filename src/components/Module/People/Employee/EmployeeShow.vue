<script setup>
import { onMounted } from 'vue'
import { moduleStore } from '@/store'

const module = moduleStore()

const props = defineProps({
  modelValue: Boolean,
  onUpdateModelValue: Function,
  username: String
})

onMounted(async () => {
  try {
    if (module.data?.employee?.username != props.username) {
      await module.getShow(`/api/people/employee/current/show/${props.username}`, ['employee'])
    }
  } catch (error) {
    console.log('xxxxxxxxx')
  }
})
</script>
<template>
  <v-row class="ma-0">
    <v-col cols="12 " class="d-flex align-start pa-2">
      <v-card width="115" class="pa-2">
        <v-avatar size="100px" rounded="0">
          <img
            v-if="module.data?.employee?.avatar?.avatar"
            :src="'data:image/jpeg;base64,' + module.data?.employee?.avatar?.avatar"
            width="100"
            alt=""
          />
          <img v-else src="/assets/avatar/default.jpg" width="100" alt="" />
        </v-avatar>
      </v-card>

      <v-list>
        <v-list-item density="compact" :title="module.data?.employee?.name">
          <v-list-item-subtitle>
            <b> Matrícula: </b> {{ module.data?.employee?.username }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b> Cargo: </b> {{ module.data?.employee?.position }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b> Setor: </b> {{ module.data?.employee?.sector_n1.label }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b> Subsetor: </b> {{ module.data?.employee?.sector_n2.label }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Status GIP:</b> {{ module.data?.employee?.status }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col cols="12 " class="d-flex align-start px-2 py-0">
      <v-list class="py-0">
        <v-list-item density="compact" title="Dados gerais">
          <v-list-item-subtitle> <b>UF:</b> {{ module.data?.employee?.uf }} </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Admissão:</b> {{ module.data?.employee?.admission }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Resc.:</b> {{ module.data?.employee?.dismissal }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Entrada:</b> {{ module.data?.employee?.start_time }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Carga Horária:</b> {{ module.data?.employee?.working_hours }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-list class="py-0">
        <v-list-item density="compact" title="Hierarquia">
          <v-list-item-subtitle>
            <b>Supervisor:</b> {{ module.data?.employee?.manager_n1.label }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Coordenador:</b> {{ module.data?.employee?.manager_n2.label }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b> Gerente:</b> {{ module.data?.employee?.manager_n3.label }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Superintendente:</b> {{ module.data?.employee?.manager_n4.label }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <b>Diretor:</b> {{ module.data?.employee?.manager_n5.label }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>

  <!-- {{ module.data.employee }} -->
</template>
