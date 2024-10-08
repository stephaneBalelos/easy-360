import { Camera, PerspectiveCamera } from "three";

export type PreviewData = {
    project: {
        id: string;
        title: string;
    }
    theme: {
        colors: {
            primary: string;
            secondary: string;
            body: string;
        }
    }
    scenes: {
        id: string;
        title: string;
        description: string;
        url: string;
    }[]
    pois: {
        id: string;
        sceneId: string;
        title: string;
        description: string;
        position: {
            x: number;
            y: number;
            z: number;
        }
    }[]
}

export type PreviewState = {
    loading: boolean;
    selectedSceneId: string;
    selectedPoiId: string;
}

export const usePreview = createGlobalState(() => {

    const runtimeConfig = useRuntimeConfig().public

    const projectId = ref<string | null>(null);

    const cameraContext = ref<Camera>()

    const state = ref<PreviewState>({
        loading: true,
        selectedSceneId: '',
        selectedPoiId: ''
    });

    const project = reactive<PreviewData['project']>({
        id: '',
        title: '',
    });

    const theme = reactive<PreviewData['theme']>({
        colors: {
            primary: '',
            secondary: '',
            body: ''
        }
    });

    const scenes = ref<PreviewData['scenes']>([]);
    const pois = ref<PreviewData['pois']>([]);

    async function load(id: string, isLive: boolean = false) {
        if(isLive) {
            throw new Error('Not implemented');
        }
    }


    return {
        projectId,
        cameraContext,
        state,
        project,
        theme,
        scenes,
        pois,
        load,
    }


});