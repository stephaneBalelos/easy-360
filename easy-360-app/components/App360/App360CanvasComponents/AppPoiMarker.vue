<template>
  <UPopover
    mode="click"
    :open="open"
    :class="`absolute -translate-x-2/4 -translate-y-2/4 ${open ? 'z-50' : 'z-0'}`"
    v-if="show && !sceneControl.isTransitioning.value"
    :style="`top: ${screenCoords.y}%; left: ${screenCoords.x}%;`"
  >
    <UButton
      variant="soft"
      icon="i-heroicons-eye-20-solid"
      size="lg"
      square
      :ui="{ rounded: 'rounded-full' }"
      @click="handleMarkerClick"
    />

    <template #panel>
      <UCard class="min-w-96">
        <template #header>
          <div class="flex justify-between">
            <div>{{ props.name }}</div>
            <UButton
              v-if="props.linked_scene_id"
              icon="i-heroicons-arrow-right"
              size="sm"
              color="primary"
              variant="solid"
              label="To Scene"
              trailing
              @click="goToScene"
            />
          </div>
        </template>

        {{ props.description }}

        <template #footer>
          <UButton
            size="sm"
            color="red"
            variant="soft"
            label="Button"
            trailing
          />
        </template>
      </UCard>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { Camera, Vector3 } from "three";
import { mapRange } from "~/helpers";
import type { AppPOI } from "~/types/app.types";

type Props = {
  id: string;
  name: string;
  description: string;
  linked_scene_id: string | null;
  design_data: {
    position: {
      x: number;
      y: number;
      z: number;
    };
  };
};

const props = defineProps<Props>();
const { tresCameraContext, selectedPOIId } = useEditorState();
const sceneControl = useSceneControl();
const { pois } = usePOIs();

const show = ref(false);

const screenCoords = ref({ x: 0, y: 0 });
const projectionCoords = ref({ x: 0, y: 0, z: 0 });

const open = computed(() => {
  return selectedPOIId.value === props.id;
});

onMounted(() => {
  if (!props.design_data.position) {
    console.error("No position data");
    return;
  }

  if (!tresCameraContext.value) {
    console.error("No camera");
    return;
  }

  setMarkerPosition(tresCameraContext.value);
});

watch(
  () => [sceneControl.camera, sceneControl.cameraProps.fov],
  (newVal) => {
    if (tresCameraContext.value) {
      setMarkerPosition(tresCameraContext.value);
    }
  },
  { immediate: true, deep: true }
);

function setMarkerPosition(camera: Camera) {
  if (!props.design_data.position) {
    console.error("No position data");
    return;
  }

  const position = new Vector3(
    props.design_data.position.x,
    props.design_data.position.y,
    props.design_data.position.z
  );

  position.project(camera);

  projectionCoords.value = {
    x: position.x,
    y: position.y,
    z: position.z,
  };

  const screenPos = {
    x: mapRange(position.x, -1, 1, 0, 100),
    y: 100 - mapRange(position.y, -1, 1, 0, 100),
  };

  // TODO: Position "z" is not accurate, need to find a way to hide the marker when it's not visible
  if (
    screenPos.x < 0 ||
    screenPos.x > 100 ||
    screenPos.y < 0 ||
    screenPos.y > 100 ||
    position.z > 1
  ) {
    show.value = false;
    return;
  } else {
    show.value = true;
    screenCoords.value = screenPos;
  }

  return position;
}

function goToScene() {
  if (!props.linked_scene_id) {
    return;
  }

  sceneControl.goToScene(
    props.linked_scene_id,
    new Vector3(
      props.design_data.position.x,
      props.design_data.position.y,
      props.design_data.position.z
    )
  );
}

function handleMarkerClick() {
  selectedPOIId.value = props.id;
  sceneControl.cameraLookAtAnimated(
    new Vector3(
      props.design_data.position.x,
      props.design_data.position.y,
      props.design_data.position.z
    )
  );
}
</script>

<style scoped></style>
