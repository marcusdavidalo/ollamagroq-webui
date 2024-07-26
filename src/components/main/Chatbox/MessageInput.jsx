import React, { useState } from "react";
import ImageUpload from "./ImageUpload";

const MessageInput = ({ onSendMessage, isVisionModel, allowImageUpload }) => {
  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() || selectedImage) {
      onSendMessage(input, selectedImage);
      setInput("");
      setSelectedImage(null);
    }
  };

  return (
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
        <ImageUpload
          isEnabled={isVisionModel || allowImageUpload}
          onImageSelect={setSelectedImage}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <button
          onClick={handleSend}
          className="p-2 bg-zinc-500 dark:bg-zinc-600 text-white rounded-lg hover:bg-zinc-600 dark:hover:bg-zinc-500 transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
