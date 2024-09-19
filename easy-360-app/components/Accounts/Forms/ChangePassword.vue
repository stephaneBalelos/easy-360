<template>
  <UForm
    :state="state"
    :schema="schema"
    :validate-on="['submit']"
    @submit="onSubmit"
  >
    <UFormGroup
      name="password_confirm"
      label="Password"
      description="Enter your new password and confirm it."
      class="grid grid-cols-2 gap-2"
      :ui="{ container: '' }"
    >
      <UInput
        id="password"
        v-model="state.password"
        type="password"
        placeholder="New password"
        size="md"
      />
      <UInput
        id="password_confirm"
        v-model="state.password_confirm"
        type="password"
        placeholder="Confirm new password"
        size="md"
        class="mt-2"
      />
    </UFormGroup>
    <div class="flex justify-end my-4">
        <UButton type="submit" label="Change Password" color="black" :loading="loading" />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";

const state = reactive({
  password: "",
  password_confirm: "",
});

const loading = ref(false);
const client = useSupabaseClient();
const toast = useToast();

const schema = z.object({
  password: z.string().min(8),
  password_confirm: z.string().min(8).refine((data) => {
    return data === state.password;
  }, "Passwords do not match"),
});

type Schema = z.infer<typeof schema>;

async function onSubmit(d: Schema) {
    loading.value = true;
    const { data, error } = await client.auth
    .updateUser({ password: d.password })

    if (error) {
        toast.add({
            title: "Error while updating password",
            description: error.message,
            color: "red",
        });
    } else {
        toast.add({
            title: "Password updated",
            description: "Your password has been updated successfully",
        })
    }
    loading.value = false;
}
</script>

<style scoped></style>
