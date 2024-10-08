<template>
  <div ref="canvasViewport" class="canvas-viewport">
    <App360Canvas
      v-if="data"
      :width="viewportSize.width"
      :height="viewportSize.height"
      :data="data"
    />
    <div v-else>Loading...</div>
    <!-- <div class="w-full h-full bg-slate-700">
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useParentElement, useElementSize } from "@vueuse/core";

import { useEditorBreakpoints } from "~/composables/useEditorBreakpoints";
import { projectFilesBucketId } from "~/constants";

type Props = {
  viewportRatio?: number;
};

const props = defineProps<Props>();

const preview = usePreview();
const runtimeConfig = useRuntimeConfig().public

const { selectedProjectId, selectedProject } = useEditorState();
const client = useSupabaseClient();

const { scenes, getSceneFileUrlPublic } = useScenes();
const { pois } = usePOIs();

const canvasViewport = ref<HTMLDivElement | null>(null);

const parentEl = useParentElement();
const { width, height } = useElementSize(parentEl);

const { currentBreakpoint, viewportSize } = useEditorBreakpoints();

const data = computed(() => {
  if(!selectedProject.value) return null;
  const previewData: PreviewData = {
    project: {
      id: selectedProject.value.id,
      title: selectedProject.value.name,
    },
    theme: selectedProject.value.settings,
    scenes: scenes.items.map((s) => {
      return {
        id: s.data.id,
        title: s.data.name,
        description: s.data.description,
        url: getSceneFileUrlPublic(s.data.project_id, s.data.id),
      }
    }),
    pois: pois.items.map((p) => {
      return {
        id: p.data.id,
        sceneId: p.data.scene_id,
        title: p.data.name,
        description: p.data.description,
        position: (p.data.design_data as DesignProps).position,
      }
    }),

  };
  return previewData;
})

onMounted(() => {
  window.addEventListener("resize", () => {
    viewportSize.value = getViewportSize();
  });
  viewportSize.value = getViewportSize();
});

watch(
  currentBreakpoint,
  () => {
    viewportSize.value = getViewportSize();
  },
  { immediate: true }
);

function getViewportSize() {
  const size = {
    width: currentBreakpoint.value.width,
    height: currentBreakpoint.value.height,
  };

  const ratio = size.width / size.height;

  if (ratio > 1) {
    size.width = size.width > width.value ? width.value : size.width;
    size.height = size.width / ratio;

    if (size.height > height.value) {
      size.height = height.value;
      size.width = size.height * ratio;
    }
  } else {
    size.height = size.height > height.value ? height.value : size.height;
    size.width = size.height * ratio;

    if (size.width > width.value) {
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
