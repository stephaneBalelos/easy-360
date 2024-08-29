<template>
  <div
    class="w-full h-full flex justify-center items-center flex-wrap container mx-auto"
  >
    <div v-if="projects" class="flex justify-center flex-wrap gap-4">
      <UDashboardCard
        v-for="project in projects"
        :key="project.id"
        :title="project.name"
        :description="project.description"
        :links="[
          {
            label: 'Open in Editor',
            color: 'gray',
            trailingIcon: 'i-heroicons-arrow-right-20-solid',
            to: `/editor/${project.id}`,
          },
        ]"
      />
      <UDashboardCard :title="`New Project`">
        <UButton :loading="loading" color="gray" variant="solid" block @click="createNewProject">Create a project</UButton>
      </UDashboardCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjects } from "~/composables/useProjects";

definePageMeta({
  layout: "editor",
});

const { projects, createProject } = useProjects();

const loading = ref(false);

const router = useRouter();

const createNewProject = async () => {
    loading.value = true;
    try {
        const res = await createProject({
            name: "New Project",
            description: "A new project",
        });
        if (res[0].id) {
            router.push(`/editor/${res[0].id}`);
        }
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
};


</script>

<style scoped></style>
