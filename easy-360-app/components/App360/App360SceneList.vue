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
      const isCurrentScene = editorState.selectedSceneId.value === scene.id;
      return {
        label: scene.name,
        chip: "green",
        active: isCurrentScene,
        click: () => {
            editorState.selectedSceneId.value = scene.id;
            if (isCurrentScene) {
              editorState.selectedPOIId.value = null;
            }
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