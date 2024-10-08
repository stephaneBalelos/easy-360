import { Spherical, Vector3 } from "three";
import gsap from "gsap";

export const useSceneControl = createGlobalState(() => {
    const { state, scenes } = usePreview();

    const camera = reactive({
        position: [3, 0, 0],
    })
    const cameraProps = reactive({
        fov: 75,
    })

    const light = reactive({
        intensity: 1,
    })

    const sphereBlur = reactive({
        vertical: 0,
        horizontal: 0,
    })

    const isTransitioning = ref(false);

    const cameraLookAt = (pos: Vector3) => {
        const spherical = new Spherical();

        spherical.setFromVector3(pos);
        spherical.radius = 2;
        const p = new Vector3().setFromSpherical(spherical);



        camera.position = [-p.x, -p.y, -p.z];

    };

    const cameraLookAtAnimated = (pos: Vector3, cb?: () => void) => {

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
            },
            onComplete: () => {
                cb && cb();
            }
        });
    }

    const goToScene = (sceneId: string, from: Vector3) => {
        if (!scenes.value) return;
        const scene = scenes.value.filter(scene => scene.id === sceneId)[0];

        if (!scene) return;


        cameraLookAtAnimated(from);
        sceneTransition(sceneId)

    }

    const sceneTransition = (sceneId: string) => {
        isTransitioning.value = true;
        const props = {
            fov: cameraProps.fov,
            vBlur: sphereBlur.vertical * 100,
            hBlur: sphereBlur.horizontal * 100,
        }

        const tl = gsap.timeline({
            onUpdate: () => {
                cameraProps.fov = props.fov;
                sphereBlur.vertical = props.vBlur / 100;
                sphereBlur.horizontal = props.hBlur / 100;
            },
            onComplete: () => {
                isTransitioning.value = false;
            }
        });

        tl.to(props, {
            fov: 50,
            vBlur: 100,
            hBlur: 100,
            duration: 1,
            onComplete: () => {
                state.value.selectedSceneId = sceneId;
            }
        })
        tl.to(props, {
            fov: 75,
            duration: 1,
            vBlur: 0,
            hBlur: 0,
        })
    }

    return {
        camera,
        cameraProps,
        light,
        sphereBlur,
        isTransitioning,
        cameraLookAt,
        cameraLookAtAnimated,
        goToScene,
    }
})