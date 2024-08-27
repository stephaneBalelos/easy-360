<template>
  <div
    ref="canvasViewport"
    class="canvas-viewport"
    :style="`--v-width: ${viewport.width}px; --v-height: ${viewport.height}px;`"
  >
    <!-- <div class="w-full h-full bg-red-800"></div> -->

    <TresCanvas>
      <TresPerspectiveCamera :position="[2, 0, 0]" />
      <OrbitControls />
      <TresGridHelper />
      <primitive :object="sphere" @click="handleSphereClick" />
      <TresAmbientLight :intensity="1" />

      <Sphere
        v-for="marker in markers"
        :args="[10, 10, 10]"
        :position="[marker.position.x, marker.position.y, marker.position.z]"
      >
        <TresMeshToonMaterial color="pink" />
      </Sphere>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { useParentElement, useElementSize } from "@vueuse/core";
import { OrbitControls } from "@tresjs/cientos";
import { useLoader, type Intersection } from "@tresjs/core";
import {
  EquirectangularReflectionMapping,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Spherical,
  SRGBColorSpace,
  Vector2,
} from "three";
import type { POI } from "~/composables/usePOI";
import { useEditorBreakpoints } from "~/composables/useEditorBreakpoints";

type Props = {
  viewportRatio?: number;
};

const props = defineProps<Props>();

const canvasViewport = ref<HTMLDivElement | null>(null);

const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

const texture = await useTexture(["/textures/5.jpg"]);
texture.colorSpace = SRGBColorSpace;
// texture.mapping = EquirectangularReflectionMapping
const material = new MeshBasicMaterial({ map: texture });

material.map = texture;

const sphere = new Mesh(geometry, material);

const markers = ref<POI[]>([]);

const parentEl = useParentElement();
const { width, height } = useElementSize(parentEl);

const { currentBreakpoint } = useEditorBreakpoints();

const viewport = computed(() => {
  const size = {
    width: currentBreakpoint.value.width,
    height: currentBreakpoint.value.height,
  };

  const ratio = size.width / size.height;

  if (size.width > width.value && size.width >= size.height) {
    size.width = width.value;
    size.height = width.value * ratio;
    if (size.height > height.value) {
      size.width = size.width - (size.height - height.value) * ratio;
      size.height = height.value;
    }
  } else {
    size.height = height.value;
    size.width = height.value * ratio;
  }

  return {
    width: Math.round(size.width),
    height: Math.round(size.height),
  };
});

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
.canvas-viewport {
  width: var(--v-width);
  height: var(--v-height);
  margin: 0 auto;
  position: relative;
}

#canvas {
  width: 100%;
  height: 100%;
}
</style>
