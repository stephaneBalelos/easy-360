import { Vector3 } from "three";
import { useSceneControl } from "./useSceneControl";
import type { Database } from "~/types/database.types";
import { useScenes } from "./useScenes";
import type { AppPOI } from "~/types/app.types";
import { useEditorState } from "./useEditorState";

export type POIBase = Pick<AppPOI, "name" | "description" | "linked_scene_id"> & {
    position?: {
        x: number;
        y: number;
        z: number;
    }
}

export type DesignProps = {
    position: {
        x: number;
        y: number;
        z: number;
    }
}


export const usePOIs = createGlobalState(() => {
    const sceneControl = useSceneControl()
    const client = useSupabaseClient<Database>()
    const editorState = useEditorState()

    const {data:pois, error, status, refresh} = useAsyncData('', async () => {
        if (!editorState.selectedSceneId.value) {
            return []
        }
        const {data, error }= await client.from('points_of_interest').select('*').eq('scene_id', editorState.selectedSceneId.value)
        if (error) {
            throw error
        }
        return data as AppPOI[]
        
    }, {
        watch: [editorState.selectedSceneId],
        transform: (data: AppPOI[]) => {
            return data.map(p => {
                const { design_data } = p
                const design = design_data as DesignProps
                return {
                    ...p,
                    design_data: design
                }
            })
        }
    })

    const getPOI = async (poi_id: string) => {
        const local = pois.value?.filter((poi) => poi.id === poi_id)[0]
        if (local) return local
        const { data:poi, error } = await client.from('points_of_interest').select('*').eq('id', poi_id).single()
        if (error) {
            throw error
        }
        return poi
    }

    const createPOI = async (scene_id: string, p: POIBase) => {
        if (!editorState.selectedProjectId.value) {
            throw new Error('No project selected')
        }
        const {data, error} = await client.from('points_of_interest').insert({
            scene_id,
            project_id: editorState.selectedProjectId.value,
            name: p.name,
            description: p.description,
            design_data: {
                position: p.position
            }
        }).select('id')
        if (error) {
            throw error
        }
        refresh()
        return data
    }

    const updatePOI = async (id: string, p: POIBase) => {
        const {data, error} = await client.from('points_of_interest').update({
            name: p.name,
            description: p.description,
            linked_scene_id: p.linked_scene_id
        }).eq('id', id)
        if (error) {
            throw error
        }
        const i = editorState.selectedPOIId.value
        editorState.selectedPOIId.value = null
        await nextTick()
        editorState.selectedPOIId.value = i
        return data
    }

    const updatePOIDesignProps = async (id:string, props: DesignProps) => {
        const {data, error} = await client.from('points_of_interest').update({
            design_data: props
        }).eq('id', id)
        if (error) {
            throw error
        }
        return data
    }

    const deletePOI = async (id: string) => {
        const {data, error} = await client.from('points_of_interest').delete().eq('id', id)
        if (error) {
            throw error
        }
        refresh()
        return data
    }



    watch(() => editorState.selectedPOIId.value, (value) => {
        if (!value) {
            return
        }
        if (!pois.value) {
            return
        }
        const poi = pois.value.find(p => p.id === value)
        if (poi) {
            const { design_data } = poi
            sceneControl.cameraLookAtAnimated(new Vector3(design_data.position.x, design_data.position.y, design_data.position.z))
        }
    })

    return {
        pois,
        getPOI,
        createPOI,
        updatePOI,
        updatePOIDesignProps,
        deletePOI
    }
})