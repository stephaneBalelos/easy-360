<template>
  <div
    ref="canvasViewport"
    class="canvas-viewport"
    :style="`--v-width: ${viewport.width}px; --v-height: ${viewport.height}px;`"
  >
  {{ sceneControl.camera.position[0] }} {{ sceneControl.camera.position[1] }} {{ sceneControl.camera.position[2] }}
    <!-- <div class="w-full h-full bg-red-800"></div> -->
    <App360Canvas></App360Canvas>

  </div>
</template>

<script setup lang="ts">
import { useParentElement, useElementSize } from "@vueuse/core";

import { useEditorBreakpoints } from "~/composables/useEditorBreakpoints";

type Props = {
  viewportRatio?: number;
};

const props = defineProps<Props>();

const canvasViewport = ref<HTMLDivElement | null>(null);


const parentEl = useParentElement();
const { width, height } = useElementSize(parentEl);

const { currentBreakpoint } = useEditorBreakpoints();
const sceneControl = useSceneControl();

const editorState = useEditorState();



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
      size.height = size.width / ratio;
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
</script>

<style scoped>
.canvas-viewport {
  width: var(--v-width);
  height: var(--v-height);
  margin: 0 auto;
  position: relative;
}

.canvas-viewport .viewport-loading-indicator .loading-icon {
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
