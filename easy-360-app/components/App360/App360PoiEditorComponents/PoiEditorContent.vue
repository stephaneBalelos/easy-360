<template>
  <div v-if="selectedPOIId" class="space-y-2">
    <UForm
      v-if="status === 'success'"
      ref="form"
      :state="state"
      :schema="schema"
      @change="onChange"
      :validate-on="['change', 'blur']"
      class="flex flex-col space-y-4"
    >
      <UFormGroup label="Name">
        <template #description>
          Name of the POI
          <UIcon name="i-heroicons-information-circle" />
        </template>
        <template #default>
          <UInput v-model="state.name" placeholder="Title.." />
        </template>
      </UFormGroup>
      <UFormGroup label="Description">
        <template #description>
          Description of the POI
          <UIcon name="i-heroicons-information-circle" />
        </template>
        <template #default>
          <UTextarea v-model="state.description" placeholder="Description" />
        </template>
      </UFormGroup>
      <UFormGroup label="Linked Scene" v-if="scenesOptions.length > 0">
        <template #description>
          Scene linked to the POI
          <UIcon name="i-heroicons-information-circle" />
        </template>

        <template #hint>
          <UButton
            v-if="state.linked_scene_id"
            size="2xs"
            color="gray"
            variant="link"
            @click="clearLink"
            >Clear</UButton
          >
        </template>
        <template #default>
          <USelectMenu
            searchable
            searchable-placeholder="Search for a Scene"
            class="w-full lg:w-48"
            placeholder="Select a Scene"
            :options="scenesOptions"
            :valueAttribute="'value'"
            v-model="state.linked_scene_id"
            @change="onChange"
          />
        </template>
      </UFormGroup>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { Database } from "~/types/database.types";
import type { FormSubmitEvent } from "#ui/types";
import { poiKey, projectKey } from "~/constants";

const { selectedPOIId, selectedSceneId } = useEditorState();
const { pois, updatePOI } = usePOIs();
const { scenes } = useScenes();
const client = useSupabaseClient<Database>();

const form = ref();

const scenesOptions = computed(() => {
  if (!scenes.items) {
    return [];
  }
  return scenes.items
    .filter((scene) => scene.data.id !== selectedSceneId.value)
    .map((scene) => ({
      label: scene.data.name,
      value: scene.data.id,
    }));
});

const schema = z.object({
  name: z.string().min(3).max(255),
  description: z.string(),
  linked_scene_id: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: "",
  description: "",
  linked_scene_id: "",
});

const {
  data: poi,
  error,
  status,
} = await useAsyncData(
  `${selectedPOIId.value}`,
  async () => {
    if (!selectedPOIId.value) {
      throw new Error("No POI selected");
    }
    const { data, error } = await client
      .from(poiKey)
      .select()
      .eq("id", selectedPOIId.value)
      .single();

    if (error) {
      console.log(error);
      throw error;
    }
    state.name = data.name;
    state.description = data.description;
    state.linked_scene_id = data.linked_scene_id || "";
    return data;
  },
  { immediate: true, watch: [selectedPOIId] }
);

async function saveChanges(state: POIBase) {
  if (schema.parse(state) && selectedPOIId.value) {
    const index = pois.items.findIndex((poi) => poi.data.id === selectedPOIId.value);
    try {
      schema.parse(state);

      state.linked_scene_id = state.linked_scene_id || null;
      pois.items[index].loading = true;
      const res = await updatePOI(selectedPOIId.value, state);

      pois.items[index].data = res;
      pois.items[index].loading = false;
    } catch (error) {
      console.log(error);
    }
  }
}

async function onChange($event: FormSubmitEvent<Schema>) {
  const data: POIBase = {
    name: state.name,
    description: state.description,
    linked_scene_id: state.linked_scene_id ?? "",
  };

  await saveChanges(data);
}

async function clearLink() {
  state.linked_scene_id = "";
  if (selectedPOIId.value) {
    const data: POIBase = {
      name: state.name,
      description: state.description,
      linked_scene_id: "",
    };
    await saveChanges(data);
  }
}
</script>

<style scoped></style>
