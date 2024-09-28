<template>
  <Sphere
    v-if="!isSceneLoading && position && show"
    @click="toggleDrag"
    @pointer-move="handleMouseMove"
    :args="[10, 10, 10]"
    :position="[position.x, position.y, position.z]"
  >
    <TresMeshToonMaterial color="pink" />
  </Sphere>
</template>

<script setup lang="ts">
import type { Intersection } from "@tresjs/core";
import { Vector3 } from "three";
import type { DesignProps, POIBase } from "~/composables/usePOIs";
import type { AppPOI } from "~/types/app.types";


type Props = {
  id: string;
};

const props = defineProps<Omit<AppPOI, "design_data"> & { design_data: DesignProps}>();

const { isSceneLoading, pointerIntersectionWithSphere, selectedPOIId } = useEditorState();
const { getPOI, updatePOIDesignProps } = usePOIs();

const isDragging = ref(false);
const show = ref(false);

const poi_design = computed(() => {
  return props.design_data as DesignProps;
});

const position = ref<DesignProps["position"]>()

onMounted(() => {
  position.value = props.design_data.position
})


const toggleDrag = ($event: Intersection) => {
  isDragging.value = !isDragging.value;

  if (!isDragging.value) {
    if (selectedPOIId.value == props.id && position.value) {
      const designProps = props.design_data
      designProps.position = position.value
      updatePOIDesignProps(selectedPOIId.value, designProps).then(() => {
        console.log('updated')
      }).catch(console.log)
    }
  }
};

const handleMouseMove = () => {
  if (props.id === selectedPOIId.value ) {
    if (isDragging.value && pointerIntersectionWithSphere.value) {
      // console.log(isDragging.value)
      position.value = {
        x: pointerIntersectionWithSphere.value.point.x,
        y: pointerIntersectionWithSphere.value.point.y,
        z: pointerIntersectionWithSphere.value.point.z,
      };
    }
  }
};
</script>

<style scoped></style>
