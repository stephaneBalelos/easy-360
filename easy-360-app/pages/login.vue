<script setup lang="ts">
import type { FormError } from "#ui/types";

definePageMeta({
  layout: "auth",
});

const client = useSupabaseClient();
const loading = ref(false);
const toast = useToast();

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

const fields = [
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
  {
    name: "remember",
    label: "Remember me",
    type: "checkbox",
  },
];

const validate = (state: FormState) => {
  const errors: FormError[] = [];
  if (!state.email)
    errors.push({ path: "email", message: "Email is required" });
  if (!state.password)
    errors.push({ path: "password", message: "Password is required" });
  return errors;
};

const providers = [
  {
    label: "Continue with Google",
    icon: "i-simple-icons-google",
    color: "white" as const,
    click: () => {
      console.log("Redirect to Google");
      toast.add({
        title: "Google login is not available",
        description: "Please try again later",
        color: "red",
        timeout: 5000,
      });
    },
  },
];

async function onSubmit(d: FormState) {
  loading.value = true;
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: d.email,
      password: d.password,
    });
    if (error) {
      throw error;
    }
    navigateTo("/app");
  } catch (error) {
    console.error("Error signing in", error);
  } finally {
    loading.value = false;
  }
}
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      title="Welcome back!"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      @submit="onSubmit"
    >
      <template #description>
        Don't have an account?
        <NuxtLink to="/signup" class="text-primary font-medium"
          >Sign up</NuxtLink
        >.
      </template>

      <template #password-hint>
        <NuxtLink to="/forgot-password" class="text-primary font-medium"
          >Forgot password?</NuxtLink
        >
      </template>
      <!-- <template #validation>
        <UAlert color="red" icon="i-heroicons-information-circle-20-solid" title="Error signing in" />
      </template> -->
      <template #footer>
        By signing in, you agree to our
        <NuxtLink to="/" class="text-primary font-medium"
          >Terms of Service</NuxtLink
        >.
      </template>
    </UAuthForm>
  </UCard>
</template>
