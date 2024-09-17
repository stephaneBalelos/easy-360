import { Spherical, Vector3 } from "three";
import { usePreviewState } from "./usePreviewState";
import { createGlobalState } from "@vueuse/core";
import gsap from "gsap";

export const usePreviewControls = createGlobalState(() => {
    const { cameraPosition } = usePreviewState()
    const cameraLookAt = (pos: Vector3) => {
        const spherical = new Spherical();

        spherical.setFromVector3(pos);
        spherical.radius = 2;
        const p = new Vector3().setFromSpherical(spherical);

        const position = {
            x: cameraPosition.x,
            y: cameraPosition.y,
            z: cameraPosition.z,
        }

        gsap.to(position, {
            x: -p.x,
            y: -p.y,
            z: -p.z,
            duration: 1,
            onUpdate: () => {
                console.log(position)
                cameraPosition.x = position.x;
                cameraPosition.y = position.y;
                cameraPosition.z = position.z;
            }
        });
    }

    return { cameraLookAt }
})