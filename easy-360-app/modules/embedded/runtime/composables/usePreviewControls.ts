import { Camera, PerspectiveCamera, Spherical, Vector3 } from "three";
import { usePreviewState } from "./usePreviewState";
import { createGlobalState } from "@vueuse/core";
import { ref, reactive } from "vue";
import gsap from "gsap";

export const usePreviewControls = createGlobalState(() => {
    const { selectedSceneId } = usePreviewState()
    const cameraContext = ref<PerspectiveCamera | null>(null)
    const cameraPosition = reactive({
        x: 3,
        y: 0,
        z: 0
    })
    const cameraProps = reactive({
        fov: 75,
        near: 0.1,
        far: 1000,
        aspect: window.innerWidth / window.innerHeight
    })
    const sphereProps = reactive({
        blur: 0, // 0 - 100
    })

    const isTransitioning = ref(false)

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
                cameraPosition.x = position.x;
                cameraPosition.y = position.y;
                cameraPosition.z = position.z;
            }
        });
    }

    const changeScene = async (sceneId: string, forwards = false) => {
        if (isTransitioning.value) {
            return
        }
        const proxy = {
            blur: sphereProps.blur,
            fov: cameraProps.fov,
        }

        isTransitioning.value = true

        const tl = gsap.timeline({
            onComplete: () => {
                isTransitioning.value = false
            }
        })

        tl.to(proxy, {
            blur: 750,
            fov: forwards ? 50 : 100,
            duration: 1,
            onUpdate: () => {
                sphereProps.blur = proxy.blur
                cameraProps.fov = proxy.fov
                console.log(cameraProps.fov)
            }, onComplete: () => {
                selectedSceneId.value = sceneId
            }
        })
        tl.to(proxy, {
            blur: 0,
            fov: 75,
            duration: 1,
            onUpdate: () => {
                sphereProps.blur = proxy.blur
                cameraProps.fov = proxy.fov
            },
            onComplete: () => {
                console.log("Scene changed")
            }
        })
    }

    return { cameraLookAt, cameraPosition, cameraProps, cameraContext, sphereProps, changeScene, isTransitioning }
})