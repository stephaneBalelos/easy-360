<template>
  <UModal>
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <UCard :ui="{ body: { base: 'space-y-4' } }">
        <template #header> {{ selectedSceneId }} </template>

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
import { usePOIs, type POIBase } from "~/composables/usePOIs";
import { useEditorState } from "~/composables/useEditorState";

type Props = {
  position: Vector3;
};

type Payload = {
  payload: POIBase;
};

const props = defineProps<Props>();
const { createPOI } = usePOIs();
const { selectedSceneId } = useEditorState();

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
  if(!selectedSceneId.value) return;
  // Do something with data
  const poi: POIBase = {
    name: event.data.name,
    description: event.data.description,
    position: {
      x: props.position.x,
      y: props.position.y,
      z: props.position.z,
    },
    linked_scene_id: null,
  };

  const res = await createPOI(selectedSceneId.value, poi);


  emit("addPoi", { payload: poi });
}
</script>

<style scoped></style>
