<template>
    <UDashboardPanel grow>
        <ClientOnly>
            <NuxtPage />
        </ClientOnly>
    </UDashboardPanel>
</template>

<script setup lang="ts">
    definePageMeta({
        layout: 'editor'
    })
</script>

<style scoped>

</style>