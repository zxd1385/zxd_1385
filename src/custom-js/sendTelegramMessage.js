import { supabase } from "../lib/supabaseClient"; // adjust path if needed

export async function sendTelegramMessage(text) {
  try {
    // ✅ Get current session (for authorization if needed)
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      console.warn("No session found — message not sent.");
      return { ok: false, error: "No session" };
    }
    console.log(session);

    // ✅ Make the API call to your Supabase Edge Function
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/sendToTelegram`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Telegram API Error:", errorText);
      return { ok: false, error: errorText };
    }

    const data = await response.json();
    console.log("✅ Telegram message sent:", data);
    return { ok: true, data };
  } catch (err) {
    console.error("❌ Failed to send Telegram message:", err);
    return { ok: false, error: err.message };
  }
}
