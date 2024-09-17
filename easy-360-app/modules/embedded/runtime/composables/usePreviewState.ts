import { createGlobalState } from "@vueuse/core";
// store.js
import { ref, watch, computed, reactive } from "vue";
import type { PreviewResponse } from "../types";
import type { Camera } from "three";

export const usePreviewState = createGlobalState(() => {

    const isLoading = ref(true)

    const cameraContext = ref<Camera>()
    const cameraPosition = reactive({
        x: 3,
        y: 0,
        z: 0
    })

    const previewData = ref<PreviewResponse | null>(null)

    const selectedSceneId = ref<string | null>(null)
    const selectedPoiId = ref<string | null>(null)

    const scenes = computed(() => {
        return previewData.value?.scenes ?? null
    })

    const selectedScene = computed(() => {
        if(!scenes.value) return null
        return scenes.value.filter((scene) => scene.id === selectedSceneId.value)[0]
    })

    const selectedPoi = computed(() => {
        if(!selectedScene.value) return null
        return selectedScene.value.points_of_interest.filter((poi) => poi.id === selectedPoiId.value)[0]
    })

    watch(previewData, (value) => {
        if (value) {
            selectedSceneId.value = value.scenes[0].id
        } else {
            selectedSceneId.value = null
        }
    }, { immediate: true})

  
  return { isLoading, previewData, cameraContext, cameraPosition, selectedScene, selectedSceneId, selectedPoi, selectedPoiId };
});
