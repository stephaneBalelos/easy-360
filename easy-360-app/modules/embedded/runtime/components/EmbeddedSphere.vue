<template>
  <primitive ref="sphereRef" :object="sphere" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, SRGBColorSpace, Texture } from "three";
import { useTexture, useTresContext, type TresInstance } from "@tresjs/core";
import { useImage } from "@vueuse/core";
import { usePreviewState } from "../composables/usePreviewState";
import { watch, shallowRef } from "vue";

type Props = {
  url: string;
};

const props = defineProps<Props>();
const { isLoading, selectedSceneId, scenesTextures } = usePreviewState();
const sphereRef = shallowRef<TresInstance | null>();

const { isLoading:image_loading } = useImage({ src: props.url });

watch(scenesTextures.value, async () => {
  if (!selectedSceneId.value) return;
  const texture = scenesTextures.value.get(selectedSceneId.value);
  if (!texture) return;
  const material = await loadTextureMaterial(texture);
  if (sphereRef.value) {
    sphereRef.value.material = material;
  } else {
    console.error("sphereRef is null");
  }
}, { immediate: true, deep: true });

watch(selectedSceneId, async () => {
  if (!selectedSceneId.value) return;
  const texture = scenesTextures.value.get(selectedSceneId.value);
  if (!texture) return;
  const material = await loadTextureMaterial(texture)
  if (sphereRef.value) {
    sphereRef.value.material = material;
  } else {
    console.error('sphereRef is null');
  }
}, { immediate: true });



const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

const material = new MeshBasicMaterial({ color: 0xffffff, map: null });

const sphere = new Mesh(geometry, material);

async function loadTextureMaterial (t: Texture) {

  const material = new MeshBasicMaterial({ map: t });
  const blurMaterial = new Mesh;

  return material;
};
</script>

<style scoped></style>
