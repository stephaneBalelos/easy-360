<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar>
        <template #toggle>
          <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
          <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
        </template>
        <template #left>
          <PartialsAppVersionBadge />
          <ProjectDropdown />
          <UTooltip text="Settings">
            <UButton
              icon="i-heroicons-cog"
              color="gray"
              variant="ghost"
              @click="openProjectSettings"
              >Project Settings</UButton
            >
          </UTooltip>
          <UTooltip text="Move to junk">
            <UButton
              icon="i-heroicons-archive-box-x-mark"
              color="gray"
              variant="ghost"
            />
          </UTooltip>
          <UDivider orientation="vertical" class="mx-1.5" />
          <UPopover :popper="{ placement: 'bottom-start' }">
            <template #default="{ open }">
              <UTooltip text="Snooze" :prevent="open">
                <UButton
                  icon="i-heroicons-clock"
                  color="gray"
                  variant="ghost"
                  :class="[open && 'bg-gray-50 dark:bg-gray-800']"
                />
              </UTooltip>
            </template>
            <template #panel="{ close }">
              <!-- <DatePicker @close="close" /> -->
            </template>
          </UPopover>
        </template>
        <template #right>
          <UDivider orientation="vertical" class="mx-1.5" />
          <UTooltip :text="'Show Preview'">
            <UButton
              icon="i-heroicons-eye"
              color="primary"
              label="preview"
              variant="ghost"
              :to="`/editor/${id}/preview`"
              trailing
            />
          </UTooltip>
          <!-- <UDropdown :items="dropdownItems">
                    <UButton
                      icon="i-heroicons-ellipsis-vertical"
                      color="gray"
                      variant="ghost"
                    />
                  </UDropdown> -->
        </template>
      </UDashboardNavbar>
      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import ProjectEdit from "~/components/App360/Slideovers/ProjectEdit.vue";
import ProjectDropdown from "~/components/App360/Navbar/ProjectDropdown.vue";


const route = useRoute();
const id = route.params.id;
const { selectedProjectId, selectedSceneId, selectedPOIId, editPanelState } =
  useEditorState();
selectedProjectId.value = id as string;
const { breakpoints, currentBreakpoint } = useEditorBreakpoints();
const slideover = useSlideover();
function openProjectSettings() {
  if (!selectedProjectId.value) {
    return;
  }
  slideover.open(ProjectEdit, {
    project_id: selectedProjectId.value,
  });
}
</script>

<style scoped></style>
