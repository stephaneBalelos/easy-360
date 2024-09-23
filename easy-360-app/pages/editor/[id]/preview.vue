<template>
  <App360PreviewNavbar></App360PreviewNavbar>
  <div ref="viewportEl" class="preview-viewport relative flex-1">
    <Easy360Embedded :id="id" :width="viewport.width" :height="viewport.height"></Easy360Embedded>
    <!-- <div class="bg-gray-700 h-full w-full">{{ width }} X {{ height}}</div> -->
  </div>
  <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
    {{ viewport.width }} x {{ viewport.height }}
  </UDashboardToolbar>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "editor",
});

const route = useRoute();
const id = route.params.id as string;

const { currentBreakpoint, viewportSize } = useEditorBreakpoints();

const viewportEl = ref<HTMLElement | null>(null);
const { width, height } = useElementSize(viewportEl);

onMounted(() => {
  console.log(width.value, height.value);
  console.log(viewport.value)
});

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

<style scoped></style>
