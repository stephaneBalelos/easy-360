<template>
    <div>
        <ImageUploadCard :bucket-id="projectFilesBucketId" :path="path" />
    </div>
</template>

<script setup lang="ts">
import ImageUploadCard from '@/components/App360/Inputs/ImageUploadCard.vue'
import { panoramaImagePath, projectFilesBucketId } from "~/constants";

const { selectedProjectId, selectedSceneId } = useEditorState();
const { getSceneFilePath } = useScenes();

const path = computed(() => {
    if (!selectedProjectId.value || !selectedSceneId.value) {
        return '';
    }
    return getSceneFilePath(selectedProjectId.value, selectedSceneId.value);
});

</script>

<style scoped>

</style>