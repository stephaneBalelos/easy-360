import type { AppPOI, AppProject, AppScene } from "~/types/app.types";


export type SceneResponse = AppScene & {
    points_of_interest: AppPOI[]
    url: string
}

export type PreviewResponse = AppProject & {
    scenes: SceneResponse[]
}
