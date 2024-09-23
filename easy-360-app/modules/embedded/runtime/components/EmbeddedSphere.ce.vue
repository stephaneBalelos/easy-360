<template>
  <primitive ref="sphereRef" :object="sphere" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, SRGBColorSpace } from "three";
import { useTexture, useTresContext, type TresInstance } from "@tresjs/core";
import { useImage } from "@vueuse/core";
import { usePreviewState } from "../composables/usePreviewState";
import { watch, shallowRef } from "vue";

type Props = {
  url: string;
};

const props = defineProps<Props>();
const { isLoading, selectedSceneId } = usePreviewState();
const sphereRef = shallowRef<TresInstance | null>();

const { isLoading: image_loading } = useImage({ src: props.url });

watch(image_loading, async (value) => {
  isLoading.value = value;
  console.log(props.url)
});

watch(selectedSceneId, async () => {
  const material = await loadTextureMaterial(props.url)
  if (sphereRef.value) {
    sphereRef.value.material = material;
  } else {
    console.error('sphereRef is null');
  }
})



const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

const material = await loadTextureMaterial(props.url)

const sphere = new Mesh(geometry, material);

async function loadTextureMaterial (url: string) {
  const texture = await useTexture([url]);
  texture.colorSpace = SRGBColorSpace;

  const material = new MeshBasicMaterial({ map: texture });

  material.map = texture;
  return material;
};
</script>

<style scoped></style>
