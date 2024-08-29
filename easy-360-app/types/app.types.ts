import type { Database } from "./database.types";

export type AppProject = Database['public']['Tables']['projects']['Row']
export type AppScene = Database['public']['Tables']['scenes']['Row']
export type AppPOI = Database['public']['Tables']['points_of_interest']['Row']
