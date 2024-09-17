<template>
  <primitive ref="sphereRef" :object="sphere" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, SRGBColorSpace } from 'three';
import { useTexture, useTresContext } from '@tresjs/core'
import { useImage } from '@vueuse/core';
import { usePreviewState } from '../composables/usePreviewState';
import { watch } from 'vue';


type Props = {
  url: string
}

const props = defineProps<Props>()
const { isLoading, cameraContext } = usePreviewState()

cameraContext.value = useTresContext().camera.value

const { isLoading:image_loading } = useImage({ src: props.url })

watch(image_loading, (value) => {
  isLoading.value = value
})


const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

const texture = await useTexture([props.url]);
texture.colorSpace = SRGBColorSpace;
// texture.mapping = EquirectangularReflectionMapping
const material = new MeshBasicMaterial({ map: texture });

material.map = texture;

const sphere = new Mesh(geometry, material);
</script>

<style scoped></style>
