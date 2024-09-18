<template>
  <UFormGroup :label="props.label" :description="props.description" class="grid gap-2 items-center" :ui="{ container: '' }" @change="onChange">
    <template #hint>
      <UIcon v-if="loading" name="i-heroicons-arrow-path" />
    </template>
    <slot></slot>
  </UFormGroup>
</template>

<script setup lang="ts">
type Props = {
  label: string;
  description: string;
};

const props = defineProps<Props>();

const loading = ref(false);

const onChange = () => {
    loading.value = true;
  console.log("onChanges");
};
</script>

<style scoped></style>
