import React, { useRef, useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import useMessageHandler from "../../../hooks/useMessageHandler";
import useDragAndDrop from "../../../hooks/useDragAndDrop";

const Chatbox = ({
  selectedModel,
  systemPrompt,
  isVisionModel,
  allowImageUpload,
  isGroqModel,
}) => {
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  const { handleSendMessage, isLoading } = useMessageHandler(
    messages,
    setMessages,
    selectedModel,
    systemPrompt,
    isGroqModel
  );

  const {
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop(setSelectedImage);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessageWithImage = (input, image) => {
    handleSendMessage(input, image);
    setSelectedImage(null);
  };

  return (
    <div
      className="flex flex-col h-full bg-white dark:bg-zinc-900 overflow-hidden font-tahoma relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <MessageList
        messages={messages}
        onDeleteMessage={(index) => setMessages(messages.slice(0, index))}
      />
      <MessageInput
        onSendMessage={handleSendMessageWithImage}
        isVisionModel={isVisionModel && !isGroqModel}
        allowImageUpload={allowImageUpload && !isGroqModel}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isLoading={isLoading}
      />
      {isDragging && !isGroqModel && (
        <div className="absolute inset-0 bg-zinc-500 bg-opacity-50 flex items-center justify-center pointer-events-none">
          <p className="text-white text-2xl">Drop image here</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chatbox;
