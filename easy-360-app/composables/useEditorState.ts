import type { TresContext } from "@tresjs/core";
import type { Camera, Intersection } from "three";
import type { AppProject } from "~/types/app.types";
import type { Database } from "~/types/database.types";

type EditPanelState = "global" | "scene" | "poi";

export const useEditorState = createGlobalState(() => {
  const client = useSupabaseClient<Database>();
  
  const selectedProjectId = ref<string | null>(null);
  const selectedSceneId = ref<string | null>(null);
  const selectedPOIId = ref<string | null>(null);

  const editPanelState = ref<EditPanelState>("global");

  const isSceneLoading = ref(false);

  const pointerIntersectionWithSphere = ref<Intersection>()

  const tresCameraContext = ref<Camera>()

  const sceneError = ref<string | null>(null);

  const selectedProject = ref<AppProject | null>(null);


  watch(selectedProjectId, async (value) => {
    selectedSceneId.value = null;
    selectedPOIId.value = null;
    if (value) {
      navigateTo(`/editor/${value}`);
    }
    editPanelState.value = "global";
  });

  watch(selectedSceneId, () => {
    selectedPOIId.value = null;
    editPanelState.value = "scene";
  }, { immediate: true });

  watch(selectedPOIId, (value) => {
    editPanelState.value = value ? "poi" : "scene";
  }, { immediate: true });


  const reloadSelectedScene = async () => {
    const sceneId = selectedSceneId.value;
    if (!sceneId) {
      return;
    }
    selectedSceneId.value = null;
    await nextTick();
    selectedSceneId.value = sceneId
  }

  return {
    selectedProject,
    tresCameraContext,
    selectedProjectId,
    selectedSceneId,
    selectedPOIId,
    editPanelState,
    isSceneLoading,
    pointerIntersectionWithSphere,
    reloadSelectedScene,
    sceneError
  };
});
