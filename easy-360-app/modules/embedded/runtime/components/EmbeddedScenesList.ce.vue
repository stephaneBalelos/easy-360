<template>
    <div v-if="previewData && previewData.scenes.length > 0" class="scene-list-card">
        <div class="scene-list-card-body">
            <ul class="scene-list">
                <li v-for="scene in previewData.scenes" @click="() => changeScene(scene.id)">
                    {{ scene.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePreviewState } from '../composables/usePreviewState';

const { previewData, selectedSceneId } = usePreviewState()

function changeScene(id: string) {
    selectedSceneId.value = id
}
</script>

<style scoped>
.scene-list-card {
    position: absolute;
    bottom: var(--container-padding);
    right: var( --container-padding)
}
</style>