<template>
  <div ref="canvasViewport" class="canvas-viewport">
    <App360Canvas
      v-if="status === 'success' && data"
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

type Props = {
  viewportRatio?: number;
};

const props = defineProps<Props>();

const preview = usePreview();
const runtimeConfig = useRuntimeConfig().public

const { selectedProjectId } = useEditorState();
const client = useSupabaseClient();

const canvasViewport = ref<HTMLDivElement | null>(null);

const parentEl = useParentElement();
const { width, height } = useElementSize(parentEl);

const { currentBreakpoint, viewportSize } = useEditorBreakpoints();

const { data, error, status } = await useAsyncData(
  `preview_${selectedProjectId.value}`,
  async () => {
    if (!selectedProjectId.value) throw new Error("No project selected");

    const { data, error } = await client
      .from("projects")
      .select("id, name, settings, scenes(*), points_of_interest(*)")
      .eq("id", selectedProjectId.value)
      .single();
    if (error) throw error;

    if (!data) throw new Error("Project not found");
    return data;
  },
  {
    lazy: true,
    watch: [selectedProjectId],
    transform: (data) => {
      const d: PreviewData = {
        project: {
          id: data.id,
          title: data.name
        },
        theme: data.settings as ProjectSettings,
        scenes: data.scenes.map((scene) => {
          return {
            id: scene.id,
            title: scene.name,
            description: scene.description,
            url:  `${runtimeConfig.supabaseStorageEndpoint}/${getSceneFilePath(data.id, scene.id)}`
          };
        }),
        pois: data.points_of_interest.map((poi) => {
          return {
            id: poi.id,
            title: poi.name,
            description: poi.description,
            sceneId: poi.scene_id,
            position: {
              x: (poi.design_data as DesignProps).position.x,
              y: (poi.design_data as DesignProps).position.y,
              z: (poi.design_data as DesignProps).position.z,
            },
          };
        }),
      }
      return d;
    },
  }
);

onMounted(() => {
  window.addEventListener("resize", () => {
    viewportSize.value = getViewportSize();
  });
  viewportSize.value = getViewportSize();
});

watch(
  [width, height],
  () => {
    viewportSize.value = getViewportSize();
  },
  { immediate: true }
);

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
