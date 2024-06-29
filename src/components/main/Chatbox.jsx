import React, { useState, useRef, useEffect } from "react";

const CodeBlock = ({ code }) => (
  <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
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

const Chatbox = ({ selectedModel, systemPrompt }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { role: "user", content: input }];
      setMessages(newMessages);
      setInput("");

      const payload = {
        model: selectedModel,
        messages: [{ role: "system", content: systemPrompt }, ...newMessages],
      };

      try {
        const response = await fetch("http://localhost:11434/api/chat", {
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
                if (parsedLine.message && parsedLine.message.content) {
                  const newContent = parsedLine.message.content;
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
    <div className="flex flex-col h-full bg-white overflow-hidden">
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
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {message.role === "user" && (
                <button
                  onClick={() => deleteMessage(index)}
                  className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              )}
              <div className="whitespace-pre-wrap space-y-2">
                {formatMessage(message.content)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-300 flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border border-gray-300 rounded-lg resize-none"
          placeholder="Type your message..."
          rows="3"
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
