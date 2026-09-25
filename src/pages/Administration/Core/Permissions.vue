<script setup>
import DefaultLayout from '@/Layouts/DefaultLayout.vue'

defineProps({
  all_routes: Object
})
</script>
<template>
  <DefaultLayout>
    <v-row>
      <v-col cols="4">
        Rotas do sistema
        <hr />
        <v-btn>Add regra</v-btn>
        <hr />
        <v-list lines="one">
          <v-list-item v-for="route in all_routes" :key="route.uri">
            {{ route.uri }} -> {{ route.action.as }} ({{ route.action.prefix }})
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </DefaultLayout>
</template>
