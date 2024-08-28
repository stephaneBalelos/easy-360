<template>
  <TresCanvas>
    <TresPerspectiveCamera
      ref="camera"
      :position="cameraPosition"
      :look-at="[0, 0, 0]"
    />
    <OrbitControls
      @change="onChange"
      ref="orbitsControls"
      :target="new Vector3(0, 0, 0)"
    />
    <TresAmbientLight :intensity="1" />
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

const { pois } = usePOIs();

const cameraPosition = ref([3, 0, 0]);

const camera = shallowRef();
const orbitsControls = shallowRef();

function onChange($event: OrbitControlsType) {
  console.log($event.object.position);
  cameraPosition.value = [
    $event.object.position.x,
    $event.object.position.y,
    $event.object.position.z,
  ];
}
</script>

<style scoped></style>
