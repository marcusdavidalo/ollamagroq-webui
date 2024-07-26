import React, { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import AboutTab from "./AboutTab";

const SettingsModal = ({ settings, onSettingsChange, setIsModalOpen }) => {
  const [selectedTab, setSelectedTab] = useState("general");

  const renderTabContent = () => {
    switch (selectedTab) {
      case "general":
        return (
          <GeneralSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      case "about":
        return <AboutTab />;
      default:
        return null;
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
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
