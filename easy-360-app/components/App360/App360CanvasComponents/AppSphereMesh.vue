<template>
  <primitive :object="sphere" @context-menu="handleSphereClick" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, Spherical, SRGBColorSpace, Vector3, type Intersection } from 'three';
import AddPOIModal from '../Modals/AddPOIModal.vue';

const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);

const texture = await useTexture(["/textures/4.jpg"]);
texture.colorSpace = SRGBColorSpace;
// texture.mapping = EquirectangularReflectionMapping
const material = new MeshBasicMaterial({ map: texture });

material.map = texture;

const sphere = new Mesh(geometry, material);
const modal = useModal()


function handleSphereClick(event: Intersection) {
    openAddPOIModal(event.point);
    cameraLookAt(event.point);
}



function openAddPOIModal (pos: Vector3) {
  modal.open(AddPOIModal, {
    position: pos,
    onAddPoi: (paylaod) => {
      modal.close();
    },
    onClose: () => {
      modal.close();
    }
  })
}

const cameraLookAt = (pos: Vector3) => {
    const spherical = new Spherical();

    spherical.setFromVector3(pos);
    spherical.radius = 2;
    const p = new Vector3().setFromSpherical(spherical);

    // cameraPosition.value = [-p.x, -p.y, -p.z];

};
</script>

<style scoped></style>
