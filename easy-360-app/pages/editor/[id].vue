<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">


const route = useRoute();
const id = route.params.id;
const { selectedProjectId } = useEditorState();
selectedProjectId.value = id as string;
</script>

<style scoped></style>
