export async function validateWithServer (text)  {
    try {
      const response = await fetch(
        `https://zxdcloub-textvalidation-api.onrender.com/checktext`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Validation API failed");
      }
  
      const data = await response.json();
      return data; // { text, broadcast_ok, problems }
    } catch (error) {
      console.error("Error calling validation API:", error);
      return { broadcast_ok: "NO", problems: "Server error" };
    }
  };