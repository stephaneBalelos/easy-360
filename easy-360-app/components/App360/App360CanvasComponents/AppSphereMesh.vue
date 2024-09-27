<template>
  <primitive
    ref="sphereRef"
    :object="sphere"
    @context-menu="handleSphereClick"
    @pointer-move="handlePointerMove"
  >
  <!-- <CustomShaderMaterial v-bind="material" :baseMaterial="'MeshBasicMaterial'"/> -->
  </primitive>
</template>

<script setup lang="ts">
import {
  Mesh,
  MeshBasicMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  SRGBColorSpace,
  UniformsUtils,
  Vector3,
  WebGLRenderTarget,
  type Intersection,
} from "three";
import AddPOIModal from "../Modals/AddPOIModal.vue";
import { useSceneControl } from "~/composables/useSceneControl";
import type { ShallowRef } from "vue";
import type { TresInstance } from "@tresjs/core";

const modal = useModal();
const sceneControl = useSceneControl();
const {
  selectedProjectId,
  selectedSceneId,
  isSceneLoading,
  pointerIntersectionWithSphere,
  sceneError,
} = useEditorState();
const { getSceneFileUrl } = useScenes();
const { onLoop } = useRenderLoop();
const { renderer, scene, camera } = useTresContext();

const geometry = new SphereGeometry(100, 128, 64);
geometry.scale(-1, 1, 1);
const material = new MeshBasicMaterial();

const sphere = new Mesh(geometry, material);

const sphereRef: ShallowRef<TresInstance | null> = shallowRef(null);

const { viewportSize } = useEditorBreakpoints();

watch(
  () => selectedSceneId.value,
  async (newVal) => {
    if (!selectedProjectId.value || !selectedSceneId.value) {
      return;
    }

    const url = await getSceneFileUrl(
      selectedProjectId.value,
      selectedSceneId.value
    );

    if (!url) {
      sceneError.value = "Scene file not found";
      await loadDefaultMaterial();
      return;
    }

    const material = await loadTextureMaterial(url);

    if (sphereRef.value) {
      sphereRef.value.material = material;
    } else {
      console.error("sphereRef is null");
    }

    isSceneLoading.value = false;
  },
  { immediate: true }
);

function handleSphereClick(event: Intersection) {
  openAddPOIModal(event.point);
  sceneControl.cameraLookAtAnimated(event.point);
}

function openAddPOIModal(pos: Vector3) {
  modal.open(AddPOIModal, {
    position: pos,
    onAddPoi: () => {
      modal.close();
    },
    onClose: () => {
      modal.close();
    },
  });
}

function handlePointerMove($event: Intersection) {
  pointerIntersectionWithSphere.value = $event;
}

async function loadTextureMaterial(url: string) {

  if (!renderer.value) {
    console.error("Renderer is null");
    return;
  }
  if(!camera.value) {
    console.error("Camera is null");
    return;
  }

  const texture = await useTexture([url]);
  texture.colorSpace = SRGBColorSpace;
  // texture.mapping = EquirectangularReflectionMapping
  const material = new MeshBasicMaterial({ map: texture });

  material.map = texture;

  return material;
}

onLoop(() => {
  if (sceneControl.sphereBlur.horizontal > 0 || sceneControl.sphereBlur.vertical > 0) {
    if (sphereRef.value) {
      // Do something
    }
  }
});

async function loadDefaultMaterial() {
  const material = await loadTextureMaterial(
    "/textures/TCom_JapanParkingGarageB_4K_hdri_sphere_tone.jpg"
  );
  if (sphereRef.value) {
    sphereRef.value.material = material;
  } else {
    console.error("sphereRef is null");
  }
}
</script>

<style scoped></style>
