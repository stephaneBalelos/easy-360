<template>
  <div class="flex flex-col h-full">
    <UTabs v-if="editorState.selectedSceneId" :items="tabs" @change="onChange" :ui="{
      list: {
        rounded: '',
      }
    }">
        <template #default="{ item, index, selected }">
          <span
            class="truncate"
            :class="[selected && 'text-primary-500 dark:text-primary-400']"
            >{{ index + 1 }}. {{ item.label }}</span
          >
        </template>
        <template #item="{ item }">
          <div class="flex flex-col px-4">
            <div v-if="item.key === 'content-tab'" class="space-y-3">
              <SceneEditorContent />
            </div>
            <div v-else-if="item.key === 'settings-tab'" class="space-y-3">
              <SceneEditorSettings />
            </div>
          </div>
        </template>
      </UTabs>
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import SceneEditorContent from "./App360SceneEditorComponents/SceneEditorContent.vue";
import SceneEditorSettings from "./App360SceneEditorComponents/SceneEditorSettings.vue";

const editorState = useEditorState();

const tabs = [
  {
    key: "content-tab",
    label: "Content",
    icon: "i-heroicons-arrow-down-tray",
  },
  {
    key: "settings-tab",
    label: "Settings",
    icon: "i-heroicons-eye-dropper",
  },
];

watch(() => editorState.selectedSceneId.value, (newVal) => {
  console.log('selectedSceneId', newVal);
}, { immediate: true });

function onChange(key: string) {
  console.log(key);
}


</script>

<style scoped></style>
