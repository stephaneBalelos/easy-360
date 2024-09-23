import { serverSupabaseClient } from "#supabase/server";
import { projectFilesBucketId } from "~/constants";
import { Database } from "~/types/database.types";


export default defineEventHandler(async (event) => {
    const { project_id } = getQuery(event);

    if (!project_id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request - id is required",
        });
    }

    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.from("scenes").select("*").eq("project_id", project_id);

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

    
    const scenesFiles = data.map(async (scene) => {
      const path = `projects/${project_id}/scenes/${scene.id}/panorama.jpg`;
      const {data, error } = await client.storage.from(projectFilesBucketId).createSignedUrl(path, 60, {
          download: true
      })
  
      if (error) {
        return null;
      }
      return data;
    });
  
    const urls = await Promise.all(scenesFiles)
  
    const response = data.map((scene, index) => {
      return {
          ...scene,
          url: urls[index]?.signedUrl
      }
    })
  
    return response;

});