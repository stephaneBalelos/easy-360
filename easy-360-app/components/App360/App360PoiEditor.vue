<template>
  <UDashboardToolbar class="py-0 px-2 overflow-x-auto">
    <UHorizontalNavigation :links="tabs" />
  </UDashboardToolbar>
  <div class="p-4">
    <!-- <PoiEditorDesign v-if="selectedTab === 0"/> -->
    <PoiEditorContent v-if="selectedTab === 1" />
    <PoiEditorSettings v-if="selectedTab === 2"/>
  </div>
</template>

<script setup lang="ts">
import PoiEditorContent from "./App360PoiEditorComponents/PoiEditorContent.vue";
import PoiEditorDesign from "./App360PoiEditorComponents/PoiEditorDesign.vue";
import PoiEditorSettings from "./App360PoiEditorComponents/PoiEditorSettings.vue";
import PoiEditorDefault from "./App360PoiEditorComponents/PoiEditorDefault.vue";
import { useEditorState } from "~/composables/useEditorState";

const { selectedPOIId } = useEditorState();

const selectedTab = ref(1);


const tabs = computed(() => [
  // {
  //   key: "design-tab",
  //   label: "Design",
  //   active: selectedTab.value === 0,
  //   click: () => onChange(0),
  // },
  {
    key: "content-tab",
    label: "Content",
    active: selectedTab.value === 1,
    click: () => onChange(1),
  },
  {
    key: "settings-tab",
    label: "Settings",
    active: selectedTab.value === 2,
    click: () => onChange(2),
  },
]);

function onChange(index: number) {
  selectedTab.value = index;
}
</script>

<style scoped></style>
