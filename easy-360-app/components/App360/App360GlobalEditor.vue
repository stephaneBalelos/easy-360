<template>
  <UDashboardSection
    title="Global Options"
    description="Customize the global options for your project"
    orientation="vertical"
    class="p-4"
  >
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      :validate-on="['blur', 'change', 'input']"
      @change="handleChange"
    >
      <UFormGroup label="Primary Color" name="primaryColor" description="Chose the main Color for your project" >
        <EditorColorInput v-model="state.primaryColor" />
      </UFormGroup>
      <UFormGroup label="Secondary Color" name="primaryColor" description="Chose the secondary Color for your project" >
        <EditorColorInput v-model="state.secondaryColor" />
      </UFormGroup>
      <UFormGroup label="Body Color" name="primaryColor" description="Chose the text for your project" >
        <EditorColorInput v-model="state.bodyColor" />
      </UFormGroup>
    </UForm>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { z } from "zod";
import EditorColorInput from "./Inputs/EditorColorInput.vue";
import { projectKey } from "~/constants";

const { selectedProjectId, selectedProject } = useEditorState()
const { updateProjectSettings } = useProjects()
const client = useSupabaseClient()

const schema = z.object({
  primaryColor: z.string().length(7, "Please enter a valid color"),
  secondaryColor: z.string().length(7, "Please enter a valid color"),
  bodyColor: z.string().length(7, "Please enter a valid color"),
});

type Schema = z.infer<typeof schema>;

const state = reactive({
  primaryColor: "#4ade80",
  secondaryColor: "#fb923c",
  bodyColor: "#0f172a",
});

onMounted(() => {
  if (selectedProject.value) {
    const propjectSettings = selectedProject.value.settings as ProjectSettings
    state.primaryColor = propjectSettings.colors.primary
    state.secondaryColor = propjectSettings.colors.secondary
    state.bodyColor = propjectSettings.colors.body
  }
})


async function handleChange() {
  try {
    const res = schema.parse(state)
    if (selectedProject.value) {
      // preview.theme.colors.primary = state.primaryColor
      // preview.theme.colors.secondary = state.secondaryColor
      // preview.theme.colors.body = state.bodyColor
      const propjectSettings = selectedProject.value.settings as ProjectSettings
      const res = await updateProjectSettings(selectedProject.value.id, {
        ...propjectSettings,
        colors: {
          primary: state.primaryColor,
          secondary: state.secondaryColor,
          body: state.bodyColor
        }
      })
      selectedProject.value.settings = res
    }
  } catch (error) {
    console.log(error)
  }
}

</script>

<style scoped></style>
