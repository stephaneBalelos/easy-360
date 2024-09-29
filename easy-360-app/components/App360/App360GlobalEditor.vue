<template>
  <UDashboardSection
    title="Global Options"
    description="Customize the global options for your project"
    orientation="vertical"
    class="px-4 mt-6"
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
      <UFormGroup label="Primary Color" name="primaryColor" description="Chose the main Color for your project" >
        <EditorColorInput v-model="state.secondaryColor" />
      </UFormGroup>
      <UFormGroup label="Primary Color" name="primaryColor" description="Chose the main Color for your project" >
        <EditorColorInput v-model="state.bodyColor" />
      </UFormGroup>
    </UForm>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { z } from "zod";
import EditorColorInput from "./Inputs/EditorColorInput.vue";

const { selectedProjectId, selectedProject } = useEditorState()
const { updateProjectSettings } = useProjects()
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


async function handleChange() {
  
  try {
    const res = schema.parse(state)
    if (selectedProject.value) {
      const propjectSettings = selectedProject.value.settings as ProjectSettings
      await updateProjectSettings(selectedProject.value.id, {
        ...propjectSettings,
        colors: {
          primary: state.primaryColor,
          secondary: state.secondaryColor,
          body: state.bodyColor
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}


watch(selectedProjectId, async() => {
    await nextTick()
    if (selectedProject.value) {
        const settings = selectedProject.value.settings as ProjectSettings
        state.primaryColor = settings.colors.primary
        state.secondaryColor = settings.colors.secondary
        state.bodyColor = settings.colors.body
    }
}, { immediate: true });
</script>

<style scoped></style>
