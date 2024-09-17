<template>
  <UPopover mode="click" v-model:open="open" class="absolute -translate-x-2/4 -translate-y-2/4" v-if="show" :style="`top: ${screenCoords.y}%; left: ${screenCoords.x}%;`"> 
    <UButton variant="soft" icon="i-heroicons-eye-20-solid"
    size="lg"
    square :ui="{ rounded: 'rounded-full' }" />

    <template #panel>
      <div class="p-4">
        {{ props.name }}
        {{ props.description }}
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { Camera, Vector3 } from 'three';
import { mapRange } from '~/helpers';
import type { AppPOI } from '~/types/app.types';


const props = defineProps<AppPOI>();
const { tresCameraContext } = useEditorState();
const sceneControl = useSceneControl();
const { selectedPOIId } = useEditorState();

const show = ref(false);

const screenCoords = ref({ x: 0, y: 0 });
const projectionCoords = ref({ x: 0, y: 0, z: 0 });

const open = computed(() => {
  return selectedPOIId.value === props.id;
});

onMounted(() => {
  console.log('mounted');

  if (!props.design_data.position) {
    console.error('No position data');
    return;
  }

  if (!tresCameraContext.value) {
    console.error('No camera');
    return;
  }
})

watch(sceneControl.camera, (newVal) => {
    if(tresCameraContext.value) {
        setMarkerPosition(tresCameraContext.value);
    }
}, { immediate: true, deep: true });


function setMarkerPosition(camera: Camera) {
  if (!props.design_data.position) {
    console.error('No position data');
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
    z: position.z
  };


  const screenPos = {
    x: mapRange(position.x, -1, 1, 0, 100),
    y: 100 - mapRange(position.y, -1, 1, 0, 100),
  };

  // TODO: Position "z" is not accurate, need to find a way to hide the marker when it's not visible
  if (screenPos.x < 0 || screenPos.x > 100 || screenPos.y < 0 || screenPos.y > 100 || position.z > 1) {
    show.value = false;
    return;
  } else {
    show.value = true;
    screenCoords.value = screenPos;
  }


  return position;
}

</script>

<style scoped>

</style>