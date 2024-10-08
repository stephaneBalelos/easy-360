import type { Database } from "~/types/database.types"
import { useEditorState } from "./useEditorState";
import type { AppScene } from "~/types/app.types";
import { projectFilesBucketId } from "~/constants";

export type SceneBase = {
    name: string;
    description: string;
}

export type SceneState = {
    data: AppScene;
    loading: boolean;
}

export type ScenesState = {
    items: SceneState[];
    loading: boolean;
}

export const useScenes = createGlobalState(() => {
    const client = useSupabaseClient<Database>()
    const editorState = useEditorState()
    const runtimeConfig = useRuntimeConfig().public

    const scenes = reactive<ScenesState>({
        loading: true,
        items: []
    })

    const createScene = async (s: SceneBase) => {
        if (!editorState.selectedProjectId.value) {
            throw new Error('No project selected')
        }
        const {data, error} = await client.from('scenes').insert({
            ...s,
            project_id: editorState.selectedProjectId.value
        }).select('*').single()
        if (error) {
            throw error
        }
        scenes.items.push({
            loading: false,
            data: data
        })
        return data
    }

    const updateScene = async (id: string, s: SceneBase) => {
        const {data, error} = await client.from('scenes').update(s).eq('id', id).select('*').single()
        if (error) {
            throw error
        }
        return data
    }

    const deleteScene = async (id: string) => {
        if (!editorState.selectedSceneId.value) {
            throw new Error('No scene selected')
        }
        const {data, error} = await client.from('scenes').delete().eq('id', id)
        if (error) {
            throw error
        }
        editorState.selectedSceneId.value = null
        scenes.items = scenes.items.filter(s => s.data.id !== id)
        editorState.selectedSceneId.value = scenes.items[0]?.data.id
        return data
    }

    const getSceneFilePath = (project_id: string, scene_id: string) => {
        return `projects/${project_id}/scenes/${scene_id}/panorama.jpg`
    }

    const getSceneFileUrlPublic = (project_id: string, scene_id: string) => {
        return `${runtimeConfig.supabaseStorageEndpoint}/object/public/${projectFilesBucketId}/${getSceneFilePath(project_id, scene_id)}`
    }

    const getSceneFileUrl = async (project_id: string, scene_id: string) => {
        const path = getSceneFilePath(project_id, scene_id)
        try {
            const res = await client.storage.from(projectFilesBucketId).createSignedUrl(path, 60, {
                download: true
            })
            if (res.error) {
                throw res.error
            }
            return res.data.signedUrl
        } catch (error) {
            console.log('Error getting signed url', error)
            return null
        }

    }

    return {
        scenes,
        loadingStatus: status,
        createScene,
        updateScene,
        deleteScene,
        getSceneFilePath,
        getSceneFileUrl,
        getSceneFileUrlPublic
    }
})