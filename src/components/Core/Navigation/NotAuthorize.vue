<template>
  <v-sheet class="d-flex bg-transparent" height="calc(100vh - 120px)">
    <v-card class="align-self-center bg-transparent mx-auto pa-5" elevation="0">
      <img src="/assets/img/stop.svg" height="370" alt="" />
      <v-card-title class="text-center">
        <!-- <v-icon large left class="text-error"> mdi-cancel </v-icon> -->
        <span class="text-h6"> Rota não autorizada!</span>
      </v-card-title>

      <div class="mt-5">
        <v-btn class="mr-2 rounded-pill" color="orange" to="/">Ir para a Home</v-btn>
        <v-btn class="rounded-pill" color="blue-grey-lighten-3" @click="this.$router.go(-1)">
          Voltar para a página anterior
        </v-btn>
      </div>
      <!-- <v-btn class="error__button error__button--active mt-0" to="/">Ir para a Home</v-btn>
      <v-btn block variant="outlined" @click="this.$router.go(-1)">
        voltar para a página anterior
      </v-btn> -->
    </v-card>
  </v-sheet>
</template>
  