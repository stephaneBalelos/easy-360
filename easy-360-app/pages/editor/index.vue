<template>
  <div
    class="w-full h-full flex justify-center items-center flex-wrap container mx-auto"
  >
    <div v-if="projects" class="flex justify-center flex-wrap gap-4">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="createNewProject"
      >
        <UDashboardCard :title="`New Project`">
          <UFormGroup label="Project Name" name="name">
            <UInput v-model="state.name" type="text" />
          </UFormGroup>

          <UFormGroup label="Project Description" name="description">
            <UTextarea v-model="state.description" type="text" />
          </UFormGroup>

          <template #footer>
            <UButton
              :loading="loading"
              color="gray"
              variant="solid"
              block
              type="submit"
              >Create a project</UButton
            >
          </template>
        </UDashboardCard>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import { useProjects } from "~/composables/useProjects";
import type { FormSubmitEvent } from '#ui/types'


definePageMeta({
  layout: "editor",
});

const { projects, createProject } = useProjects();

const loading = ref(false);

const router = useRouter();

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

type Schema = z.infer<typeof schema>;

const state = reactive({
  name: "",
  description: "",
});



const createNewProject = async ($event: FormSubmitEvent<Schema>) => {

  console.log($event);
  loading.value = true;
  try {
    const res = await createProject({
      name: $event.data.name,
      description: $event.data.description,
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
