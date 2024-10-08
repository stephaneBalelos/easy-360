<template>
  <div
    :class="`poi-container absolute -translate-x-2/4 -translate-y-2/4`"
    v-if="show"
    :style="`top: ${screenCoords.y}%; left: ${screenCoords.x}%; 
    --primary-color: ${preview.theme.colors.primary};
    --secondary-color: ${preview.theme.colors.secondary};
    --body-color: ${preview.theme.colors.body};`"
  >
  <button class="poi-btn relative size-16 rounded-full grid place-items-center">
    <UIcon name="i-heroicons-light-bulb" class="w-5 h-5" />
  </button>

  <div v-if="showLabel" class="poi-label font-medium text-xl absolute top-full left-2/4 -translate-x-2/4 p-2 w-auto whitespace-nowrap	max-w-60 line-clamp-1">
    {{ props.title }}
  </div>

</div>
</template>

<script setup lang="ts">
import { Camera, Vector2, Vector3 } from "three";
import { mapRange } from "~/helpers";
import type { AppPOI } from "~/types/app.types";

type Props = {
  id: string;
  title: string;
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
const preview = usePreview();
const show = ref(false);

const screenCoords = ref({ x: 0, y: 0 });
const projectionCoords = ref({ x: 0, y: 0, z: 0 });

const { viewportSize } = useEditorBreakpoints();


const showLabel = ref(false);

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
    } else {
      console.error("No camera");
    }
  },
  { immediate: true, deep: true }
);

watch(() => tresCameraContext.value, (newVal) => {
  if (newVal) {
    setMarkerPosition(newVal);
  }
});

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

  const w = viewportSize.value.width;
  const h = viewportSize.value.height;
  
  const center = new Vector2(50, 50);
  const distance = center.distanceTo(new Vector2(screenPos.x, screenPos.y));
  if (distance > 40) {
    showLabel.value = false;
  } else {
    showLabel.value = true;
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

<style lang="scss" scoped>
@import "@/assets/styles/animations.scss";

.poi-container {
  &::before {
    content: "";
    position: absolute;
    width: 4rem;
    height: 4rem;
    background-color: var(--primary-color);
    border-radius: 50%;
    -webkit-animation: ping-animation 1s ease-in-out infinite both;
    animation: ping-animation 1s ease-in-out infinite both;
  }
  .poi-btn {
    background-color: var(--primary-color);
    color: var(--body-color);
  }

  .poi-label {
    color: var(--body-color);
  }
}
</style>
