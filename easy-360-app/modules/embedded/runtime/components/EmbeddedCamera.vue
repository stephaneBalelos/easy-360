<template>
    <TresPerspectiveCamera ref="camera" :position="[cameraPosition.x, cameraPosition.y, cameraPosition.z]" :look-at="[0, 0, 0]" />
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import type { PerspectiveCamera } from 'three';
import { usePreviewControls } from '../composables/usePreviewControls';
import { useRenderLoop } from '@tresjs/core';

const { onLoop } = useRenderLoop()
const { cameraPosition, cameraProps, cameraContext } = usePreviewControls()

const camera = shallowRef<PerspectiveCamera | null>(null)

onMounted(() => {
    cameraContext.value = camera.value
})

onLoop(() => {
    if (camera.value && cameraContext.value) {
        cameraContext.value.fov = cameraProps.fov
        camera.value.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
        camera.value.lookAt(0, 0, 0)
    }
})

</script>

<style scoped>

</style>