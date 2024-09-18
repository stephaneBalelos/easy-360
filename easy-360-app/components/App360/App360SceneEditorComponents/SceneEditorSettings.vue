<template>
  <UForm v-if="status === 'success'"
  ref="form"
    :state="state"
    :schema="schema"
    @change="onChange"
    :validate-on="['change', 'blur']"
    class="flex flex-col"
  >
    <UDashboardSection
      title="Edit Scene Content"
      :description="status"
    >
      <UFormGroup name="name" label="name" description="Name of the Scene" required>
        <UInput
          placeholder="Name of this scnene"
          v-model="state.name"
          size="md"
        />
      </UFormGroup>
      <UFormGroup name="description" label="description" description="Describe your Scene" required>
        <UTextarea
          placeholder="Describe your Scene"
          v-model="state.description"
          size="md"
        />
      </UFormGroup>
    </UDashboardSection>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Database } from "~/types/database.types";

const { selectedProjectId, selectedSceneId } = useEditorState();
const { updateScene, getSceneFilePath, getSceneFileUrl } = useScenes();
const client = useSupabaseClient<Database>();

const form = ref()

const schema = z.object({
  name: z.string().min(3).max(255),
  description: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: "",
  description: "",
});

const {data:scene, error, status } = await useAsyncData(async() => {
    if (!selectedSceneId.value) {
      throw new Error("No scene selected");
    }
  const {data, error} = await client.from("scenes").select().eq("id", selectedSceneId.value).single();

  if (error) {
    throw error;
  }
  state.name = data.name;
  state.description = data.description;
    return data;
}, {immediate: true, watch: [selectedSceneId]});


async function onChange($event: FormSubmitEvent<Schema>) {
  console.log($event);

  if(schema.parse(state) && selectedSceneId.value) {
    await updateScene(selectedSceneId.value, state);
  }


}
</script>

<style scoped></style>
