<template>
  <UCard class="max-w-sm w-full">
    <UAuthForm
      :fields="fields"
      :schema="schema"
      title="Forgot Password? 🤔"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      @submit="onSubmit"
      :validate-on="['submit']"
      :loading="loading"
    >
      <template #description>
        Enter your email address and we'll send you a link to reset your
        password. If you don't have an account, you can
        <NuxtLink to="/signup" class="text-primary font-medium"
          >Sign up</NuxtLink
        >
      </template>
      <!-- <template #validation>
            <UAlert color="red" icon="i-heroicons-information-circle-20-solid" title="Error signing in" />
          </template> -->
      <template #footer>
        Remember your password?
        <NuxtLink to="/login" class="text-primary font-medium">Login</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  layout: "auth",
});

type FormState = {
  email: string;
};
const fields = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
  },
];

const loading = ref(false);
const { origin } = useRequestURL();
const client = useSupabaseClient();
const toast = useToast();

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

async function onSubmit(state: FormState) {

  const { data, error } = await client.auth.resetPasswordForEmail(state.email, {
    redirectTo: origin + "/reset-password",
  });

  if (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    return;
  } else {
    toast.add({
      title: "Success",
      description: "Check your email for the reset link",
      color: "green",
    });
    navigateTo("/login");
  }
}
</script>

<style scoped></style>
