<template>
  <UButtonGroup size="sm" orientation="horizontal">
    <UInput placeholder="eg: #ffffff" v-model="model" disabled></UInput>
    <UButton color="gray" @click="colorInput?.click()">
      <div
        class="dot h-4 w-4 cursor-pointer"
        :style="{ backgroundColor: model }"
      ></div>
    </UButton>
    <input ref="colorInput" type="color" class="invisible absolute" v-model="model" @input="handleChange"/>
  </UButtonGroup>
</template>

<script setup lang="ts">



const model = defineModel({ type: String });
const colorInput = ref<HTMLInputElement | null>(null);




function handleChange($event: Event) {
  const target = $event.target as HTMLInputElement;
  model.value = target.value;
}

</script>

<style scoped></style>
