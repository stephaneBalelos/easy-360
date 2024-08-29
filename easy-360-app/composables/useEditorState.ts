import type { AppProject } from "~/types/app.types"
import type { Database } from "~/types/database.types"

export const useEditorState = createGlobalState(() => {
    const selectedProjectId = ref<string | null>(null)
    const client = useSupabaseClient<Database>()

    const selectedSceneId = ref<string | null>(null)
    const selectedPOIId = ref<string | null>(null)

    const {data:selectedProject, error, status} = useAsyncData(async () => {
        if (!selectedProjectId.value) {
            return null
        }
        const {data, error} = await client.from('projects').select('*').eq('id', selectedProjectId.value).single()
        if (error) {
            throw error
        }
        return data
    }, {
        watch: [selectedProjectId]
    })

    watch(selectedProjectId, () => {
        selectedSceneId.value = null
        selectedPOIId.value = null
    })

    watch(selectedSceneId, () => {
        selectedPOIId.value = null
    })


    return {
        selectedProjectId,
        selectedProject,
        selectedSceneId,
        selectedPOIId
    }
    
})