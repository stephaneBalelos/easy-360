<template>
  <div class="flex flex-col h-full">
    <UTabs v-if="selectedPOIId" :items="tabs" @change="onChange">
      <template #default="{ item, index, selected }">
        <span
          class="truncate"
          :class="[selected && 'text-primary-500 dark:text-primary-400']"
          >{{ index + 1 }}. {{ item.label }}</span
        >
      </template>
      <template #item="{ item }">
        <UCard>
          <!-- <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ item.description }}
          </p>
        </template> -->

          <div v-if="item.key === 'design-tab'" class="space-y-3">
            <PoiEditorDesign />
          </div>
          <div v-else-if="item.key === 'content-tab'" class="space-y-3">
            <PoiEditorContent />
          </div>
          <div v-else-if="item.key === 'settings-tab'" class="space-y-3">
            <PoiEditorSettings />
          </div>

          <!-- <template #footer>
          <UButton type="submit" color="black">
            Save {{ item.key === 'account' ? 'account' : 'password' }}
          </UButton>
        </template> -->
        </UCard>
      </template>
    </UTabs>
    <UPageCard
      v-else
      title="Add a POI"
      description="Add a new Point of Interest to your 360 view"
      icon="i-heroicons-squares-plus"
    />
  </div>
</template>

<script setup lang="ts">
import PoiEditorContent from "./App360PoiEditorComponents/PoiEditorContent.vue";
import PoiEditorDesign from "./App360PoiEditorComponents/PoiEditorDesign.vue";
import PoiEditorSettings from "./App360PoiEditorComponents/PoiEditorSettings.vue";
import PoiEditorDefault from "./App360PoiEditorComponents/PoiEditorDefault.vue";
import { useEditorState } from "~/composables/useEditorState";

const { selectedPOIId } = useEditorState();

const tabs = [
  {
    key: "design-tab",
    label: "Tab1",
    icon: "i-heroicons-information-circle",
    content: "This is the content shown for Tab1",
  },
  {
    key: "content-tab",
    label: "Tab2",
    icon: "i-heroicons-arrow-down-tray",
    content: "And, this is the content for Tab2",
  },
  {
    key: "settings-tab",
    label: "Tab3",
    icon: "i-heroicons-eye-dropper",
    content: "Finally, this is the content for Tab3",
  },
];

function onChange(key: string) {
  console.log(key);
}
</script>

<style scoped></style>
