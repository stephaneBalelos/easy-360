import { Vector3 } from "three";
import { useSceneControl } from "./useSceneControl";

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
    const pois = ref<POI[]>([])

    const selectedPOI = ref<POI | null>(null)

    function addPOI(poi: POI) {
        pois.value.push(poi)
        selectedPOI.value = poi
    }

    function removePOI(id: string) {
        pois.value = pois.value.filter(poi => poi.id !== id)
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