import type { Database } from "./database.types";

export type AppProject = Database['public']['Tables']['projects']['Row']
export type AppScene = Database['public']['Tables']['scenes']['Row']
export type AppPOI = Omit<Database['public']['Tables']['points_of_interest']['Row'], "design_data"> & {
    design_data: DesignProps
}
