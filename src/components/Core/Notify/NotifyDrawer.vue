<script setup>
import { coreStore, notifyStore } from '@/store'
const core = coreStore()
const notify = notifyStore()
</script>

<template>
  <div class="text-center">
    <v-navigation-drawer
      width="320"
      elevation="0"
      rounded
      v-model="core.notify"
      location="right"
      style="height: calc(100vh - 16px); margin: 8px auto"
      hide-overlay
      temporary
      color="transparent"
      class="pr-1"
    >
      <v-card class="h-100">
        <v-card-title>Notificações</v-card-title>
        <v-divider />
        <div class="overflow-auto" style="height: calc(100vh - 70px)">
          <v-card
            v-for="message in notify.messages"
            :key="message.id"
            max-width="344"
            class="text-left"
            elevation="0"
            :title="message.notification.title"
            prepend-icon="mdi-cash-multiple"
            :append-icon="message.read ? 'mdi-check-all' : 'mdi-check'"
          >
            <v-card-text>
              {{ message.notification.notes }}
            </v-card-text>
          </v-card>
        </div>
        <!-- {{ notify.messages }} -->
      </v-card>
    </v-navigation-drawer>
  </div>
</template>
