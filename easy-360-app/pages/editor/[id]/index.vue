<template>
  <App360EditorNavbar />
  <div class="w-full h-full flex">
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardSidebar>
        <template #header>
          <!-- Place anything you like here -->
          <UDashboardSearchButton />
        </template>

        <App360SceneList />
        <UButton size="xs" variant="ghost" block @click="AddNewScene"
          >Add New Scene</UButton
        >
        <UDivider />

        <App360PoisList />

        <UDivider />

        <template #footer>
          <!-- Place anything you like here -->
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <div class="flex-grow w-full h-full p-0">
        <UDashboardToolbar>
          <template #left>
            <BreakpointsDropdown />
            <!-- <USelectMenu
            v-model="selectedLocations"
            icon="i-heroicons-map-pin"
            placeholder="Location"
            :options="defaultLocations"
            multiple
          /> -->
          </template>

          <template #right>
            <!-- <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label>
              Display
            </template>
          </USelectMenu> -->

          <UTooltip text="Global Settings">
            <UButton color="gray" variant="ghost" icon="i-heroicons-cog" @click="editPanelState = 'global'"></UButton>
          </UTooltip>
          </template>
        </UDashboardToolbar>
      <App360Viewport />
    </div>

    <UDashboardPanel
      :width="250"
      
      class="border-l border-gray-200 dark:border-gray-700"
      :ui="{
        wrapper: 'flex flex-col justify-between',
      }"
    >
      <div>
        <App360GlobalEditor v-if="editPanelState == 'global'" />
        <App360SceneEditor v-if="editPanelState == 'scene'" />
        <App360PoiEditor v-if="editPanelState == 'poi'" />
      </div>
    </UDashboardPanel>
  </div>
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
