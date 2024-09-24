import { createGlobalState } from "@vueuse/core";
// store.js
import { ref, watch, computed, onWatcherCleanup } from "vue";
import type { POIResponse, ProjectResponse, SceneResponse } from "../types";
import { useFetch } from "@vueuse/core";
import type { Texture } from "three";
import { SRGBColorSpace } from "three";
import { useTexture } from "@tresjs/core";


export const usePreviewState = createGlobalState(() => {

    const ApiEndpoint = "http://localhost:3000"

    const isLoading = ref(true)

    const projectId = ref<string | null>(null)
    const project = ref<ProjectResponse | null>(null)

    const selectedSceneId = ref<string | null>(null)
    const scenes = ref<SceneResponse[]>([])

    const selectedPoiId = ref<string | null>(null)
    const pois = ref<POIResponse[]>([])

    const scenesTextures = ref<Map<string, Texture>>(new Map())


    watch(projectId, async (value) => {
        if (value) {
            const controller = new AbortController()
            isLoading.value = true
            const { data, error } = await useFetch<ProjectResponse>(`${ApiEndpoint}/api/preview?id=${value}`, {
                afterFetch(ctx) {
                    isLoading.value = false
                    return ctx
                },
                onFetchError(ctx) {
                    console.error(ctx.error)
                    isLoading.value = false
                    return ctx
                },
            }).get().json()
            if (error.value) {
                console.error(error.value)
            }
            if (!data.value) {
                console.error("No data")
                return
            }

            project.value = data.value
            await loadScenes()
        }
    })

    watch(selectedSceneId, async (value) => {
        if (value) {
            isLoading.value = true
            const { data, error } = await useFetch<POIResponse[]>("http://localhost:3000/api/preview/pois?scene_id=" + value, {
                afterFetch(ctx) {
                    isLoading.value = false
                    return ctx
                },
                onFetchError(ctx) {
                    console.error(ctx.error)
                    isLoading.value = false
                    return ctx
                }
            }).get().json()

            if (error.value) {
                console.error(error.value)
                return
            }
            if (!data.value) {
                console.error("No data")
                return
            }
            pois.value = data.value
        }
    })

    async function loadScenes() {
        const controller = new AbortController()
        isLoading.value = true
        const { data, error } = await useFetch<SceneResponse[]>("http://localhost:3000/api/preview/scenes?project_id=" + projectId.value, {
            afterFetch(ctx) {
                isLoading.value = false
                return ctx
            },
            onFetchError(ctx) {
                console.error(ctx.error)
                isLoading.value = false
                return ctx
            },
        }).get().json()
        if (error.value) {
            console.error(error)
            return
        }
        if (!data.value) {
            console.error("No data")
            return
        }
        scenes.value = data.value
        selectedSceneId.value = data.value[0].id
        await loadScenesTextures()
        isLoading.value = false
    }

    async function loadScenesTextures() {
        isLoading.value = true
        for (let i = 0; i < scenes.value.length; i++) {
            const url = scenes.value[i].url;
            const texture = await useTexture([url]);
            texture.colorSpace = SRGBColorSpace;

            scenesTextures.value.set(scenes.value[i].id, texture);

        }
        isLoading.value = false
    }


    const selectedScene = computed(() => {
        if (!scenes.value) return null
        return scenes.value.filter((scene) => scene.id === selectedSceneId.value)[0]
    })

    const selectedPoi = computed(() => {
        if (!selectedScene.value) return null
        return pois.value.filter((poi) => poi.id === selectedPoiId.value)[0]
    })



    return { isLoading, projectId, project, selectedSceneId, selectedScene, selectedPoiId, selectedPoi, scenes, scenesTextures, pois };
});
