<template>
  <div
    class="marker"
    v-if="cameraContext && show && screenCoords && !isLoading"
    :style="`--left: ${screenCoords.x}; --top: ${screenCoords.y};`"
  >
    <button @click="() => handleMarkerClick()" class="marker-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 20 20"
      >
        <g fill="currentColor">
          <path d="M10 12.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5" />
          <path
            fill-rule="evenodd"
            d="M.664 10.59a1.65 1.65 0 0 1 0-1.186A10 10 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41c.147.381.146.804 0 1.186A10 10 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41M14 10a4 4 0 1 1-8 0a4 4 0 0 1 8 0"
            clip-rule="evenodd"
          />
        </g>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AppPOI } from "~/types/app.types";
import { defineProps, onMounted, ref, watch } from "vue";
import { usePreviewState } from "../composables/usePreviewState";
import { Vector3 } from "three";
import { mapRange } from "./../helpers";
import { usePreviewControls } from "../composables/usePreviewControls";

const props = defineProps<AppPOI>();
const { cameraContext, cameraPosition, isLoading, selectedPoiId, selectedPoi } = usePreviewState();
const { cameraLookAt } = usePreviewControls()
const show = ref(false);
const screenCoords = ref<{ x: number; y: number }>();

onMounted(() => {
  console.log("Mounted");
});

watch(
  [cameraPosition, cameraContext],
  (value) => {
    getMarkerScreenPosition();
  },
  { immediate: true, deep: true }
);

function getMarkerScreenPosition() {
  if (!cameraContext.value) return;


  const position = new Vector3(
    props.design_data.position.x,
    props.design_data.position.y,
    props.design_data.position.z
  );
  position.project(cameraContext.value);
  const screenPos = {
    x: mapRange(position.x, -1, 1, 0, 100),
    y: 100 - mapRange(position.y, -1, 1, 0, 100),
  };

  // TODO: Position "z" is not accurate, need to find a way to hide the marker when it's not visible
  if (
    screenPos.x < 0 ||
    screenPos.x > 100 ||
    screenPos.y < 0 ||
    screenPos.y > 100 ||
    position.z > 1
  ) {
    show.value = false;
    return;
  } else {
    show.value = true;
    screenCoords.value = screenPos;
  }
}

function handleMarkerClick() {
  selectedPoiId.value = props.id
  if (selectedPoi.value) {
    console.log('clickc ')
    const position = selectedPoi.value.design_data.position
    cameraLookAt(new Vector3(
      position.x,
      position.y,
      position.z
    ))
  }
}

// console.log(props)
</script>

<style scoped>
.marker {
  position: absolute;
  top: calc(var(--top) * 1%);
  left: calc(var(--left) * 1%);
  transform: translate(-50%, -50%);
}

.marker:hover {
  cursor: pointer;
}
</style>
