export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "No message provided" });
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-v1",
          messages: [{ role: "user", content: message }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        return res.status(500).json({ reply: "Error from OpenRouter API" });
      }

      const data = await response.json();
      const botReply = data.choices[0]?.message?.content || "No reply from bot";
      res.status(200).json({ reply: botReply });

    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ reply: "Sorry, something went wrong." });
    }
  } else {
    res.status(405).json({ reply: "Method not allowed" });
  }
}
