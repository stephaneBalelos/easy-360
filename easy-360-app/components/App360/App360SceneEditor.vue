<template>
  <div class="flex flex-col h-full">
    <SceneEditorSetting v-if="selectedSceneId"></SceneEditorSetting>
    <!-- <UTabs v-if="selectedSceneId" :items="tabs" @change="onChange">
        <template #default="{ item, index, selected }">
          <span
            class="truncate"
            :class="[selected && 'text-primary-500 dark:text-primary-400']"
            >{{ index + 1 }}. {{ item.label }}</span
          >
        </template>
        <template #item="{ item }">
          <UCard>
             <template #header>
            <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ item.description }}
            </p>
          </template>
  
          <SceneEditorSetting></SceneEditorSetting>
  
             <template #footer>
            <UButton type="submit" color="black">
              Save {{ item.key === 'account' ? 'account' : 'password' }}
            </UButton>
          </template>
          </UCard>
        </template>
      </UTabs> -->
  </div>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import SceneEditorSetting from "./App360SceneEditorComponents/SceneEditorSetting.vue";

const { selectedSceneId } = useEditorState();

watch(() => selectedSceneId.value, (newVal) => {
  console.log('selectedSceneId', newVal);
}, { immediate: true });


</script>

<style scoped></style>
