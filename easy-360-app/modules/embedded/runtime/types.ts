import type { AppPOI, AppProject, AppScene } from "~/types/app.types";

export type PreviewResponse = AppProject & {
    scene: AppScene & {
        pois: AppPOI[]
    }[]
}