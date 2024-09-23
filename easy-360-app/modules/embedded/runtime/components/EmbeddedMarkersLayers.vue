<template>
    <div class="markers-layer">
        <EmbeddedMarker v-for="poi in pois" v-bind="poi" :key="poi.id"></EmbeddedMarker>
    </div>
</template>

<script setup lang="ts">
import EmbeddedMarker from "./EmbeddedMarker.vue";
import { usePreviewState } from "../composables/usePreviewState";

const { pois } = usePreviewState();
</script>

<style lang="scss" scoped>
.markers-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
}
</style>