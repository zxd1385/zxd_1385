import { supabase } from "../lib/supabaseClient";

export async function getComments(articleId) {
  const { data, error } = await supabase
    .from("comments")
    .select('*')
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
