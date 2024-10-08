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

export type PoiState = {
    data: AppPOI;
    loading: boolean;
}

export type PoisState = {
    items: PoiState[];
    loading: boolean;
}


export const usePOIs = createGlobalState(() => {
    const sceneControl = useSceneControl()
    const client = useSupabaseClient<Database>()
    const editorState = useEditorState()

    const pois = reactive<PoisState>({
        loading: true,
        items: []
    })


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
        return data
    }



    // Todo: Camera Lookat

    return {
        pois,
        createPOI,
        updatePOI,
        updatePOIDesignProps,
        deletePOI
    }
})