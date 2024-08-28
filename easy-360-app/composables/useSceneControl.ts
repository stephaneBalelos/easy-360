import { Spherical, Vector3 } from "three";
import gsap from "gsap";

export const useSceneControl = createGlobalState(() => {
    const camera = reactive({
        position: [3, 0, 0],
    })

    const light = reactive({
        intensity: 1,
    })

    const cameraLookAt = (pos: Vector3) => {
        const spherical = new Spherical();

        spherical.setFromVector3(pos);
        spherical.radius = 2;
        const p = new Vector3().setFromSpherical(spherical);



        camera.position = [-p.x, -p.y, -p.z];

    };

    const cameraLookAtAnimated = (pos: Vector3) => {
        const spherical = new Spherical();

        spherical.setFromVector3(pos);
        spherical.radius = 2;
        const p = new Vector3().setFromSpherical(spherical);

        const position = {
            x: camera.position[0],
            y: camera.position[1],
            z: camera.position[2],
        }

        gsap.to(position, {
            x: -p.x,
            y: -p.y,
            z: -p.z,
            duration: 1,
            onUpdate: () => {
                camera.position = [position.x, position.y, position.z];
            }
        });
    }

    return {
        camera,
        light,
        cameraLookAt,
        cameraLookAtAnimated
    }
})