import type { ProjectSettings } from "~/composables/useProjects";
import type { Database } from "./database.types";

export type AppProject = Omit<Database['public']['Tables']['projects']['Row'], "settings"> & {
    settings: ProjectSettings
}
export type AppScene = Database['public']['Tables']['scenes']['Row']
export type AppPOI = Omit<Database['public']['Tables']['points_of_interest']['Row'], "design_data"> & {
    design_data: DesignProps
}
