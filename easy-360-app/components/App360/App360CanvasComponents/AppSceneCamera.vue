<template>
      <TresPerspectiveCamera
        ref="camera"
        :position="[
          sceneControl.camera.position[0],
          sceneControl.camera.position[1],
          sceneControl.camera.position[2],
        ]"
        :look-at="[0, 0, 0]"
      />
</template>

<script setup lang="ts">
import type { Camera, PerspectiveCamera } from 'three';

    const sceneControl = useSceneControl();
    const { tresCameraContext } = useEditorState();
    const { onLoop } = useRenderLoop()


    const camera = shallowRef<PerspectiveCamera | null>(null);
    
    onMounted(() => {
        tresCameraContext.value = useTresContext().camera.value
    });


    onLoop(() => {
        if (camera.value) {
            camera.value.fov = sceneControl.cameraProps.fov;
            camera.value.updateProjectionMatrix();
        }
    });
</script>

<style scoped>

</style>