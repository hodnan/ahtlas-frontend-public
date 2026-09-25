<script setup>
const reloadPage = () => {
  if (typeof window !== 'undefined') {
    // Recarrega a página indo para o caminho base, sem query strings ou hash
    window.location.href = window.location.pathname
  }
}
</script>
<template>
  <v-sheet class="d-flex bg-transparent" height="calc(100vh - 120px)">
    <v-card class="align-self-center bg-transparent mx-auto pa-5" elevation="0">
      <v-card-title class="text-center">
        <span class="text-h1 text-brand_silver font-martel">500</span>
      </v-card-title>
      <v-card-title class="text-center">
        <img src="/assets/img/error500.svg" class="align-self-center" height="200" alt="" />
      </v-card-title>

      <v-card-title class="text-center">
        <span
          class="text-h4 text-brand_silver font-martel"
          style="text-shadow: 2px 2px rgba(0, 0, 0, 0.2)"
        >
          Desculpe, não é você, sou eu.
        </span>
        <br />
        <br />
        <span
          class="text-h3 text-brand_silver rotated-text"
          style="text-shadow: 2px 2px rgba(0, 0, 0, 0.2)"
        >
          :(
        </span>
        <br />
        <br />
        <v-btn class="rounded-pill" color="blue-grey-lighten-2 mr-5" @click="reloadPage">
          Deixe me tentar novamente!
        </v-btn>
        <v-btn class="rounded-pill" color="orange" @click="this.$router.go(-1)">
          Voltar para a página anterior!
        </v-btn>
      </v-card-title>

      <!-- <v-btn class="error__button error__button--active mt-0" to="/">Ir para a Home</v-btn>
      <v-btn block variant="outlined" @click="this.$router.go(-1)">
        voltar para a página anterior
      </v-btn> -->
    </v-card>
  </v-sheet>
</template>

<style scoped>
.rotated-text {
  display: inline-block; /* Necessário para aplicar a transformação */
  transform: rotate(90deg);
}
.font-martel {
  font-family: 'Martel', serif;
  text-shadow: 4px 2px rgba(0, 0, 0, 0.2);
}
</style>
