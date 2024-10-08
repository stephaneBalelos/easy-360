<template>
    <div v-if="status === 'success'">
        <ImageUploadCard :bucket-id="projectFilesBucketId" :path="path" :file-url="url" @file-uploaded="onUploaded" />
    </div>
</template>

<script setup lang="ts">
import ImageUploadCard from '@/components/App360/Inputs/ImageUploadCard.vue'
import { panoramaImagePath, projectFilesBucketId } from "~/constants";

const { selectedProjectId, selectedSceneId, reloadSelectedScene } = useEditorState();
const { getSceneFilePath, getSceneFileUrl } = useScenes();


const path = computed(() => {
    if (!selectedProjectId.value || !selectedSceneId.value) {
        return '';
    }
    return getSceneFilePath(selectedProjectId.value, selectedSceneId.value);
});

const { data:url, error, status } = await useAsyncData(async () => {
    if (!selectedProjectId.value || !selectedSceneId.value) {
        return null;
    }
    const url = await getSceneFileUrl(selectedProjectId.value, selectedSceneId.value);
    return url
}, { immediate: true, watch: [selectedProjectId, selectedSceneId] });

function onUploaded() {
    // Todo: update scene image
    reloadSelectedScene();

}

</script>

<style scoped>

</style>