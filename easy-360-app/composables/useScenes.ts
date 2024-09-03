import type { Database } from "~/types/database.types"
import { useEditorState } from "./useEditorState";
import type { AppScene } from "~/types/app.types";
import { projectFilesBucketId } from "~/constants";

export type SceneBase = {
    name: string;
    description: string;
}

export const useScenes = createGlobalState(() => {
    const client = useSupabaseClient<Database>()
    const editorState = useEditorState()

     

    const { data:scenes, error, status, refresh} = useAsyncData(async () => {
        if (!editorState.selectedProjectId.value) {
            return []
        }
        const {data, error }= await client.from('scenes').select('*').eq('project_id', editorState.selectedProjectId.value)
        if (error) {
            throw error
        }
        if(data) {
            editorState.selectedSceneId.value = data[0].id  
        }
        return data
    }, {
        watch: [editorState.selectedProjectId]
    })

    const createScene = async (s: SceneBase) => {
        if (!editorState.selectedProjectId.value) {
            throw new Error('No project selected')
        }
        const {data, error} = await client.from('scenes').insert({
            ...s,
            project_id: editorState.selectedProjectId.value
        }).select('id')
        if (error) {
            throw error
        }
        refresh()
        return data
    }

    const updateScene = async (id: string, s: SceneBase) => {
        const {data, error} = await client.from('scenes').update(s).eq('id', id)
        if (error) {
            throw error
        }
        refresh()
        return data
    }

    const deleteScene = async (id: string) => {
        const {data, error} = await client.from('scenes').delete().eq('id', id)
        if (error) {
            throw error
        }
        refresh()
        return data
    }

    const getSceneFilePath = (project_id: string, scene_id: string) => {
        return `projects/${project_id}/scenes/${scene_id}/panorama.jpg`
    }

    const getSceneFileUrl = (project_id: string, scene_id: string) => {
        const path = getSceneFilePath(project_id, scene_id)
        return client.storage.from(projectFilesBucketId).createSignedUrl(path, 60, {
            download: true
        })
    }



    return {
        scenes,
        loadingStatus: status,
        createScene,
        updateScene,
        deleteScene,
        getSceneFilePath,
        getSceneFileUrl
    }
})