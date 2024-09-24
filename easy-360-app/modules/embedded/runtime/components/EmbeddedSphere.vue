<template>
  <!-- <primitive ref="sphereRef" :object="sphere" /> -->
   <TresMesh ref="sphereRef">
    <TresSphereGeometry :args="[100, 60, 40]" :scale="[-1, 1, 1]" />
    <TresShaderMaterial 
      :fragmentShader="HorizontalBlurShader.fragmentShader"
      :vertexShader="HorizontalBlurShader.vertexShader" 
      :uniforms="HorizontalBlurShader.uniforms"
    />
   </TresMesh>
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, SRGBColorSpace, Texture } from "three";
import { useTexture, useTresContext, useRenderLoop, type TresInstance } from "@tresjs/core";

import { usePreviewState } from "../composables/usePreviewState";
import { watch, shallowRef, ref, onMounted } from "vue";
import { HorizontalBlurShader, VerticalBlurShader } from "three/examples/jsm/Addons.js";
import { usePreviewControls } from "../composables/usePreviewControls";


const { selectedSceneId, scenesTextures } = usePreviewState();
const { sphereProps } = usePreviewControls()
const sphereRef = shallowRef<TresInstance | null>();
const { onLoop } = useRenderLoop();

const texture = ref<Texture | null>(null);

watch(scenesTextures.value, async () => {
  if (!selectedSceneId.value) return;
  const texture = scenesTextures.value.get(selectedSceneId.value);
  if (!texture) return;
  applyTexture(texture);
}, { immediate: true, deep: true });

watch(selectedSceneId, async () => {
  if (!selectedSceneId.value) return;
  const texture = scenesTextures.value.get(selectedSceneId.value);
  if (!texture) return;
  applyTexture(texture);
}, { immediate: true });


function applyTexture(t: Texture) {
  if (sphereRef.value) {
    if (sphereRef.value.material.uniforms && t) {
      texture.value = t;
      sphereRef.value.material.uniforms.tDiffuse.value = t;
      sphereRef.value.material.uniforms.h.value = (sphereProps.blur / 100) / t.image.width;
    }
  } else {
    console.error('sphereRef is null');
  }
}

onLoop(() => {
  if (sphereRef.value) {
    if (sphereRef.value.material.uniforms && texture.value) {
      sphereRef.value.material.uniforms.h.value = (sphereProps.blur / 100) / texture.value.image.width;
    }
  }
});



async function loadTextureMaterial (t: Texture) {

  texture.value = t;

};
</script>

<style scoped></style>
