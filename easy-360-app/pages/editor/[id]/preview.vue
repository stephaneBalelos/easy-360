<template>
    <Easy360Embedded :id="id"></Easy360Embedded>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "editor",
});

const route = useRoute();
const id = route.params.id as string;
</script>

<style scoped>

</style>