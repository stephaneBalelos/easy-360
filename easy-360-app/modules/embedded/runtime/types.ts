import type { AppPOI, AppProject, AppScene } from "~/types/app.types";

export type POIResponse = AppPOI

export type SceneResponse = AppScene & {
    url: string
}

export type ProjectResponse = AppProject

export type PreviewResponse = AppProject & {
    scenes: SceneResponse[]
}
