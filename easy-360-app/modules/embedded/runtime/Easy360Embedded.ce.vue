<template>
  <div class="canvas-container" :style="`--width: ${size.width}; --height: ${size.height}; --screen-ratio: ${screenRatio};`">
    <TresCanvas clear-color="#82DBC5" v-if="selectedScene">
      <TresPerspectiveCamera :position="[3, 0, 0]" :look-at="[0, 0, 0]" />
      <OrbitControls
        @change="onCameraPositionChange"
        ref="orbitsControls"
        :target="new Vector3(0, 0, 0)"
        :maxDistance="100"
      />
      
      <Suspense>
        <EmbeddedSphere :url="selectedScene.url" ></EmbeddedSphere>
      </Suspense>

      <TresDirectionalLight
        :position="[0, 2, 4]"
        :intensity="1.2"
        cast-shadow
      />
    </TresCanvas>

    <EmbeddedMarker v-if="selectedScene" v-for="poi in selectedScene.points_of_interest" v-bind="poi" :key="poi.id" />

    <EmbeddedLoading v-if="isLoading" />

  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/Addons.js";
import { onMounted, ref, computed } from "vue";
import { useFetch, useWindowSize } from '@vueuse/core'
import EmbeddedLoading from './components/EmbeddedLoading.ce.vue';
import type { PreviewResponse } from "./types";
import EmbeddedSphere from "./components/EmbeddedSphere.ce.vue";
import { Suspense } from "vue";
import EmbeddedMarker from "./components/EmbeddedMarker.ce.vue";
import { usePreviewState } from "./composables/usePreviewState";
import { Vector3 } from "three";



type Props = {
  id: string;
  width?: number;
  height?: number;
}

const props = defineProps<Props>();
const { isLoading, previewData, cameraPosition, selectedScene } = usePreviewState()

const { width, height } = useWindowSize()
const screenRatio = computed(() => {
  return width.value / height.value
})


const size = computed(() => {
  return {
    width: props.width ? `${props.width}px` : '100%',
    height: props.height ? `${props.height}px` : '100%',
  };
});


const { isFetching, error, data } = useFetch<PreviewResponse>("http://localhost:3000/api/preview?id=" + props.id, {
  afterFetch(ctx) {
    console.log(ctx);
    previewData.value = ctx.data as PreviewResponse
    return ctx
  },
}).get().json<PreviewResponse>();

if (error.value) {
  console.error(error.value);
}

const onCameraPositionChange = ($event: OrbitControlsType) => {
  cameraPosition.x = $event.object.position.x
  cameraPosition.y = $event.object.position.y
  cameraPosition.z = $event.object.position.z
}


</script>

<style lang="scss">
.canvas-container {
  width: var(--width);
  aspect-ratio: var(--screen-ratio);
  position: relative;
}
</style>
