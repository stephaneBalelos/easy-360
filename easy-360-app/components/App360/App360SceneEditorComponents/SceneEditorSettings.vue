<template>
  <UForm
    v-if="!scenes.loading"
    ref="form"
    :state="state"
    :schema="schema"
    @change="onChange"
    :validate-on="['change', 'blur']"
    class="flex flex-col"
  >
    <UDashboardSection
      title="Scene Settings"
      :description="`Edit the settings of the Scene ${state.name}`"
      orientation="vertical"
      :links="[
        {
          label: 'Delete Scene',
          color: 'red',
          click: () => handleSceneDelete(),
        },
      ]"
    >
      <UFormGroup
        name="name"
        label="name"
        description="Name of the Scene"
        required
      >
        <UInput placeholder="Name of this scnene" v-model="state.name" />
      </UFormGroup>
      <UFormGroup
        name="description"
        label="description"
        description="Describe your Scene"
        required
      >
        <UTextarea
          placeholder="Describe your Scene"
          v-model="state.description"
        />
      </UFormGroup>
    </UDashboardSection>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import type { Database } from "~/types/database.types";
import { projectKey, sceneKey } from "~/constants";
import ConfirmActionModal from "../Modals/ConfirmActionModal.vue";

const { selectedProjectId, selectedSceneId } = useEditorState();
const { updateScene, deleteScene, scenes } = useScenes();
const client = useSupabaseClient<Database>();

const form = ref();

const schema = z.object({
  name: z.string().min(3).max(255),
  description: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: "",
  description: "",
});

const data = computed(() => {
  if (selectedSceneId.value) {
    return scenes.items.find((scene) => scene.data.id === selectedSceneId.value);
  }
})

watch(data, (value) => {
  if (value) {
    state.name = value.data.name;
    state.description = value.data.description;
  }
}, { immediate: true });

async function onChange($event: FormSubmitEvent<Schema>) {
  if (schema.parse(state) && selectedSceneId.value) {
    const index = scenes.items.findIndex((scene) => scene.data.id === selectedSceneId.value);
    try {
      const res = await updateScene(selectedSceneId.value, state);
      scenes.items[index].data = res;
    } catch (error) {
      throw error;
    } 

  }
}

const modal = useModal();
function handleSceneDelete() {
  if (selectedSceneId.value) {
    const id = selectedSceneId.value;
    modal.open(ConfirmActionModal, {
      title: "Delete Scene " + state.name,
      message: "Are you sure you want to delete this scene?",
      confirmAction: async () => await deleteScene(id),
      onCancel: () => { modal.close() },
      onClose: () => { modal.close() },
      onError: () => console.log("error"),
      onSuccess: () => { modal.close() },
    });
  }
}
</script>

<style scoped></style>
