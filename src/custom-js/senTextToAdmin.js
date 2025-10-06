export async function sendTextToAdmin(text) {
    try {
      const url = new URL("https://zxdcloub-textvalidation-api.onrender.com/sendtext");
      url.searchParams.append("text", text); // send text as query
  
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // might not even need it for query params
        },
      });
  
      if (!response.ok) {
        throw new Error("Validation API failed");
      }
  
      const data = await response.json();
      return data; // { text, broadcast_ok, problems }
    } catch (error) {
      console.error("Error calling validation API:", error);
      return { broadcast_ok: "NO", problems: "Server error" };
    }
  }
  