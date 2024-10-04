<template>
  <UDashboardToolbar class="py-0 px-2 overflow-x-auto">
    <UHorizontalNavigation :links="tabs" />
  </UDashboardToolbar>

  <div class="p-4">
    <SceneEditorContent v-if="selectedTab === 0" />
    <SceneEditorSettings v-if="selectedTab === 1"  />
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import SceneEditorContent from "./App360SceneEditorComponents/SceneEditorContent.vue";
import SceneEditorSettings from "./App360SceneEditorComponents/SceneEditorSettings.vue";

const editorState = useEditorState();

const selectedTab = ref(0);

const tabs = computed(() => [
  {
    key: "content-tab",
    label: "Content",
    active: selectedTab.value === 0,
    click: () => onChange(0),
  },
  {
    key: "settings-tab",
    label: "Settings",
    active: selectedTab.value === 1,
    click: () => onChange(1),
  },
]);
function onChange(index: number) {
  selectedTab.value = index;
}
</script>

<style scoped></style>
