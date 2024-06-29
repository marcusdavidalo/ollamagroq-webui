import React, { useState, useRef, useEffect } from "react";

const CodeBlock = ({ code }) => (
  <pre className="bg-zinc-800 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-400 p-4 rounded-lg overflow-x-auto">
    <code>{code}</code>
  </pre>
);

const formatMessage = (content) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const parts = content.split(codeBlockRegex);
  const codeBlocks = content.match(codeBlockRegex) || [];

  return parts.reduce((acc, part, index) => {
    acc.push(<span key={`text-${index}`}>{part}</span>);
    if (index < codeBlocks.length) {
      const code = codeBlocks[index].replace(/```/g, "").trim();
      acc.push(<CodeBlock key={`code-${index}`} code={code} />);
    }
    return acc;
  }, []);
};

const Chatbox = ({ selectedModel, systemPrompt, isVisionModel }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result.split(",")[1]); // Store base64 data
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() || selectedImage) {
      const newMessages = [
        ...messages,
        { role: "user", content: input, image: selectedImage },
      ];
      setMessages(newMessages);
      setInput("");
      setSelectedImage(null);

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

        const processStream = async () => {
          const { done, value } = await reader.read();
          if (done) {
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim() !== "") {
              try {
                const parsedLine = JSON.parse(line);
                if (parsedLine.response) {
                  const newContent = parsedLine.response;
                  setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.role === "assistant") {
                      // Update the last assistant message
                      const updatedMessages = [...prevMessages];
                      updatedMessages[updatedMessages.length - 1] = {
                        ...lastMessage,
                        content: lastMessage.content + newContent,
                      };
                      return updatedMessages;
                    } else {
                      // Create a new assistant message
                      return [
                        ...prevMessages,
                        {
                          role: "assistant",
                          content: newContent,
                        },
                      ];
                    }
                  });
                }
              } catch (error) {
                console.error("Error parsing line:", error);
              }
            }
          }

          // Continue processing the stream
          processStream();
        };

        processStream();
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: "An error occurred while processing your request.",
          },
        ]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const deleteMessage = (index) => {
    setMessages(messages.slice(0, index));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-xl px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-zinc-500 dark:bg-zinc-600 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              }`}
            >
              {message.role === "user" && (
                <button
                  onClick={() => deleteMessage(index)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-zinc-600 dark:bg-zinc-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              )}
              <div className="whitespace-pre-wrap space-y-2">
                {formatMessage(message.content)}
              </div>
              {message.image && (
                <img
                  src={`data:image/jpeg;base64,${message.image}`}
                  alt="Uploaded"
                  className="mt-2 h-40 w-40 object-cover rounded"
                />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-zinc-300 dark:border-zinc-700 flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg resize-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
          placeholder="Type your message..."
          rows="3"
        />

        <div className="flex justify-between items-center mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={!isVisionModel}
          />
          <label
            htmlFor="image-upload"
            className={`p-2 ${
              isVisionModel
                ? "bg-zinc-500 dark:bg-zinc-600 hover:bg-zinc-600 dark:hover:bg-zinc-500 cursor-pointer"
                : "bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed"
            } text-white rounded-lg transition duration-200`}
          >
            {isVisionModel ? "Upload Image" : "Image Upload Not Supported"}
          </label>
          <button
            onClick={handleSendMessage}
            className="p-2 bg-zinc-500 dark:bg-zinc-600 text-white rounded-lg hover:bg-zinc-600 dark:hover:bg-zinc-500 transition duration-200"
          >
            Send
          </button>
        </div>
        {selectedImage && isVisionModel && (
          <div className="mt-2">
            <img
              src={`data:image/jpeg;base64,${selectedImage}`}
              alt="Selected"
              className="max-h-60 rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
