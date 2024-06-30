import React, { useState, useEffect, useRef } from "react";

const SystemPrompt = ({ systemPrompt, setSystemPrompt }) => {
  const [promptHistory, setPromptHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const inputRef = useRef(null);

  useEffect(() => {
    const lastPrompt = localStorage.getItem("lastSystemPrompt");
    if (lastPrompt) {
      setSystemPrompt(lastPrompt);
      setLocalPrompt(lastPrompt);
    }
    const history = JSON.parse(
      localStorage.getItem("systemPromptHistory") || "[]"
    );
    setPromptHistory(history);
  }, [setSystemPrompt]);

  const handlePromptChange = (e) => {
    setLocalPrompt(e.target.value);
  };

  const savePrompt = () => {
    if (localPrompt.trim() !== "" && localPrompt !== systemPrompt) {
      setSystemPrompt(localPrompt);
      localStorage.setItem("lastSystemPrompt", localPrompt);
      const updatedHistory = [
        localPrompt,
        ...promptHistory.filter((p) => p !== localPrompt),
      ].slice(0, 20);
      setPromptHistory(updatedHistory);
      localStorage.setItem(
        "systemPromptHistory",
        JSON.stringify(updatedHistory)
      );
    } else if (localPrompt.trim() === "") {
      setSystemPrompt("");
      localStorage.removeItem("lastSystemPrompt");
    }
  };

  const toggleHistory = () => setIsHistoryOpen(!isHistoryOpen);

  const selectPrompt = (prompt) => {
    setLocalPrompt(prompt);
    setSystemPrompt(prompt);
    localStorage.setItem("lastSystemPrompt", prompt);
    setIsHistoryOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const deletePrompt = (index) => {
    const updatedHistory = promptHistory.filter((_, i) => i !== index);
    setPromptHistory(updatedHistory);
    localStorage.setItem("systemPromptHistory", JSON.stringify(updatedHistory));
  };

  const clearAllPrompts = () => {
    setPromptHistory([]);
    localStorage.removeItem("systemPromptHistory");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <textarea
          ref={inputRef}
          value={localPrompt}
          onChange={handlePromptChange}
          onBlur={savePrompt}
          className="flex-grow p-2 border border-zinc-300 dark:border-zinc-700 rounded-lg resize-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 min-h-[100px] resize-vertical"
          placeholder="Enter system prompt..."
        />
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={toggleHistory}
          className="px-4 py-2 bg-zinc-500 dark:bg-zinc-600 text-white rounded-lg hover:bg-zinc-600 dark:hover:bg-zinc-500 transition duration-150 ease-in-out"
        >
          {isHistoryOpen ? "Hide History" : "Show History"}
        </button>
      </div>
      {isHistoryOpen && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
            Prompt History
          </h3>
          <ul className="space-y-2 max-h-[200px] overflow-y-auto">
            {promptHistory.map((prompt, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg"
              >
                <button
                  onClick={() => selectPrompt(prompt)}
                  className="flex-grow text-left mr-2 text-zinc-900 dark:text-zinc-100 hover:text-blue-500 dark:hover:text-blue-400 transition duration-150 ease-in-out"
                >
                  {prompt}
                </button>
                <button
                  onClick={() => deletePrompt(index)}
                  className="px-2 py-1 bg-zinc-500 dark:bg-zinc-600 text-white rounded hover:bg-zinc-600 dark:hover:bg-zinc-500 transition duration-150 ease-in-out"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={clearAllPrompts}
            className="mt-4 px-4 py-2 bg-zinc-500 dark:bg-zinc-600 text-white rounded-lg hover:bg-zinc-600 dark:hover:bg-zinc-500 transition duration-150 ease-in-out"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemPrompt;
