<template>
      <Sphere
        :args="[10, 10, 10]"
        :position="[props.position.x, props.position.y, props.position.z]"
      >
        <TresMeshToonMaterial color="pink" />
      </Sphere>
</template>

<script setup lang="ts">
import type { POI } from '~/composables/usePOIs';

    const props = defineProps<POI>();
</script>

<style scoped>

</style>