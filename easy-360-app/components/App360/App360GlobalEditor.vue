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
      @change="handleChange"
    >
      <UFormGroup label="Primary Color" name="primaryColor" description="Chose the main Color for your project" >
        <UInput v-model="state.primaryColor" type="color" />
      </UFormGroup>
    </UForm>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  bodyColor: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

const state = reactive({
  primaryColor: "",
  secondaryColor: "",
  bodyColor: "",
});

async function handleChange($event: Schema) {
  console.log($event);
}
</script>

<style scoped></style>
