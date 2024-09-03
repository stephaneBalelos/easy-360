<template>
  <primitive :object="sphere" @context-menu="handleSphereClick" />
</template>

<script setup lang="ts">
import { Mesh, MeshBasicMaterial, SphereGeometry, Spherical, SRGBColorSpace, Vector3, type Intersection } from 'three';
import AddPOIModal from '../Modals/AddPOIModal.vue';
import { useSceneControl } from '~/composables/useSceneControl';
import { projectFilesBucketId } from '~/constants';

const modal = useModal()
const sceneControl = useSceneControl();
const { selectedProjectId, selectedSceneId } = useEditorState();
const { getSceneFileUrl } = useScenes();




const geometry = new SphereGeometry(100, 60, 40);
geometry.scale(-1, 1, 1);
const material = new MeshBasicMaterial();



const sphere = new Mesh(geometry, material);


watch([selectedProjectId, selectedSceneId], async (newVal) => {

  if (!newVal) return;

  if (!selectedProjectId.value || !selectedSceneId.value) {
    return;
  }

  const {data:url, error} = await getSceneFileUrl(selectedProjectId.value, selectedSceneId.value)

  if (error) {
    console.error('Error getting scene file url', error);
    return;
  }



  const texture = await useTexture([`${url.signedUrl}`]);
  texture.colorSpace = SRGBColorSpace;
  // texture.mapping = EquirectangularReflectionMapping
  const material = new MeshBasicMaterial({ map: texture });

  material.map = texture;

  sphere.material = material;
  
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

</script>

<style scoped></style>
