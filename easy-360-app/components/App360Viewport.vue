<template>
  <div
    ref="canvasViewport"
    class="canvas-viewport"
  >
    <App360Canvas :width="viewportSize.width" :height="viewportSize.height" />
    <!-- <div class="w-full h-full bg-slate-700">
    </div> -->
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

const { currentBreakpoint, viewportSize } = useEditorBreakpoints();

onMounted(() => {
  window.addEventListener("resize", () => {
    viewportSize.value = getViewportSize();
  });
  viewportSize.value = getViewportSize();
});


watch([width, height], () => {
  viewportSize.value = getViewportSize();
}, { immediate: true });

watch(currentBreakpoint, () => {
  viewportSize.value = getViewportSize();
}, { immediate: true });

function getViewportSize() {
  const size = {
    width: currentBreakpoint.value.width,
    height: currentBreakpoint.value.height,
  };

  const ratio = size.width / size.height;

  if (ratio > 1) {
    size.width = size.width > width.value ? width.value : size.width;
    size.height = size.width / ratio;

    if(size.height > height.value) {
      size.height = height.value;
      size.width = size.height * ratio;
    }
  } else {
    size.height = size.height > height.value ? height.value : size.height;
    size.width = size.height * ratio;

    if(size.width > width.value) {
      size.width = width.value;
      size.height = size.width / ratio;
    }
  }

  return {
    width: Math.round(size.width),
    height: Math.round(size.height),
  };
}
</script>

<style scoped>
.canvas-viewport {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

</style>
