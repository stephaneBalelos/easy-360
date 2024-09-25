<script setup lang="ts">
const { data: page } = await useAsyncData("index", () =>
  queryContent("/").findOne()
);
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  titleTemplate: "",
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
});
</script>

<template>
  <div v-if="page">
    <ULandingHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
    >
      <div
        class="absolute inset-0 landing-grid z-[-1] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      />

      <template #headline>
        <UBadge
          v-if="page.hero.headline"
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          <NuxtLink
            :to="page.hero.headline.to"
            target="_blank"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span class="absolute inset-0" aria-hidden="true" />
          </NuxtLink>

          {{ page.hero.headline.label }}

          <UIcon
            v-if="page.hero.headline.icon"
            :name="page.hero.headline.icon"
            class="ml-1 w-4 h-4 pointer-events-none"
          />
        </UBadge>
      </template>
    </ULandingHero>

    <ULandingSection class="!pt-0">
      <ImagePlaceholder />
    </ULandingSection>

    <ULandingSection
      v-for="(section, index) in page.sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      :align="section.align"
      :features="section.features"
      :links="section.links"
    >
      <img
        src="https://picsum.photos/360/360"
        class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
      />
    </ULandingSection>

    <ULandingSection
      :title="page.features.title"
      :description="page.features.description"
    >
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) in page.features.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>

    <ULandingSection>
      <ULandingLogos title="Integrate it on your Website" align="center" :ui="{
        images: 'mx-auto mt-10 flex flex-wrap items-center justify-center gap-8'
      }">
      <UIcon name="i-simple-icons-html5" class="w-10 h-10 flex-shrink-0" />
      <UIcon name="i-simple-icons-webflow" class="w-10 h-10 flex-shrink-0" />
      <UIcon name="i-simple-icons-wordpress" class="w-10 h-10 flex-shrink-0" />
    </ULandingLogos>
    </ULandingSection>

    <ULandingSection>
      <ULandingCTA
        v-bind="page.cta"
        class="bg-gray-100/50 dark:bg-gray-800/50"
      />
    </ULandingSection>
  </div>
</template>

<style scoped>
.landing-grid {
  background-size: 100px 100px;
  background-image: linear-gradient(
      to right,
      rgb(var(--color-gray-200)) 1px,
      transparent 1px
    ),
    linear-gradient(to bottom, rgb(var(--color-gray-200)) 1px, transparent 1px);
}
.dark {
  .landing-grid {
    background-image: linear-gradient(
        to right,
        rgb(var(--color-gray-800)) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        rgb(var(--color-gray-800)) 1px,
        transparent 1px
      );
  }
}
</style>
