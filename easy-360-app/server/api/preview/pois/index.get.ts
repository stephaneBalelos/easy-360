import { serverSupabaseClient } from "#supabase/server";
import { Database } from "~/types/database.types";


export default defineEventHandler(async (event) => {
    const { scene_id } = getQuery(event);

    if (!scene_id) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad Request - scene_id is required",
        });
    }

    console.log("scene_id", scene_id);

    const client = await serverSupabaseClient<Database>(event);

    const { data, error } = await client.from("points_of_interest").select("*").eq("scene_id", scene_id).eq("visible", true);

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

    console.log("data", data);
  
    return data;

});