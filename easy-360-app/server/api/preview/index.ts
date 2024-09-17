import { serverSupabaseClient } from "#supabase/server";
import { projectFilesBucketId } from "~/constants";
import { Database } from "~/types/database.types";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

  const client = await serverSupabaseClient<Database>(event);

  const { data, error } = await client
    .from("projects")
    .select("*, scenes(*, points_of_interest(*))")
    .eq("id", id)
    .single();

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
    });
  }

  const response = data;

  const scenesFiles = data.scenes.map(async (scene) => {
    const path = `projects/${response.id}/scenes/${scene.id}/panorama.jpg`;
    const {data, error } = await client.storage.from(projectFilesBucketId).createSignedUrl(path, 60, {
        download: true
    })

    if (error) {
      return null;
    }
    return data;
  });

  const urls = await Promise.all(scenesFiles)

  data.scenes = data.scenes.map((scene, index) => {
    return {
        ...scene,
        url: urls[index]?.signedUrl
    }
  })

  return data;
});
