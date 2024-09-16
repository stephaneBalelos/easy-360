<template>
      <Sphere
      v-if="!isSceneLoading"
        :args="[10, 10, 10]"
        :position="[props.position.x, props.position.y, props.position.z]"
      >
        <TresMeshToonMaterial color="pink" />
      </Sphere>
</template>

<script setup lang="ts">
import type { POIBase } from '~/composables/usePOIs';

    const props = defineProps<POIBase>();

    const { isSceneLoading } = useEditorState();
</script>

<style scoped>

</style>