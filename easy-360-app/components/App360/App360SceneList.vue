<template>
    <UDashboardSidebarLinks :links="links" />
  </template>
  
  <script setup lang="ts">
import { useEditorState } from "~/composables/useEditorState";
import { useScenes } from "~/composables/useScenes";
  
  const { scenes } = useScenes();
  const editorState = useEditorState();
  
  
  const items = computed(() => {
    if (!scenes.value) return [];
    return scenes.value.map((scene) => {
      return {
        label: scene.name,
        chip: "green",
        active: editorState.selectedSceneId.value === scene.id,
        click: () => {
            editorState.selectedSceneId.value = scene.id;
        },
      };
    });
  });
  
  const links = computed(() => [{
    label: "Scenes",
    // draggable: true,
    children: items.value,
  }])
  </script>
  
  <style scoped></style>