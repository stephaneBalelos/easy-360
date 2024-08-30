<template>
  <UDashboardSlideover title="Project Settings" ref="slideover" prevent-close>
    <UForm
      ref="form"
      :state="state"
      :schema="schema"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <UFormGroup
        name="name"
        label="Name"
        description="Name of this project."
        required
        class="grid gap-2"
        :ui="{ container: '' }"
      >
        <UInput v-model="state.name" autocomplete="off" size="md" />
      </UFormGroup>
      <UFormGroup
        name="description"
        label="Project Description"
        description="Describe your Project in detail."
        class="grid gap-2"
        :ui="{ container: '' }"
      >
        <UTextarea v-model="state.description" :rows="5" autoresize size="md" />
      </UFormGroup>
    </UForm>

    <template #footer>
      <UButton @click="form?.submit()">Save</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { Database } from "~/types/database.types";
import type { Form, FormSubmitEvent } from "#ui/types";

type ProjectEditProps = {
  project_id: string;
};

const toasts = useToast();
const props = defineProps<ProjectEditProps>();
const client = useSupabaseClient<Database>();
const { updateProject } = useProjects();

const {
  data: project,
  error,
  status,
} = await useAsyncData(`projects_${props.project_id}`, async () => {
  const { data, error } = await client
    .from("projects")
    .select("*")
    .eq("id", props.project_id)
    .single();
  if (error) {
    throw error;
  }
  return data;
});

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  description: z.string(),
});

type FormState = z.infer<typeof schema>;
const form = ref<Form<FormState>>();

const state = reactive<FormState>({
  name: project.value?.name ?? "",
  description: project.value?.description ?? "",
});

onMounted(() => {
    console.log(props.project_id);
    if (project.value) {
    state.name = project.value.name;
    state.description = project.value.description ?? "";
  }
});

async function onSubmit($event: FormSubmitEvent<FormState>) {
    try {
        await updateProject(props.project_id, state);
        toasts.add({
            title: "Project updated",
            description: "Your project has been updated successfully.",
            color: "green",
        })
    } catch (error) {
        console.error(error);
        toasts.add({
            title: "Error",
            description: "An error occurred while updating the project.",
            color: "red",
        })
    }

}
</script>

<style scoped></style>
