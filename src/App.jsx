import React, { useState, useEffect } from "react";
import Header from "./components/main/Header";
import Chatbox from "./components/main/Chatbox/index";
import SettingsModal from "./components/main/Settings/index";

const App = () => {
  const [settings, setSettings] = useState({
    selectedModel: "",
    systemPrompt: "",
    isVisionModel: false,
    allowImageUpload: false,
    isGroqModel: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const lastPrompt = localStorage.getItem("lastSystemPrompt");
    if (lastPrompt) {
      setSettings((prev) => ({ ...prev, systemPrompt: lastPrompt }));
    }
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // Note: SystemPrompt component now handles saving to localStorage
  };

  return (
    <div
      className={`h-screen w-screen flex justify-center overflow-hidden dark:bg-zinc-800 ${
        darkMode ? "dark" : ""
      } font-tahoma`}
    >
      <div className="container h-auto w-full flex flex-col border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 m-2 rounded-lg">
        <Header
          selectedModel={settings.selectedModel}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          setIsModalOpen={setIsModalOpen}
        />
        <div className="flex-grow overflow-hidden">
          <Chatbox
            selectedModel={settings.selectedModel}
            systemPrompt={settings.systemPrompt}
            isVisionModel={settings.isVisionModel}
            allowImageUpload={settings.allowImageUpload}
            isGroqModel={settings.isGroqModel}
          />
        </div>
      </div>
      {isModalOpen && (
        <SettingsModal
          settings={settings}
          onSettingsChange={handleSettingsChange}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default App;
