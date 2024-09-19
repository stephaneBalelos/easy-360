<template>
  <UHeader :links="links">
    <template #logo>
      Easy 360 <PartialsAppVersionBadge />
    </template>

    <template #right>
      <UButton
        v-if="user"
        label="Dashboard"
        color="gray"
        to="/app"
      />
      <UButton
        v-if="!user"
        label="Sign up"
        icon="i-heroicons-arrow-right-20-solid"
        trailing
        color="black"
        to="/signup"
        class="hidden lg:flex"
      />
    </template>

    <template #panel>
      <!-- <UNavigationTree
        :links="mapContentNavigation(navigation)"
        default-open
      /> -->
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))

const user = useSupabaseUser()

const links = [{
  label: 'Docs',
  to: '/'
}, {
  label: 'Pricing',
  to: '/'
}, {
  label: 'Blog',
  to: '/'
}]
</script>