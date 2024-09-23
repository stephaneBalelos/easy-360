<template>
    <div class="absolute inset-0 pointer-events-none">
        <EmbeddedMarker v-for="poi in pois" v-bind="poi" :key="poi.id"></EmbeddedMarker>
    </div>
</template>

<script setup lang="ts">
import EmbeddedMarker from "./EmbeddedMarker.vue";
import { usePreviewState } from "../composables/usePreviewState";

const { pois } = usePreviewState();
</script>

<style scoped>

</style>