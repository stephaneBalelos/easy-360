<template>
  <UDashboardCard
    title="Panorama Image"
    description="Upload a 360 image to be used as the background of the scene."
  >
    <div @click="fileInput?.click()" class="w-full h-40 mb-4 cursor-pointer">
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/jpeg, image/png"
        @change="onFileChange"
      />
      <div v-if="file">
        <img :src="file" class="w-full h-full object-cover" />
      </div>
      <div
        v-else
        class="w-full h-full bg-primary-50 dark:bg-primary-950 flex justify-center items-center"
      >
        <UIcon name="i-heroicons-photo" class="w-5 h-5" />
      </div>
    </div>
    {{ uppy.getFiles().length }}
    <UProgress v-if="uploadState == 'uploading'" :value="progressValue" />
  </UDashboardCard>
</template>

<script setup lang="ts">
import { useTusUplaoder } from "~/composables/useTusUploader";
import type { Database } from "~/types/database.types";

type ImageUploadCardProps = {
    bucketId: string;
    path: string;
};

const props = defineProps<ImageUploadCardProps>();
const { getSceneFileUrl } = useScenes();
const client = useSupabaseClient<Database>();

const uploadState = ref<"idle" | "uploading">("idle");

const fileInput = ref<HTMLInputElement | null>(null);
const progressValue = ref(0);

const file = ref<string | null>(null);

const {data:url, error, status } = await useAsyncData(`${props.bucketId}_${props.path}`, async () => {
  const {data:url, error} = await client.storage.from(props.bucketId).createSignedUrl(props.path, 60); 
  if (error) {
    console.error('Error getting scene file url', error);
    return;
  }
  return url;
}, { immediate: true });

onMounted(() => {
  if (url.value) {
    file.value = url.value.signedUrl;
  }
});

const { uppy } = useTusUplaoder(props.bucketId, props.path, {
  maxNumberOfFiles: 1,
  onError: () => {
    uploadState.value = "idle";
    console.log("error");
  },
  onProgress: (bytesUploaded, bytesTotal) => {
    uploadState.value = "uploading";
    progressValue.value = Math.round((bytesUploaded / bytesTotal) * 100);
    console.log("progress");
  },

  onSuccess: () => {
    uploadState.value = "idle";
    console.log("success");
  },
});

function onFileChange($event: Event) {
  if (!$event.target) {
    return;
  }
  const files = ($event.target as HTMLInputElement).files;
  if (!files || files.length === 0) {
    return;
  }

  file.value = URL.createObjectURL(files[0]);
  uppy.addFile({
    name: files[0].name,
    type: files[0].type,
    data: files[0],
  });
}

</script>

<style scoped></style>
