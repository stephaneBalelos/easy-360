import { Vector3 } from "three";
import { useSceneControl } from "./useSceneControl";
import type { Database } from "~/types/database.types";

export type POI = {
    id: string;
    name: string;
    description: string;
    position: {
        x: number;
        y: number;
        z: number;
    }
}


export const usePOIs = createGlobalState(() => {
    const sceneControl = useSceneControl()
    const client = useSupabaseClient<Database>()

    const pois = ref<POI[]>([])

    const {data, error} = useAsyncData(async () => {
        const {data, error }= await client.from('points_of_interest').select('*')
        if (error) {
            throw error
        }
        console.log('data', data)
        return data
        
    })

    // const pois = ref<POI[]>([])

    const selectedPOI = ref<POI | null>(null)

    function addPOI(poi: POI) {
        console.log('addPOI', poi)
        selectedPOI.value = poi
    }

    async function removePOI(id: string) {
        try {
            const res = await client.from('points_of_interest').delete().eq('id', id)
            if (res.error) {
                throw res.error
            }
        } catch (error) {
            console.error(error)
        }
    }



    watch(() => selectedPOI.value, (poi) => {
        if (poi) {
            sceneControl.cameraLookAtAnimated(new Vector3(poi.position.x, poi.position.y, poi.position.z))
        }
    })

    return {
        pois,
        selectedPOI,
        addPOI,
        removePOI
    }
})