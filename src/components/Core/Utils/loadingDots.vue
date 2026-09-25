<template>
  <div>
    <v-icon :color="item1" size="x-small" icon="mdi-circle-medium" />
    <v-icon :color="item2" size="x-small" icon="mdi-circle-medium" />
    <v-icon :color="item3" size="x-small" icon="mdi-circle-medium" />
  </div>
</template>
  
  <script setup>
import { ref, onMounted  } from "vue";
let item1 = ref("transparent");
let item2 = ref("transparent");
let item3 = ref("transparent");

const blink = () => {
  setTimeout(() => {
    item1.value = "app";
  }, 0);

  setTimeout(() => {
    item2.value = "app";
  }, 400);

  setTimeout(() => {
    item3.value = "app";
  }, 800);

  setTimeout(() => {
    item1.value = "transparent";
    item2.value = "transparent";
    item3.value = "transparent";
  }, 1400);
};
setInterval(() => {
  blink();

}, 1800);

onMounted(() => {
    blink();
   
});
</script>
  
  