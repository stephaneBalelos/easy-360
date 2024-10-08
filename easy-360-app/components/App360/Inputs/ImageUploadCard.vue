<template>
  <UDashboardCard
    title="Panorama Image"
    description="Upload a panorama image for the scene"
  >
    <div @click="fileInput?.click()" class="w-full h-40 mb-4 cursor-pointer">
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/jpeg, image/png"
        @change="onFileChange"
      />
      <div class="w-full h-full" v-if="file">
        <NuxtImg :src="file" class="w-full h-full object-cover" />
      </div>
      <div
        v-else
        class="w-full h-full bg-primary-50 dark:bg-primary-950 flex justify-center items-center"
      >
        <UIcon name="i-heroicons-photo" class="w-5 h-5" />
      </div>
    </div>
    <UProgress v-if="uploadState == 'uploading'" :value="progressValue" />
  </UDashboardCard>
</template>

<script setup lang="ts">
import { useTusUplaoder } from "~/composables/useTusUploader";
import type { Database } from "~/types/database.types";
import { useImage } from '@vueuse/core'


type ImageUploadCardProps = {
    bucketId: string;
    path: string;
    fileUrl?: string | null;
};


const props = defineProps<ImageUploadCardProps>();
const $emits = defineEmits(['file-uploaded']);
const client = useSupabaseClient<Database>();

const uploadState = ref<"idle" | "uploading">("idle");

const fileInput = ref<HTMLInputElement | null>(null);
const progressValue = ref(0);

const file = ref<string | null>(null);

watch(() => props.fileUrl, (newVal) => {
  file.value = newVal ?? null;
}, { immediate: true });

const { uppy } = useTusUplaoder(props.bucketId, props.path, {
  maxNumberOfFiles: 1,
  onError: (err) => {
    uploadState.value = "idle";
  },
  onProgress: (bytesUploaded, bytesTotal) => {
    uploadState.value = "uploading";
    progressValue.value = Math.round((bytesUploaded / bytesTotal) * 100);
  },

  onSuccess: () => {
    uploadState.value = "idle";
    $emits("file-uploaded");
  },
});

onMounted(() => {
  if(props.fileUrl) {
    file.value = props.fileUrl;
    console.log(props.path);
  }
})

function onFileChange($event: Event) {
  if (!$event.target) {
    return;
  }
  const files = ($event.target as HTMLInputElement).files;
  if (!files || files.length === 0) {
    return;
  }

  file.value = URL.createObjectURL(files[0]);
  const filename = files[0].name;
  uppy.addFile({
    name: `panorama.${filename.split(".")[1]}`,
    type: files[0].type,
    data: files[0],
  });
}

</script>

<style scoped></style>
