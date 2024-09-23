<template>
  <UDashboardNavbar>
    <template #toggle>
      <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
      <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
    </template>
    <template #left>
      <PartialsAppVersionBadge />
      <ProjectDropdown />
      <UDivider orientation="vertical" class="mx-1.5" />
      <BreakpointsDropdown />
    </template>
    <template #right>
      <UDivider orientation="vertical" class="mx-1.5" />

      <UButton
        color="gray"
        label="leave preview"
        variant="solid"
        :to="`/editor/${selectedProjectId}`"
        trailing
      />
    </template>
  </UDashboardNavbar>
</template>

<script setup lang="ts">
import ProjectDropdown from './Navbar/ProjectDropdown.vue';
import BreakpointsDropdown from './Navbar/BreakpointsDropdown.vue';
const { selectedProjectId } = useEditorState();
const { breakpoints, currentBreakpoint } = useEditorBreakpoints();
</script>

<style scoped></style>
