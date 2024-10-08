import type { AppProject } from "~/types/app.types"
import type { Database } from "~/types/database.types"
import { useEditorState } from "./useEditorState";

export type ProjectBase = {
    name: string;
    description: string;
}

export type ProjectSettings = {
    colors: {
        primary: string;
        secondary: string;
        body: string;
    }
}

export const useProjects = createGlobalState(() => {
    const client = useSupabaseClient<Database>()
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
    }, {
        transform: (data) => {
            return data as AppProject[]
        }
    })

    const getProject = async (id: string) => {
        const cached = projects.value?.find(p => p.id === id)
        if (cached) {
            return cached
        }
        const {data, error} = await client.from('projects').select('*').eq('id', id).single()
        if (error) {
            throw error
        }
        return data as AppProject
    }

    const createProject = async (p: ProjectBase) => {
        if (user.value === null) {
            throw new Error('User not logged in')
        }
        const defaultSettings: ProjectSettings = {
            colors: {
                primary: '#082a1c',
                secondary: '#6a9e50',
                body: '#fbefdd'
            }       
        }
        const {data, error} = await client.from('projects').insert({
            ...p,
            owner: user.value.id,
            settings: defaultSettings
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

    const updateProjectSettings = async (id: string, settings: ProjectSettings) => {
        const {data, error} = await client.from('projects').update({settings}).eq('id', id).select('settings').single()
        if (error) {
            throw error
        }
        return data.settings as ProjectSettings
    }



    return {
        projects,
        getProject,
        createProject,
        updateProject,
        deleteProject,
        updateProjectSettings
    }
})