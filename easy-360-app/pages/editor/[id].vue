<template>
  <UDashboardPage>
    <UDashboardPanel grow class="p-0">
      <template v-if="true">
        <UDashboardNavbar>
          <template #toggle>
            <UDashboardNavbarToggle icon="i-heroicons-x-mark" />

            <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
          </template>

          <template #left>
            <UTooltip text="Archive">
              <UButton
                icon="i-heroicons-archive-box"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UTooltip text="Move to junk">
              <UButton
                icon="i-heroicons-archive-box-x-mark"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UDivider orientation="vertical" class="mx-1.5" />

            <UPopover :popper="{ placement: 'bottom-start' }">
              <template #default="{ open }">
                <UTooltip text="Snooze" :prevent="open">
                  <UButton
                    icon="i-heroicons-clock"
                    color="gray"
                    variant="ghost"
                    :class="[open && 'bg-gray-50 dark:bg-gray-800']"
                  />
                </UTooltip>
              </template>

              <template #panel="{ close }">
                <DatePicker @close="close" />
              </template>
            </UPopover>
          </template>

          <template #right>
            <UTooltip text="Reply">
              <UButton
                icon="i-heroicons-arrow-uturn-left"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UTooltip text="Forward">
              <UButton
                icon="i-heroicons-arrow-uturn-right"
                color="gray"
                variant="ghost"
              />
            </UTooltip>

            <UDivider orientation="vertical" class="mx-1.5" />

            <!-- <UDropdown :items="dropdownItems">
              <UButton
                icon="i-heroicons-ellipsis-vertical"
                color="gray"
                variant="ghost"
              />
            </UDropdown> -->
          </template>
        </UDashboardNavbar>
        <UDashboardToolbar>
        <template #left>
          <USelectMenu
            v-model="currentBreakpoint"
            icon="i-heroicons-check-circle"
            placeholder="Status"
            :options="breakpoints"
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <!-- <USelectMenu
            v-model="selectedLocations"
            icon="i-heroicons-map-pin"
            placeholder="Location"
            :options="defaultLocations"
            multiple
          /> -->
        </template>

        <template #right>
          <!-- <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label>
              Display
            </template>
          </USelectMenu> -->
        </template>
      </UDashboardToolbar>

        <div class="w-full h-full">
          <App360Viewport />
        </div>

      </template>
      <div v-else class="flex-1 hidden lg:flex items-center justify-center">
        <UIcon
          name="i-heroicons-inbox"
          class="w-32 h-32 text-gray-400 dark:text-gray-500"
        />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import App360Viewport from '~/components/App360Viewport.vue';
import { useEditorBreakpoints } from '~/composables/useEditorBreakpoints';

definePageMeta({
  layout: "editor",
});

const route = useRoute();
const id = route.params.id;

const { breakpoints, currentBreakpoint } = useEditorBreakpoints();


</script>

<style scoped></style>
