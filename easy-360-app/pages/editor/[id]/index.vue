<template>
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
            <USelectMenu
              v-model="currentBreakpoint"
              icon="i-heroicons-check-circle"
              placeholder="Status"
              :options="breakpoints"
              :ui-menu="{ option: { base: 'capitalize' } }"
            />
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
          </template>
        </UDashboardToolbar>
      <App360Viewport />
    </div>

    <UDashboardPanel
      :width="250"
      collapsible
      class="border-l border-gray-200 dark:border-gray-700"
    >
      <div v-show="editPanelState != 'none'">
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

definePageMeta({
  layout: "editor",
});

const route = useRoute();
const id = route.params.id;
const { selectedProjectId, selectedSceneId, selectedPOIId, editPanelState } =
  useEditorState();

selectedProjectId.value = id as string;

const { breakpoints, currentBreakpoint } = useEditorBreakpoints();

const { createScene } = useScenes();

const slideover = useSlideover();
function openProjectSettings() {
  if (!selectedProjectId.value) {
    return;
  }
  slideover.open(ProjectEdit, {
    project_id: selectedProjectId.value,
  });
}

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
