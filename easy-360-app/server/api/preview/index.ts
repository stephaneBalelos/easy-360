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
    .select("*")
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

  return data;
});
