import type { TresContext } from "@tresjs/core";
import type { Camera, Intersection } from "three";
import type { AppProject } from "~/types/app.types";
import type { Database } from "~/types/database.types";
type EditPanelState = "none" | "scene" | "poi";

export const useEditorState = createGlobalState(() => {
  const selectedProjectId = ref<string | null>(null);
  const client = useSupabaseClient<Database>();

  const selectedSceneId = ref<string | null>(null);
  const selectedPOIId = ref<string | null>(null);

  const editPanelState = ref<EditPanelState>("none");

  const isSceneLoading = ref(false);

  const pointerIntersectionWithSphere = ref<Intersection>()

  const tresCameraContext = ref<Camera>()

  const {
    data: selectedProject,
    error,
    status,
    refresh,
  } = useAsyncData(
    async () => {
      if (!selectedProjectId.value) {
        return null;
      }
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("id", selectedProjectId.value)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    {
      watch: [selectedProjectId],
    }
  );


  watch(selectedProjectId, () => {
    selectedSceneId.value = null;
    selectedPOIId.value = null;
    editPanelState.value = "none";
  });

  watch(selectedSceneId, () => {
    selectedPOIId.value = null;
    editPanelState.value = "scene";
  }, { immediate: true});

    watch(selectedPOIId, (value) => {
        editPanelState.value = value ? "poi" : "scene";
    }, { immediate: true });

  return {
    tresCameraContext,
    selectedProjectId,
    selectedProject,
    selectedSceneId,
    selectedPOIId,
    refreshProject: refresh,
    editPanelState,
    isSceneLoading,
    pointerIntersectionWithSphere
  };
});
