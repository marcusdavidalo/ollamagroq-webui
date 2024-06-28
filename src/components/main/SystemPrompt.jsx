import React from "react";

const SystemPrompt = ({ systemPrompt, setSystemPrompt }) => {
  return (
    <div className="p-4 bg-gray-100 border-b border-gray-300">
      <input
        type="text"
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Enter system prompt..."
      />
    </div>
  );
};

export default SystemPrompt;
