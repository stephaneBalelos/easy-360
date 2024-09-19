<template>
  <UDashboardPanelContent>
    <UDashboardSection
      icon="i-heroicons-user"
      title="Profile"
      description="This information will be displayed publicly."
      orientation="vertical"
      class="px-4 mt-6"
    >
    <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
        <UDashboardCard v-for="project in projects" :key="project.id" :title="project.name" :description="project.description ?? ''">
            <template #links>
                <UButton
                    label="open in editor"
                    color="gray"
                    :to="`/editor/${project.id}`"
                />
            </template>
        </UDashboardCard>
        <UCard>
            <div class="grid place-items-center	">
                <UButton
                    label="Create new project"
                    color="gray"
                    to="/editor"
                />
            </div>
        </UCard>
    </div>
</UDashboardSection>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">

    const { projects } = useProjects()
</script>

<style scoped></style>
