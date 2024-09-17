<template>
  <primitive ref="sphereRef" :object="sphere" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, SRGBColorSpace } from 'three';
import { useTexture } from '@tresjs/core'


type Props = {
  url: string
}

const props = defineProps<Props>()

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
