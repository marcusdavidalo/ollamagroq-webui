import React from "react";
import { formatMessage } from "../../../utils/messageFormatting";

const MessageList = ({ messages, onDeleteMessage }) => {
  return (
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
                onClick={() => onDeleteMessage(index)}
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
    </div>
  );
};

export default MessageList;
