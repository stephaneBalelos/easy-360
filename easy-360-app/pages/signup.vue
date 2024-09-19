<script setup lang="ts">
import type { FormError } from "#ui/types";
import type { Database } from "~/types/database.types";

definePageMeta({
  layout: "auth",
});

const client = useSupabaseClient();
const toast = useToast();
const { origin } = useRequestURL();

const loading = ref(false);

type FormState = {
  name: string;
  email: string;
  password: string;
  remember: boolean;
};

const fields = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter your name",
  },
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
  if (!state.name) errors.push({ path: "name", message: "Name is required" });
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
    },
  },
];

async function onSubmit(d: FormState) {
  console.log(origin);
  loading.value = true;
  try {
    const { data, error } = await client.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        data: {
          name: d.name,
        },
        emailRedirectTo: origin + "/app",
      },
    });
    if (error) {
      toast.add({
        title: "Error while signing you up",
        description: error.message,
        color: "red",
      });
      throw error;
    }
    toast.add({
      title: "Check Your Mailbox!",
      description: "Confirmation Email has been sent to your email",
      timeout: 15000,
    });
    navigateTo("/login");
  } catch (error) {
    console.error("Error signing up", error);
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
      title="Hey there! Nice to meet you."
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      @submit="onSubmit"
      :loading="loading"
    >
      <template #description>
        Already have an account?
        <NuxtLink to="/login" class="text-primary font-medium">Login</NuxtLink>.
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
