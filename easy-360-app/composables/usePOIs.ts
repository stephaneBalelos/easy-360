
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
    const pois = ref<POI[]>([])

    function addPOI(poi: POI) {
        pois.value.push(poi)
    }

    function removePOI(id: string) {
        pois.value = pois.value.filter(poi => poi.id !== id)
    }

    return {
        pois,
        addPOI,
        removePOI
    }
})