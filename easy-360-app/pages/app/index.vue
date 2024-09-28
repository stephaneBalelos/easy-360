<template>
  <UDashboardPanelContent>
    <UContainer :ui="{base: 'mx-auto w-full'}">
      <UDashboardSection
        v-if="user"
        icon="i-heroicons-user"
        :title="user.user_metadata.name"
        :description="
          new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        "
        orientation="vertical"
        class="px-4 mt-6"
      >
        <div class="grid md:grid-cols-2 gap-4 mt-4">
          <UDashboardCard
            v-for="project in projects"
            :key="project.id"
            :title="project.name"
            :description="project.description ?? ''"
          >
            <template #links>
              <UButton
                label="open in editor"
                color="gray"
                :to="`/editor/${project.id}`"
              />
              <UButton
                icon="i-heroicons-trash"
                color="red"
                @click="openDeleteProjectModal(project.id)"
              />
            </template>
          </UDashboardCard>
          <UCard>
            <div class="grid place-items-center">
              <UButton label="Create new project" color="gray" to="/editor" />
            </div>
          </UCard>
        </div>
      </UDashboardSection>
      <div v-else class="flex items-center space-x-4">
        <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2">
          <USkeleton class="h-4 w-[250px]" />
          <USkeleton class="h-4 w-[200px]" />
        </div>
      </div>
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import AppDeleteProjectModal from '~/components/partials/AppDeleteProjectModal.vue';

const { projects } = useProjects();
const user = useSupabaseUser();

const modal = useModal();
const toast = useToast();

function openDeleteProjectModal(id: string) {
  modal.open(AppDeleteProjectModal, {
    id,
    onSuccess: () => {
      modal.close();
      toast.add({
        title: 'Project deleted',
        color: 'green',
      })
    },
    onError: () => {
      toast.add({
        title: 'Failed to delete project',
        color: 'red',
      })
    },
    onClose: () => {
      modal.close();
    },
  });
}

</script>

<style scoped></style>
