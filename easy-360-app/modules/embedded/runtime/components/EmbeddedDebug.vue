<template></template>

<script setup lang="ts">
import { useRenderLoop } from "@tresjs/core";

const { onLoop } = useRenderLoop();


let frames = 0;
let prevTime = performance.now();

onLoop(() => {
  frames++;
  const time = performance.now();

  if (time >= prevTime + 1000) {
    console.log(Math.round((frames * 1000) / (time - prevTime)));

    frames = 0;
    prevTime = time;
  }
});
</script>

<style scoped></style>
