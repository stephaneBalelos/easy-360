<template>
    <div>
        {{ props.url }}

        <button @click="increment">increment {{ counter }}</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

    const props = defineProps<{
        url: string
    }>()

    const counter = ref(0)

    const increment = () => {
        counter.value++
    }
</script>

<style scoped>

</style>