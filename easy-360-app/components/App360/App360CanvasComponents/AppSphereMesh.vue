<template>
  <primitive
    ref="sphereRef"
    :object="sphere"
    @context-menu="handleSphereClick"
    @pointer-move="handlePointerMove"
  >
    <TresShaderMaterial
      :vertex-shader="SphereVertexShader"
      :fragment-shader="SphereFragmentShader"
      :uniforms="uniforms"
      :glsl-version="GLSL3"
    />
  </primitive>
</template>

<script setup lang="ts">
import {
  GLSL3,
  Mesh,
  MeshBasicMaterial,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  SRGBColorSpace,
  Texture,
  UniformsUtils,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Intersection,
} from "three";
import AddPOIModal from "../Modals/AddPOIModal.vue";
import { useSceneControl } from "~/composables/useSceneControl";
import type { ShallowRef } from "vue";
import type { TresInstance } from "@tresjs/core";
import SphereVertexShader from "@/assets/shader/sphereVertex.glsl";
import SphereFragmentShader from "@/assets/shader/sphereFragment.glsl";

const modal = useModal();
const sceneControl = useSceneControl();
const preview = usePreview();
const { getSceneFileUrl } = useScenes();
const { onLoop } = useRenderLoop();
const { renderer, scene, camera } = useTresContext();

const { viewportSize } = useEditorBreakpoints();

const geometry = new SphereGeometry(100, 128, 64);
geometry.scale(-1, 1, 1);
const material = new MeshBasicMaterial();

const sphere = new Mesh(geometry, material);

const sphereRef: ShallowRef<TresInstance | null> = shallowRef(null);

const canAddPOI = ref(false);

const uniforms = {
  uTexture: { value: null },
  uResolution: {
    value: new Vector2(viewportSize.value.width, viewportSize.value.height),
  },
  uTime: { value: 0.0 },
  uTextureSize: { value: null },
};

const textures = ref<Map<string, Texture>>(new Map());

const selectedScene = computed(() => {
  return preview.scenes.value.find(
    (scene) => scene.id === preview.selectedSceneId.value
  );
});

watch(
  selectedScene,
  async (newVal) => {
    console.log("selectedScene", newVal);
    if (!newVal) {
      return;
    }
    if(sphereRef.value === null) {
      console.error("sphereRef is null");
      return;
    }
    try {
      const texture = await useTexture([newVal.url]);
      if (texture) {
      sphereRef.value.material.uniforms.uTexture.value = texture;
      sphereRef.value.material.uniforms.uTextureSize.value = new Vector2(
        texture.image.width,
        texture.image.height
      );
      sphereRef.value.material.needsUpdate = true;
      canAddPOI.value = true;
      textures.value.set(newVal.url, texture);
    } else {
      sphereRef.value.material.uniforms.uTexture.value = null;
      canAddPOI.value = false;
    }
  } catch (error) {
      sphereRef.value.material.uniforms.uTexture.value = null;
      console.log(error);
      canAddPOI.value = false;
    }
  },
  { immediate: true }
);

function handleSphereClick(event: Intersection) {
  if (!canAddPOI.value) {
    return;
  }
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
  // pointerIntersectionWithSphere.value = $event;
}

onLoop(({ elapsed }) => {
  if (
    sceneControl.sphereBlur.horizontal > 0 ||
    sceneControl.sphereBlur.vertical > 0
  ) {
    if (sphereRef.value) {
      // Do something
      sphereRef.value.material.uniforms.uTime.value = elapsed;
    }
  }
});
</script>

<style scoped></style>
