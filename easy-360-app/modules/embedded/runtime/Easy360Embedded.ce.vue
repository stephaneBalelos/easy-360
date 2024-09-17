<template>
  <div class="canvas-container" :style="`--width: ${size.width}; --height: ${size.height};`">
    <TresCanvas clear-color="#82DBC5">
      <TresPerspectiveCamera :position="[9, 9, 9]" />
      <OrbitControls />
      <primitive ref="sphereRef" :object="sphere" />
      <Box :args="[1, 1, 1]" color="orange" />

      <TresDirectionalLight
        :position="[0, 2, 4]"
        :intensity="1.2"
        cast-shadow
      />
    </TresCanvas>
    <EmbeddedLoading v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import { onMounted, ref, computed } from "vue";
import { Mesh, MeshBasicMaterial, SphereGeometry } from "three";
import { useFetch } from '@vueuse/core'
import EmbeddedLoading from './components/EmbeddedLoading.vue';
import { Box } from "@tresjs/cientos";
import type { PreviewResponse } from "./types";


type Props = {
  id: string;
  width?: number;
  height?: number;
}

const isLoading = ref(true);

const props = defineProps<Props>();
const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);
const material = new MeshBasicMaterial();

const sphere = new Mesh(geometry, material);

const size = computed(() => {
  return {
    width: props.width ? `${props.width}px` : '100%',
    height: props.height ? `${props.height}px` : '100%',
  };
});


const { isFetching, error, data } = useFetch<PreviewResponse>("http://localhost:3000/api/preview?id=" + props.id, {
  afterFetch(ctx) {
    console.log(ctx);

    return ctx
  },
}).get().json();

if (error.value) {
  console.error(error.value);
}




onMounted(() => {
  console.log(data.value);
});
</script>

<style scoped>
.canvas-container {
  width: var(--width);
  height: var(--height);
  position: relative;
}
</style>
