<template>
  <div class="app-360-canvas" :style="`width: ${props.width}px; height: ${props.height}px;`">
    <TresCanvas>
      <AppSceneCamera ref="camera" />
      <OrbitControls
        @change="onChange"
        ref="orbitsControls"
        :target="new Vector3(0, 0, 0)"
        :maxDistance="100"
      />
      <TresAmbientLight :intensity="sceneControl.light.intensity" />
      <TresGridHelper />
      <Suspense>
        <AppSphereMesh />
      </Suspense>
      <Suspense>
        <AppPoiMesh v-for="poi in pois" v-bind="poi" :key="poi.id" />
      </Suspense>
    </TresCanvas>

    <AppPoiMarker v-if="editorState.tresCameraContext && !editorState.isSceneLoading.value" v-for="poi in pois" v-bind="poi" :key="poi.id" />

    <SceneErrorCard v-if="editorState.sceneError.value" />

    <div
      v-if="editorState.isSceneLoading.value"
      class="viewport-loading-indicator absolute inset-0 grid place-items-center bg-primary/25"
    >
      <UIcon name="i-heroicons-arrow-path" class="loading-icon w-10 h-10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePOIs } from "~/composables/usePOIs";
import { OrbitControls } from "@tresjs/cientos";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/Addons.js";
import { Camera, Vector3 } from "three";
import AppPoiMesh from "./App360CanvasComponents/AppPoiMesh.vue";
import AppSphereMesh from "./App360CanvasComponents/AppSphereMesh.vue";
import AppPoiMarker from "./App360CanvasComponents/AppPoiMarker.vue";
import SceneErrorCard from "./App360CanvasComponents/SceneErrorCard.vue";
import { useSceneControl } from "~/composables/useSceneControl";
import AppSceneCamera from "./App360CanvasComponents/AppSceneCamera.vue";

const { pois } = usePOIs();

type Props = {
  width?: number;
  height?: number;
}

const props = defineProps<Props>();

const size = computed(() => {
  return {
    width: props.width ? `${props.width}px` : '100%',
    height: props.height ? `${props.height}px` : '100%',
  };
});

const { width, height } = useWindowSize()
const screenRatio = computed(() => {
  return width.value / height.value
})



const camera = shallowRef<Camera | null>(null);
const orbitsControls = shallowRef();

const sceneControl = useSceneControl();
const editorState = useEditorState();

function onChange($event: OrbitControlsType) {
  sceneControl.camera.position = [
    $event.object.position.x,
    $event.object.position.y,
    $event.object.position.z,
  ];
}

</script>

<style lang="scss" scoped>
.app-360-canvas {

  margin: 0 auto;
  position: relative;

  #canvas {
    width: 100%;
    height: 100%;
  }
}

.app-360-canvas .viewport-loading-indicator .loading-icon {
    animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
