import React, { useState, useEffect, useRef } from "react";

const SystemPrompt = ({ systemPrompt, setSystemPrompt }) => {
  const [promptHistory, setPromptHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localPrompt, setLocalPrompt] = useState(systemPrompt);
  const inputRef = useRef(null);

  useEffect(() => {
    // Load the last used prompt and history from local storage
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
      // Update history
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
      // If the prompt is empty, clear the system prompt and don't save to history
      setSystemPrompt("");
      localStorage.removeItem("lastSystemPrompt");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const selectPrompt = (prompt) => {
    setLocalPrompt(prompt);
    setSystemPrompt(prompt);
    localStorage.setItem("lastSystemPrompt", prompt);
    closeModal();
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
    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 border-y border-zinc-300 dark:border-zinc-700">
      <div className="flex items-center space-x-2">
        <input
          ref={inputRef}
          type="text"
          value={localPrompt}
          onChange={handlePromptChange}
          onBlur={savePrompt}
          className="flex-grow p-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
          placeholder="Enter system prompt..."
        />
        <button
          onClick={openModal}
          className="px-4 py-2 bg-zinc-500 dark:bg-zinc-600 text-white rounded-lg hover:bg-zinc-600 dark:hover:bg-zinc-500 transition duration-150 ease-in-out"
        >
          History
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white dark:bg-zinc-800 p-4 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 m-4 px-4 py-2 bg-zinc-500 dark:bg-zinc-600 text-white rounded-lg hover:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              System Prompt History
            </h2>
            <ul>
              {promptHistory.map((prompt, index) => (
                <li
                  key={index}
                  className="mb-2 flex justify-between items-center"
                >
                  <button
                    onClick={() => selectPrompt(prompt)}
                    className="flex-grow text-left p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded mr-2 text-zinc-900 dark:text-zinc-100"
                  >
                    {prompt}
                  </button>
                  <button
                    onClick={() => deletePrompt(index)}
                    className="px-2 py-1 bg-zinc-500 dark:bg-zinc-600 text-white rounded hover:bg-zinc-600 dark:hover:bg-zinc-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={clearAllPrompts}
              className="mt-4 px-4 py-2 bg-zinc-500 dark:bg-zinc-600 text-white rounded-lg hover:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemPrompt;
