import { supabase } from "../lib/supabaseClient";
export default async function addComment(articleId, userId, content) {
    const { error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: userId,
      content,
    });
  
    if (error) throw error;
  }
  