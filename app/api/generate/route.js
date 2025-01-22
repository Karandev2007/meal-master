export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const items = searchParams.get("items");
  const diet = searchParams.get("diet") || "vegetarian"; // default to vegetarian
  const nutritional = searchParams.get("nutritional") === "true";
  const surprise = searchParams.get("surprise") !== null;

  let query = "";

  // generate query based on input
  if (surprise) {
    query = `Suggest 1 random ${diet} dish I can make using common household ingredients, keep dish name in bold ${
      nutritional ? ", and include nutritional information. dont include *." : "."
    }`;
  } else if (items) {
    query = `Suggest up to 5 ${diet} dishes I can make with these ingredients: ${items}${
      nutritional ? ", and include nutritional information for each dish." : "."
    }`;
  } else {
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
            content: query,
          },
        ],
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch response from GROQ API." }),
        { status: 500 }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Something went wrong on the server, Please contact Karan" }),
      { status: 500 }
    );
  }
}