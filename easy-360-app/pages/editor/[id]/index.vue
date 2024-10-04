<template>
  <App360EditorNavbar />

</template>

<script setup lang="ts">
import App360Viewport from "~/components/App360Viewport.vue";
import App360PoisList from "~/components/App360/App360PoisList.vue";
import { useEditorBreakpoints } from "~/composables/useEditorBreakpoints";
import App360PoiEditor from "~/components/App360/App360PoiEditor.vue";
import App360SceneList from "~/components/App360/App360SceneList.vue";
import { useEditorState } from "~/composables/useEditorState";
import ProjectEdit from "~/components/App360/Slideovers/ProjectEdit.vue";
import BreakpointsDropdown from "~/components/App360/Navbar/BreakpointsDropdown.vue";
import App360GlobalEditor from "~/components/App360/App360GlobalEditor.vue";

definePageMeta({
  layout: "editor",
});

const route = useRoute();
const id = route.params.id;
const { selectedProjectId, editPanelState } = useEditorState();

selectedProjectId.value = id as string;
const { currentBreakpoint, viewportSize } = useEditorBreakpoints();


const { createScene } = useScenes();

async function AddNewScene() {
  console.log("Add new scene");
  try {
    const res = await createScene({
      name: "New Scene",
      description: "New Scene Description",
    });
    console.log("New Scene", res);
  } catch (error) {
    console.log("Error creating scene", error);
  }
}
</script>

<style scoped></style>
