<template>
  <div v-if="selectedPOIId" class="space-y-2">
    <UForm v-if="status === 'success'"
  ref="form"
    :state="state"
    :schema="schema"
    @change="onChange"
    :validate-on="['change', 'blur']"
    class="flex flex-col"
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
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { Database } from "~/types/database.types";
import type { FormSubmitEvent } from "#ui/types";


const { selectedPOIId } = useEditorState();
const { pois, updatePOI } = usePOIs();
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

const {data:poi, error, status } = await useAsyncData(async() => {
    if (!selectedPOIId.value) {
      throw new Error("No POI selected");
    }
  const {data, error} = await client.from("points_of_interest").select().eq("id", selectedPOIId.value).single();

  if (error) {
    console.log(error)
    throw error;
  }
  state.name = data.name;
  state.description = data.description;
    return data;
}, {immediate: true, watch: [selectedPOIId]});

async function onChange($event: FormSubmitEvent<Schema>) {
  console.log($event);

  const data: POIBase = {
    name: state.name,
    description: state.description
  }

  if (selectedPOIId.value) {
      const res = await updatePOI(selectedPOIId.value, data)
  }



}
</script>

<style scoped></style>
