<template>
  <UModal>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            You are about to delete a Project
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
        <p>Are sure that you want to delete this Project?</p>
        <p></p>
        <UButton :loading="loading" variant="soft" color="red" @click="confirm">
          Yes Delete
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { deleteProject } = useProjects();
const loading = ref(false);

const emit = defineEmits(["success", "error", "close"]);

async function confirm() {
  try {
    loading.value = true;
    await deleteProject(props.id);
    emit("success");
  } catch (error) {
    emit("error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
