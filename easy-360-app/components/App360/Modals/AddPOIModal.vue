<template>
  <UModal>
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <UCard :ui="{ body: { base: 'space-y-4' } }">
        <template #header> Add Point of Interest (x: {{ Math.round(props.position.x) }}, y: {{ Math.round(props.position.y)}}, z: {{ Math.round(props.position.z) }}) </template>

        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" placeholder="Name" />
        </UFormGroup>

        <UFormGroup label="Description" name="description">
          <UTextarea
            v-model="state.description"
            variant="outline"
            placeholder="Description"
          />
        </UFormGroup>

        <template #footer>
          <div class="flex gap-2 justify-end">
            <UButton @click="() => emit('close')"> cancel </UButton>
            <UButton type="submit"> Speichern </UButton>
          </div>
        </template>
      </UCard>
    </UForm>
  </UModal>
</template>

<script setup lang="ts">
import type { Vector3 } from "three";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { usePOIs } from "~/composables/usePOIs";

type Props = {
  position: Vector3;
};

type Payload = {
  payload: POI;
};

const props = defineProps<Props>();
const { addPOI } = usePOIs();

const emit = defineEmits<{
  addPoi: [paylaod?: Payload];
  close: [];
}>();

const schema = z.object({
  name: z.string(),
  description: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: "",
  description: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with data
  const poi: POI = {
    id: Math.random().toString(36).substring(7),
    name: event.data.name,
    description: event.data.description,
    position: props.position,
  };

  addPOI(poi);

  emit("addPoi", { payload: poi });
}
</script>

<style scoped></style>
