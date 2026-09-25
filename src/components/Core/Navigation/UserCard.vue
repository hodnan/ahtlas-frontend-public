<script setup>
import { authStore } from '@/store'

const auth = authStore()
</script>
<template>
  <v-card
    elevation="0"
    class="d-flex align-center justify-center"
    style="height: 200px"
    color="transparent"
  >
    <v-list lines="three" class="pr-5 pl-2">
      <v-list-item>
        <template v-slot:prepend>
          <v-avatar size="70px">
            <img
              v-if="auth?.user?.avatar?.avatar"
              :src="'data:image/jpeg;base64,' + auth?.user?.avatar?.avatar"
              width="70"
              alt=""
            />
            <img v-else src="/assets/avatar/default.jpg" width="70" alt="" />
          </v-avatar>
        </template>
        <template v-slot:title>
          <div class="text-h6 text-truncate">
            {{ auth?.user?.name }}
          </div>
        </template>
        <template v-slot:subtitle>
          <div class="text-body-2 text-truncate">Matrícula: {{ auth?.user?.username }}</div>
          <div class="text-body-2 text-truncate">
            Setor: {{ auth?.user?.employee?.sector_n1?.label }}
          </div>
          <div class="text-body-2 text-truncate">
            Cargo: {{ auth?.user?.employee?.position_summary }}
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>