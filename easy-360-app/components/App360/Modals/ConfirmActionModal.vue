<template>
  <UModal>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ props.title }}
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="emit('close')"
          />
        </div>
      </template>
      <div class="space-y-2">
        <p>{{ props.message }}</p>
        <p></p>
        <UButton v-if="props.cancelAction" :loading="loading" variant="soft" color="red" @click="emit('cancel')">
          {{ props.confirmActionLabel ?? "confirm" }}
        </UButton>
        <UButton :loading="loading" variant="soft" color="red" @click="confirm">
          {{ props.confirmActionLabel ?? "confirm" }}
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
type Props = {
  title: string;
  message: string;
  confirmActionLabel?: string;
  cancelActionLabel?: string;
  confirmAction: () => void | Promise<any>;
  cancelAction?: () => void | Promise<any>;
};
const props = defineProps<Props>();

const loading = ref(false);

const emit = defineEmits(["success", "error", "close", "cancel"]);

async function confirm() {
  try {
    loading.value = true;
    await props.confirmAction();
    emit("success");
  } catch (error) {
    emit("error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
