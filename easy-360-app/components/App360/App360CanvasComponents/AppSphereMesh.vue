<template>
  <primitive :object="sphere" @context-menu="handleSphereClick" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, Spherical, SRGBColorSpace, Vector3, type Intersection } from 'three';
import AddPOIModal from '../Modals/AddPOIModal.vue';
import { useSceneControl } from '~/composables/useSceneControl';

const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

const texture = await useTexture(["/textures/4.jpg"]);
texture.colorSpace = SRGBColorSpace;
// texture.mapping = EquirectangularReflectionMapping
const material = new MeshBasicMaterial({ map: texture });

material.map = texture;

const sphere = new Mesh(geometry, material);
const modal = useModal()

const sceneControl = useSceneControl();


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

</script>

<style scoped></style>
