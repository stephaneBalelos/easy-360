<template>
  <primitive ref="sphereRef" :object="sphere" @context-menu="handleSphereClick" @pointer-move="handlePointerMove" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, Spherical, SRGBColorSpace, Vector3, type Intersection } from 'three';
import AddPOIModal from '../Modals/AddPOIModal.vue';
import { useSceneControl } from '~/composables/useSceneControl';
import { projectFilesBucketId } from '~/constants';
import type { ShallowRef } from 'vue';
import type { TresInstance } from '@tresjs/core';

const modal = useModal()
const sceneControl = useSceneControl();
const { selectedProjectId, selectedSceneId, isSceneLoading, pointerIntersectionWithSphere, tresCameraContext } = useEditorState();
const { getSceneFileUrl } = useScenes();

const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);
const material = new MeshBasicMaterial();

const sphere = new Mesh(geometry, material);

const sphereRef: ShallowRef<TresInstance | null> = shallowRef(null);

tresCameraContext.value = useTresContext().camera.value


watch(() => selectedSceneId.value, async (newVal) => {


  if (!selectedProjectId.value || !selectedSceneId.value) {
    return;
  }

  const url = await getSceneFileUrl(selectedProjectId.value, selectedSceneId.value)

  if (!url) {
    return;
  }

  isSceneLoading.value = true;


  const texture = await useTexture([url]);
  texture.colorSpace = SRGBColorSpace;
  // texture.mapping = EquirectangularReflectionMapping
  const material = new MeshBasicMaterial({ map: texture });

  material.map = texture;

  if (sphereRef.value) {
    sphereRef.value.material = material;
  } else {
    console.error('sphereRef is null');
  }

  isSceneLoading.value = false;
  
}, { immediate: true });

function handleSphereClick(event: Intersection) {
    openAddPOIModal(event.point);
    sceneControl.cameraLookAtAnimated(event.point);
}



function openAddPOIModal (pos: Vector3) {
  modal.open(AddPOIModal, {
    position: pos,
    onAddPoi: () => {
      modal.close();
    },
    onClose: () => {
      modal.close();
    }
  })
}

function handlePointerMove ($event: Intersection) {
  pointerIntersectionWithSphere.value = $event
}

</script>

<style scoped></style>
