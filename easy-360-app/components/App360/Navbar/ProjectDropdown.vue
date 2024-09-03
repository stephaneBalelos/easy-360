<template>
  <UDropdown
    v-slot="{ open }"
    mode="hover"
    :items="[items, actions]"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      class="w-full"
    >
      <UAvatar size="2xs" :alt="editorState.selectedProject.value?.name" />

      <span class="truncate text-gray-900 dark:text-white font-semibold">{{
        editorState.selectedProject.value?.name
      }}</span>
    </UButton>
  </UDropdown>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";

const { projects } = useProjects();
const editorState = useEditorState();


const items = computed(() => {
  if (!projects.value) return [];
  return projects.value.map((project) => {
    return {
      label: project.name,
      avatar: {
        src: "https://avatars.githubusercontent.com/u/23360933?s=200&v=4",
      },
      click: () => {
        editorState.selectedProjectId.value = project.id;
      },
    };
  });
});


const actions = [
  {
    label: "New project",
    icon: "i-heroicons-plus-circle",
  },
  {
    label: "Überblick",
    icon: "i-heroicons-cog-8-tooth",
    to: "/app",
  },
];

</script>
