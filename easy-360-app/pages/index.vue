<template>
    <div v-if="page">
        {{ page.title }}
    </div>
</template>

<script setup lang="ts">
    const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
    if (!page.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }
</script>

<style scoped>

</style>