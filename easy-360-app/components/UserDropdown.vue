<script setup lang="ts">
import type { Database } from '~/types/database.types';

const { isHelpSlideoverOpen } = useDashboard()
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()
const router = useRouter()

const items = computed(() => [
  [{
    slot: 'account',
    label: '',
    disabled: true
  }], [{
    label: 'Account',
    icon: 'i-heroicons-user',
    to: '/app/account'
  }, {
    label: 'Help & Support',
    icon: 'i-heroicons-question-mark-circle',
    shortcuts: ['?'],
    click: () => isHelpSlideoverOpen.value = true
  }], [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open',
    to: 'https://ui.nuxt.com/pro/getting-started',
    target: '_blank'
  },{
    label: 'Pro Version',
    icon: 'i-heroicons-credit-card',
    to: 'https://ui.nuxt.com/pro/purchase',
    target: '_blank'
  }], [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => signOut()
  }]
])


async function signOut() {
  client.auth.signOut()
  router.push('/')
}


</script>

<template>
  <UDropdown
    v-if="user"
    mode="hover"
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        :label="user.user_metadata.name"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            size="2xs"
          />
        </template>

      </UButton>
    </template>

    <template #account>
      <div class="text-left">
        <p>
          Signed in as
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ user.email }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>