export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const items = searchParams.get("items");
  
    if (!items) {
      return new Response(JSON.stringify({ error: "No items provided." }), { status: 400 });
    }
  
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { // REMINDER, TOO REPLACE THIS WITH OWN AI PLATFORM
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // take key from .env
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: `Suggest dishes I can make with these ingredients: ${items}`,
            },
          ],
        }),
      });
  
      const data = await response.json();
  
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch from GROQ API." }), { status: 500 });
    }
  }