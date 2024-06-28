import React, { useState } from "react";
import axios from "axios";

const Chatbox = ({ selectedModel, systemPrompt }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { role: "user", content: input }];
      setMessages(newMessages);
      setInput("");

      const payload = {
        model: selectedModel,
        messages: [{ role: "system", content: systemPrompt }, ...newMessages],
      };

      console.log("Request payload:", JSON.stringify(payload, null, 2));

      try {
        const response = await axios.post(
          "http://localhost:11434/api/chat",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let fullMessage = "";

        // Check if response.data is a string (which might be the case if it's a newline-separated JSON)
        if (typeof response.data === "string") {
          const lines = response.data.split("\n");
          for (const line of lines) {
            if (line.trim() !== "") {
              try {
                const parsedLine = JSON.parse(line);
                if (parsedLine.message && parsedLine.message.content) {
                  fullMessage += parsedLine.message.content;
                }
              } catch (error) {
                console.error("Error parsing line:", error);
              }
            }
          }
        } else if (
          response.data &&
          response.data.message &&
          response.data.message.content
        ) {
          // If it's a single JSON object
          fullMessage = response.data.message.content;
        } else {
          console.error("Unexpected response format:", response.data);
          throw new Error("Unexpected response format");
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: fullMessage },
        ]);
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

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block p-2 rounded-lg bg-blue-100 text-gray-700">
              {message.content}
            </span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
