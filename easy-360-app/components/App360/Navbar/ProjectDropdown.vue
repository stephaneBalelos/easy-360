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
      <UAvatar size="2xs" :alt="selectedProject?.name" />

      <span class="truncate text-gray-900 dark:text-white font-semibold">{{
        selectedProject?.name
      }}</span>
    </UButton>
  </UDropdown>
</template>

<script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { projectKey } from "~/constants";

const editorState = useEditorState();
const client = useSupabaseClient();

const { data:projects } = useAsyncData(`${projectKey}`, async () => {

  const { data, error } = await client.from(projectKey).select('id, name').order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching project", error);
    return null;
  }
  return data ?? [];
}, {
  lazy: true,
});

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

const selectedProject = computed(() => {
  if (!projects.value) return null;
  const p = projects.value.find((project) => project.id === editorState.selectedProjectId.value);
  return p ?? null
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
