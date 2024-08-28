<template>
    <div v-if="selectedPOI" class="space-y-2">
        <UFormGroup label="Name">
            <template #description>
            Name of the POI
            <UIcon name="i-heroicons-information-circle" />
            </template>
            <template #default>
            <UInput v-model="selectedPOI.name" placeholder="Title.." />
            </template>
        </UFormGroup>
        <UFormGroup label="Description">
            <template #description>
            Description of the POI
            <UIcon name="i-heroicons-information-circle" />
            </template>
            <template #default>
            <UTextarea v-model="selectedPOI.description" placeholder="Description" />
            </template>
        </UFormGroup>
    </div>
</template>

<script setup lang="ts">

    const { selectedPOI } = usePOIs();
    
</script>

<style scoped>

</style>