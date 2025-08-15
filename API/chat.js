// OpenRouter API Chat Module
async function sendMessageToBot(userText) {
  if (!userText) return;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "deepseek-v1",
        messages: [{ role: "user", content: userText }]
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    return botReply;

  } catch (err) {
    console.error("Error sending message:", err);
    return "Sorry, something went wrong.";
  }
}
