<template>
  <div
    :class="`marker ${isTransitioning ? 'marker-transitioning' : ''}`"
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
    <div v-if="showMarkerLabel" class="marker-label">
      {{ props.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppPOI } from "~/types/app.types";
import { defineProps, onMounted, ref, watch, computed } from "vue";
import { usePreviewState } from "../composables/usePreviewState";
import { Vector2, Vector3 } from "three";
import { mapRange } from "./../helpers";
import { usePreviewControls } from "../composables/usePreviewControls";
import type { POIResponse } from "../types";

const props = defineProps<POIResponse>();
const { isLoading, selectedPoiId, selectedPoi } = usePreviewState();
const { cameraPosition, cameraContext, changeScene, cameraLookAt, isTransitioning, cameraProps } = usePreviewControls();
const show = ref(false);
const screenCoords = ref<{ x: number; y: number }>();



watch(
  [cameraPosition, cameraProps],
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

const showMarkerLabel = computed(() => {
  if(!screenCoords.value) return
  const pos = new Vector2(screenCoords.value.x, screenCoords.value.y)
  const center = new Vector2(50, 50)

  const mag = center.distanceTo(pos)

  return mag < 40


})

function handleMarkerClick() {
  selectedPoiId.value = props.id
  if (selectedPoi.value) {
    const position = selectedPoi.value.design_data.position
    cameraLookAt(new Vector3(
      position.x,
      position.y,
      position.z
    ))

  }
}

</script>

<style lang="scss" scoped>
.marker {
  position: absolute;
  pointer-events: auto;
  top: calc(var(--top) * 1%);
  left: calc(var(--left) * 1%);
  transform: translate(-50%, -50%);
  cursor: auto;
  opacity: 1;
  transition: opacity .3s;

  &.marker-transitioning {
    opacity: 0;
  }

  .marker-btn {
    padding: .5rem;
    background-color: rgba(var(--color-primary) / .75);
    color: rgba(var(--color-body) / 1);
    border-radius: 100%;
    border: none;
    outline: none;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background-color: rgba(var(--color-primary) / 1);
    }
  }
  
  .marker-label {
    min-width: 200px;
    max-width: 300px;
    width: 100%;
    position: absolute;
    top: calc(100% + 1rem);
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    color: rgba(var(--color-body) / 1);
    text-align: center;
    font-weight: 700;
    font-size: 1.2rem;
    padding: .25rem;
  }

}
</style>
