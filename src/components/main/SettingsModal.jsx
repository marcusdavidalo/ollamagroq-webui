import React, { useState } from "react";
import SystemPrompt from "./SystemPrompt";

const SettingsModal = ({ systemPrompt, setSystemPrompt, setIsModalOpen }) => {
  const [selectedTab, setSelectedTab] = useState("general");

  const handleSave = () => {
    setIsModalOpen(false);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "general":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              System Prompt
            </h3>
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4">
              <SystemPrompt
                systemPrompt={systemPrompt}
                setSystemPrompt={setSystemPrompt}
              />
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Version
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">v1.0.0</p>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              License
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">MIT License</p>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Credits
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Developed by Marcus David Alo
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-md shadow-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl mb-4 text-zinc-900 dark:text-zinc-100">
          Settings
        </h2>
        <div className="flex border-b border-zinc-300 dark:border-zinc-600 mb-4 overflow-x-auto">
          {["general", "about"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 whitespace-nowrap ${
                selectedTab === tab
                  ? "border-b-2 border-blue-500 text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {renderTabContent()}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-150 ease-in-out"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
