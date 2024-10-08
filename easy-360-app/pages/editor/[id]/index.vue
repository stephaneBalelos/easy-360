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
          <PartialsAppVersionBadge />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <UDashboardPanel grow>
      <UDashboardToolbar>
        <template #left>
          <BreakpointsDropdown />
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
        <App360Viewport />
      </div>
      <UDashboardToolbar>
        <template #left>
          {{ viewportSize.width }} x {{ viewportSize.height }}
        </template>
        <template #right> </template>
      </UDashboardToolbar>
    </UDashboardPanel>

    <UDashboardPanel
      :width="250"
      class="border-l border-gray-200 dark:border-gray-700">
      <App360GlobalEditor v-if="editPanelState == 'global'" />
      <App360SceneEditor v-if="editPanelState == 'scene'" />
      <App360PoiEditor v-if="editPanelState == 'poi'" />
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
import { projectKey } from "~/constants";

definePageMeta({
  layout: "editor",
});

const route = useRoute();
const id = route.params.id;
const { selectedProjectId, selectedProject, selectedSceneId, editPanelState } = useEditorState();

selectedProjectId.value = id as string;
const { currentBreakpoint, viewportSize } = useEditorBreakpoints();
const client = useSupabaseClient();

const { scenes } = useScenes();
const { pois } = usePOIs();

const { data: project, error } = useAsyncData(`${projectKey}/${selectedProjectId.value}`, async () => {
  if (!selectedProjectId.value) return;
  const { data, error } = await client.from(projectKey).select('*, scenes(*), points_of_interest(*)').eq('id', selectedProjectId.value).single();
  if (error) {
    createError({
      statusCode: 400,
      message: 'Project not found',
    })
    throw error;
  }
  if (!data) {
    createError({
      statusCode: 400,
      message: 'Project not found',
    })
    throw new Error('Project not found');
  }

  const {scenes:s, points_of_interest:p, ...project} = data;

  selectedProject.value = {
    ...project,
    settings: project.settings as ProjectSettings
  };


  scenes.items = data.scenes.map((scene) => {
    return {
      data: scene,
      loading: false,
    };
  });
  scenes.loading = false;
  selectedSceneId.value = scenes.items[0].data.id;

  pois.items = data.points_of_interest.map((poi) => {
    return {
      data: {
        ...poi,
        design_data: poi.design_data as DesignProps,
      },
      loading: false,
    };
  });
  pois.loading = false;

  return data;
});
</script>

<style scoped></style>
