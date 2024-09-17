<template>
  <div class="app-360-canvas">
    <TresCanvas>
      <TresPerspectiveCamera
        ref="camera"
        :position="[
          sceneControl.camera.position[0],
          sceneControl.camera.position[1],
          sceneControl.camera.position[2],
        ]"
        :look-at="[0, 0, 0]"
      />
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
import { Vector3 } from "three";
import AppPoiMesh from "./App360CanvasComponents/AppPoiMesh.vue";
import AppSphereMesh from "./App360CanvasComponents/AppSphereMesh.vue";
import AppPoiMarker from "./App360CanvasComponents/AppPoiMarker.vue";
import { useSceneControl } from "~/composables/useSceneControl";

const { pois } = usePOIs();

const camera = shallowRef();
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

<style scoped>
.app-360-canvas {
  width: 100%;
  height: 100%;
  position: relative;
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
