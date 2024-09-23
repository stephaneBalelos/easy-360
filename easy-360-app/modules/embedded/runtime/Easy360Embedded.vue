<template>
  <div class="canvas-container" :style="`--width: ${size.width}; --height: ${size.height}; --screen-ratio: ${screenRatio};`">
    <TresCanvas v-if="selectedScene">
      <EmbeddedCamera />
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

    <!-- <EmbeddedMarker v-if="selectedScene" v-for="poi in selectedScene.points_of_interest" v-bind="poi" :key="poi.id" /> -->

    <!-- <EmbeddedScenesListCe></EmbeddedScenesListCe>

    <EmbeddedSceneInfos v-if="selectedScene" /> -->

    <!-- <EmbeddedLoading v-if="isLoading" /> -->

  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/Addons.js";
import { onMounted, ref, computed } from "vue";
import { useWindowSize } from '@vueuse/core'
import EmbeddedLoading from './components/EmbeddedLoading.vue';
import EmbeddedSphere from "./components/EmbeddedSphere.ce.vue";
import { usePreviewState } from "./composables/usePreviewState";
import { Vector3 } from "three";
import { usePreviewControls } from "./composables/usePreviewControls";
import EmbeddedCamera from "./components/EmbeddedCamera.vue";


type Props = {
  id: string;
  width?: number;
  height?: number;
}

const props = defineProps<Props>();
const { isLoading, projectId, selectedScene } = usePreviewState()
const { cameraPosition } = usePreviewControls()

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




const onCameraPositionChange = ($event: OrbitControlsType) => {
  cameraPosition.x = $event.object.position.x
  cameraPosition.y = $event.object.position.y
  cameraPosition.z = $event.object.position.z
}

onMounted(() => {
  if (props.id) {
    projectId.value = props.id
  } else {
    alert('No id provided')
  }

})


</script>

<style lang="scss" scoped>
.canvas-container {
  width: var(--width);
  aspect-ratio: var(--screen-ratio);
  position: relative;
  

  --color-primary: 34 197 94;
  --color-secondary: 17 24 39;
  --color-body: 229 231 235;
  --container-padding: 2rem;

  color: var(--color-body);
}
</style>
