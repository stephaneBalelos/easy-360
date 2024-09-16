<template>
  <TresCanvas>
    <TresPerspectiveCamera
      ref="camera"
      :position="[sceneControl.camera.position[0], sceneControl.camera.position[1], sceneControl.camera.position[2]]"
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
</template>

<script setup lang="ts">
import { usePOIs } from "~/composables/usePOIs";
import { OrbitControls } from "@tresjs/cientos";
import type { OrbitControls as OrbitControlsType } from "three/examples/jsm/Addons.js";
import { Vector3 } from "three";
import AppPoiMesh from "./App360CanvasComponents/AppPoiMesh.vue";
import AppSphereMesh from "./App360CanvasComponents/AppSphereMesh.vue";
import { useSceneControl } from "~/composables/useSceneControl";

const { pois } = usePOIs();


const camera = shallowRef();
const orbitsControls = shallowRef();

const sceneControl = useSceneControl();

function onChange($event: OrbitControlsType) {
  sceneControl.camera.position = [
    $event.object.position.x,
    $event.object.position.y,
    $event.object.position.z,
  ];
}
</script>

<style scoped></style>
