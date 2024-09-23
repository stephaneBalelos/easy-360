<template>
    <Easy360Embedded :id="id"></Easy360Embedded>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "editor",
});

const route = useRoute();
const id = route.params.id;
</script>

<style scoped>

</style>