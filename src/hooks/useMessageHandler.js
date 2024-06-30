import { useState, useCallback } from "react";

const useMessageHandler = (
  messages,
  setMessages,
  selectedModel,
  systemPrompt
) => {
  const [isLoading, setIsLoading] = useState(false);

  const updateAssistantMessage = useCallback(
    (assistantResponse) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages[updatedMessages.length - 1];
        if (lastMessage && lastMessage.role === "assistant") {
          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: assistantResponse,
          };
        } else {
          updatedMessages.push({
            role: "assistant",
            content: assistantResponse,
          });
        }
        return updatedMessages;
      });
    },
    [setMessages]
  );

  const handleSendMessage = async (input, selectedImage) => {
    setIsLoading(true);
    const newMessages = [
      ...messages,
      { role: "user", content: input, image: selectedImage },
    ];
    setMessages(newMessages);

    const payload = {
      model: selectedModel,
      prompt: input,
      messages: [{ role: "system", content: systemPrompt }, ...newMessages],
    };

    if (selectedImage) {
      payload.images = [selectedImage];
    }

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim() !== "") {
            try {
              const parsedLine = JSON.parse(line);
              if (parsedLine.response) {
                assistantResponse += parsedLine.response;
                updateAssistantMessage(assistantResponse);
              }
            } catch (error) {
              console.error("Error parsing line:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "An error occurred while processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSendMessage, isLoading };
};

export default useMessageHandler;
