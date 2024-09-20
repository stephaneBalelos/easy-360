<template>
  <div
    ref="sceneContainerEl"
    v-if="selectedScene"
    class="scene-details-container"
  >
    <div class="scene-details-content">
      <h2 class="scene-title">
        {{ selectedScene.name }}
      </h2>
      <p>{{ selectedScene.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePreviewState } from "../composables/usePreviewState";
import { watch, ref, onMounted } from "vue";
import gsap from "gsap";

const { selectedScene } = usePreviewState();
const sceneContainerEl = ref<HTMLDivElement>();

const show = ref(true)

const tl = gsap.timeline();

watch(
  selectedScene,
  (n) => {
    show.value = true
    enterAnimation()
  },
  { immediate: true }
);

onMounted(() => {
  if (!sceneContainerEl.value) {
        return;
    }
  tl.set(sceneContainerEl.value, {
    opacity: 1
  })

  tl.to(sceneContainerEl.value, {
      opacity: 0,
      duration: 1,
      delay: 3,
      onComplete: () => {
        console.log('completed')
        show.value = false  
      }
    });
})

function enterAnimation () {
  console.log("play")
  tl.restart()
}


</script>

<style lang="scss">
.scene-details-container {
  position: absolute;
  inset: 0;
  padding: var( --container-padding);
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: end;
  pointer-events: none;
  background: linear-gradient(
    0deg,
    rgba(var(--color-secondary) / 1) 0%,
    rgba(var(--color-secondary) / 0.3) 50%,
    rgba(var(--color-secondary) / 1) 100%
  );

  .scene-details-content {
    max-width: 100%;
    color: rgba(var(--color-body) / 1);
  }
}
</style>
