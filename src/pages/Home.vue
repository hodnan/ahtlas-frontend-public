<script setup>
  // import Notify from '@/components/Core/Notify/NotifyDesktop.vue'
</script>
<template>
  <!-- <Notify
    title="Novo Termo de RV"
    body="você tem um termo para ler!"
    icon="/assets/img/Ahtlas_logo_bg_gradiente.png"
    link="http://localhost:3000/for-me/incentives/terms-to-signature"
  /> -->

  <v-carousel show-arrows="hover" cycle hide-delimiter-background height="100%">
    <v-carousel-item src="/assets/img/banner/placeholder.svg" cover />
  </v-carousel>
</template>

<script>
  export default {
    name: 'AnimatedCircle'
  }
</script>

<style>
  .circle {
    width: 300px;
    height: 300px;
    border: 7px solid white;
    border-radius: 50%;
    background-color: transparent;
    animation: rotateHorizontal 2s linear 2;
    -webkit-box-shadow: 11px 10px 5px -10px rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 11px 10px 5px -10px rgba(0, 0, 0, 0.5);
    box-shadow:
      0 0 10px rgba(0, 0, 0, 0.1),
      inset 0 0 10px rgba(0, 0, 0, 0.1);
  }

  @keyframes rotateHorizontal {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(180deg);
    }
  }
</style>
