import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const sendMessageToGroq = async (messages, model) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: model,
      max_tokens: 1024,
      temperature: 1,
      top_p: 1,
    });
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error sending message to Groq:", error);
    throw error;
  }
};

export const getGroqModels = async () => {
  try {
    const models = await groq.models.list();
    return models.data.map((model) => model.id);
  } catch (error) {
    console.error("Error fetching Groq models:", error);
    throw error;
  }
};
