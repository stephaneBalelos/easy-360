import type { TresContext } from "@tresjs/core";
import type { Camera, Intersection } from "three";
import type { AppProject } from "~/types/app.types";
import type { Database } from "~/types/database.types";
type EditPanelState = "global" | "scene" | "poi";

export const useEditorState = createGlobalState(() => {
  const selectedProjectId = ref<string | null>(null);
  const client = useSupabaseClient<Database>();

  const selectedSceneId = ref<string | null>(null);
  const selectedPOIId = ref<string | null>(null);

  const editPanelState = ref<EditPanelState>("global");

  const isSceneLoading = ref(false);

  const pointerIntersectionWithSphere = ref<Intersection>()

  const tresCameraContext = ref<Camera>()

  const sceneError = ref<string | null>(null);

  const preview = usePreview();



  watch(selectedProjectId, () => {
    selectedSceneId.value = null;
    selectedPOIId.value = null;
    editPanelState.value = "global";
  });

  watch(selectedSceneId, () => {
    selectedPOIId.value = null;
    editPanelState.value = "scene";
    if (selectedSceneId.value) {
      preview.selectedSceneId.value = selectedSceneId.value;
    }
  }, { immediate: true });

  watch(selectedPOIId, (value) => {
    editPanelState.value = value ? "poi" : "scene";
    if (value) {
      preview.selectedPOIId.value = value;
    }
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
