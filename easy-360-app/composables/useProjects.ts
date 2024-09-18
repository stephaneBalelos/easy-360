import type { AppProject } from "~/types/app.types"
import type { Database } from "~/types/database.types"
import { useEditorState } from "./useEditorState";

export type ProjectBase = {
    name: string;
    description: string;
}

export const useProjects = createGlobalState(() => {
    const client = useSupabaseClient<Database>()
    const { refreshProject } = useEditorState()
    const user = useSupabaseUser()

    const { data:projects, error, status, refresh} = useAsyncData(`app_projects`, async () => {
        if (user.value === null) {
            throw new Error('User not logged in')
        }
        const {data, error }= await client.from('projects').select('*').eq('owner', user.value.id)
        if (error) {
            throw error
        }
        return data
    })

    const createProject = async (p: ProjectBase) => {
        if (user.value === null) {
            throw new Error('User not logged in')
        }
        const {data, error} = await client.from('projects').insert({
            ...p,
            owner: user.value.id
        }).select('id')
        if (error) {
            throw error
        }
        refresh()
        return data
    }

    const updateProject = async (id: string, p: ProjectBase) => {
        const {data, error} = await client.from('projects').update(p).eq('id', id)
        if (error) {
            throw error
        }
        refresh()
        refreshProject()
        return data
    }

    const deleteProject = async (id: string) => {
        const {data, error} = await client.from('projects').delete().eq('id', id)
        if (error) {
            throw error
        }
        refresh()
        return data
    }



    return {
        projects,
        createProject,
        updateProject,
        deleteProject
    }
})