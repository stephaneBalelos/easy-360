import type { AppPOI, AppProject, AppScene } from "~/types/app.types";


export type SceneResponse = AppScene & {
    pois: AppPOI[]
    url: string
}

export type PreviewResponse = AppProject & {
    scenes: SceneResponse[]
}
