import Uppy from "@uppy/core";
import Tus from "@uppy/tus";

export type TusUploaderProps = {
  maxNumberOfFiles?: number;
  onError?: (error: any) => void;
  onProgress?: (bytesUploaded: number, bytesTotal: number) => void;
  onSuccess?: () => void;
};

export const useTusUplaoder = (
  bucket_id: string,
  path: string,
  props?: TusUploaderProps
) => {
  const { supabaseStorageEndpoint, supabase } = useRuntimeConfig().public;
  const session = useSupabaseSession();

  const tusEndpoint = `${supabaseStorageEndpoint}/upload/resumable`;

  const uppy = new Uppy({
    restrictions: {
      maxNumberOfFiles: props?.maxNumberOfFiles ?? 1,
    },
  });
  uppy.use(Tus, {
    endpoint: tusEndpoint,
    headers: {
      authorization: `Bearer ${session.value.access_token}`,
      apikey: supabase.key,
      'x-upsert': 'true',
    },
    uploadDataDuringCreation: true,
    chunkSize: 6 * 1024 * 1024,
    allowedMetaFields: [
      "bucketName",
      "objectName",
      "contentType",
      "cacheControl",
    ],
    onError:
      props?.onError ??
      function (error) {
        console.log("Failed because: " + error);
      },
    onProgress:
      props?.onProgress ??
      function (bytesUploaded, bytesTotal) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
    onSuccess: function () {
        if (props?.onSuccess) {
            props.onSuccess();
        }
        console.log("Successful upload!");
      },
  });

  uppy.on("file-added", (file) => {
    const supabaseMetadata = {
      bucketName: bucket_id,
      objectName: path,
      contentType: file.type,
    };

    file.meta = {
      ...file.meta,
      ...supabaseMetadata,
    };
    uppy.upload();
  });

  return {
    uppy,
  };
};
