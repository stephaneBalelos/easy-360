<template>
  <UCard class="max-w-sm w-full">
    <UAuthForm
      v-if="user"
      :fields="fields"
      :schema="schema"
      :title="`Hello ${user.user_metadata.name}`"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      @submit="onSubmit"
      :validate-on="['submit']"
      :loading="loading"
    >
      <template #description>
        Enter your new password and confirm it to continue.
      </template>
      <!-- <template #validation>
            <UAlert color="red" icon="i-heroicons-information-circle-20-solid" title="Error signing in" />
          </template> -->
      <template #footer> </template>
    </UAuthForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

type FormState = {
  password: string;
  confirm_password: string;
};
const fields = [
  {
    name: "password",
    type: "password",
    label: "New Password",
    placeholder: "Enter your new password",
  },
  {
    name: "confirm_password",
    type: "password",
    label: "Confirm Password",
    placeholder: "Confirm your new password",
  },
];

const loading = ref(false);
const { origin } = useRequestURL();
const client = useSupabaseClient();
const toast = useToast();
const user = useSupabaseUser();

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string().min(8, "Password must be at least 8 characters"),
});

schema.superRefine((data, ctx) => {
  if (data.password !== data.confirm_password) {
    return ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ["confirm_password"],
    });
  }
});

async function onSubmit(state: FormState) {
  if (!user.value) {
    navigateTo("/login");
  }
  const { data, error } = await client.auth.updateUser({
    password: state.password,
  });
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
  } else {
    toast.add({
      title: "Success",
      description: "Password updated successfully",
      color: "green",
    });
    navigateTo("/app");
  }
}

onMounted(() => {
  if (!user.value) {
    navigateTo("/forgot-password");
    toast.add({
        title: "Error",
        description: "An error occurred. Please try again.",
        color: "red",
    })
  }
});
</script>

<style scoped></style>
