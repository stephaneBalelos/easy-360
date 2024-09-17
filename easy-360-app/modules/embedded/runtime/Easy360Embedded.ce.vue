<template>
  <div class="canvas-container" :style="`--width: ${size.width}; --height: ${size.height};`">
    <TresCanvas clear-color="#82DBC5" v-if="data">
      <TresPerspectiveCamera :position="[3, 0, 0]" />
      <OrbitControls />
      
      <Suspense>
        <EmbeddedSphere :url="data.scenes[1].url" ></EmbeddedSphere>
      </Suspense>

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
import EmbeddedSphere from "./components/EmbeddedSphere.vue";
import { Suspense } from "vue";


type Props = {
  id: string;
  width?: number;
  height?: number;
}

const isLoading = ref(true);

const props = defineProps<Props>();

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
}).get().json<PreviewResponse>();

if (error.value) {
  console.error(error.value);
}


</script>

<style scoped>
.canvas-container {
  width: var(--width);
  height: var(--height);
  position: relative;
}
</style>
