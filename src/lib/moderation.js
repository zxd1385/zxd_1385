// utils/moderation.js
export async function moderateText(text) {
    const apiKey = import.meta.env.VITE_TEXT_API_KEY;
  
    try {
      const response = await fetch("https://api.thehive.ai/api/v2/task/sync", {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_data: text,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Moderation API error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Moderation failed:", err);
      return { error: err.message };
    }
  }
  