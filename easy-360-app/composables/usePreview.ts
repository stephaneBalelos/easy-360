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
    selectedScene: string;
    selectedPoi: string;
}

export const usePreview = createGlobalState(() => {

    const runtimeConfig = useRuntimeConfig().public

    const projectId = ref<string | null>(null);

    const selectedSceneId = ref<string | null>(null);

    const selectedPOIId = ref<string | null>(null);

    const state = ref<PreviewState>({
        loading: true,
        selectedScene: '',
        selectedPoi: ''
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
        selectedSceneId,
        selectedPOIId,
        project,
        theme,
        scenes,
        pois,
        load,
    }


});