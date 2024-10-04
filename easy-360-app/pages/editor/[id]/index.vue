<template>
  <App360EditorNavbar />
  <div class="flex flex-grow">
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <App360SceneList />

        <UDivider />

        <App360PoisList />

        <UDivider />

        <template #footer>
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <UDashboardPanel grow>
      <UDashboardToolbar>
          <template #left>
            <BreakpointsDropdown />
            <div>
              {{ currentBreakpoint.width }} x {{ currentBreakpoint.height }}
            </div>
          </template>
          <template #right>
            <UTooltip text="Global Settings">
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-cog"
                @click="editPanelState = 'global'"
              ></UButton>
            </UTooltip>
          </template>
        </UDashboardToolbar>
        <div class="flex-grow p-4 relative">
          <!-- <App360Viewport /> -->
        </div>
        <UDashboardToolbar>
          <template #left>
            {{ viewportSize.width }} x {{ viewportSize.height }}

          </template>
          <template #right>
          </template>
        </UDashboardToolbar>
    </UDashboardPanel>

    <UDashboardPanel
      :width="250"
      class="border-l border-gray-200 dark:border-gray-700"
      :ui="{
        wrapper: 'flex flex-col justify-between',
      }"
    >
      <!-- <UDashboardSidebar>
        <App360GlobalEditor v-if="editPanelState == 'global'" />
        <App360SceneEditor v-if="editPanelState == 'scene'" />
        <App360PoiEditor v-if="editPanelState == 'poi'" />
      </UDashboardSidebar> -->
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
const { currentBreakpoint, viewportSize } = useEditorBreakpoints();


const { createScene } = useScenes();

</script>

<style scoped></style>
