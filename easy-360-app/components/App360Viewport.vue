<template>
  <div
    ref="canvasContainer"
    class="canvas-container"
    :style="`--aspect-ratio: ${viewportSize};`"
  >
    <!-- <div class="w-full h-full bg-red-800"></div> -->

    <TresCanvas>
      <TresPerspectiveCamera :position="[2, 0, 0]" />
      <OrbitControls />
      <TresGridHelper />
      <primitive :object="sphere" @click="handleSphereClick" />
      <TresAmbientLight :intensity="1" />

      <Sphere v-for="marker in markers" :args="[10, 10, 10]" :position="[marker.position.x, marker.position.y, marker.position.z]">
        <TresMeshToonMaterial color="pink" />
      </Sphere>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { OrbitControls } from "@tresjs/cientos";
import { useLoader, type Intersection } from "@tresjs/core";
import {
  EquirectangularReflectionMapping,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Spherical,
  SRGBColorSpace,
} from "three";
import type { POI } from "~/composables/usePOI";

type Props = {
  viewportSize: number;
};

const { viewportSize } = defineProps<Props>();

const canvasContainer = ref<HTMLDivElement | null>(null);

const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

const texture = await useTexture(["/textures/5.jpg"]);
texture.colorSpace = SRGBColorSpace;
// texture.mapping = EquirectangularReflectionMapping
const material = new MeshBasicMaterial({ map: texture });

material.map = texture;

const sphere = new Mesh(geometry, material);

const markers = ref<POI[]>([]);

function handleSphereClick(event: Intersection) {
  console.log(event.point, event.distance);
  const poi: POI = {
    id: Math.random().toString(36).substring(7),
    position: event.point,
    name: "New POI",
    description: "Description",
  };
    addPOI(poi);
}

function addPOI(poi: POI) {
  markers.value.push(poi);
}
</script>

<style scoped>
.canvas-container {
  height: 100%;
  position: relative;
}

#canvas {
  width: 100%;
  height: 100%;
}
</style>
