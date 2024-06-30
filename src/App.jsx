import React, { useState, useEffect } from "react";
import Header from "./components/main/Header";
import Chatbox from "./components/main/Chatbox/index";
import SettingsModal from "./components/main/SettingsModal";

const App = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isVisionModel, setIsVisionModel] = useState(false);
  const [allowImageUpload, setAllowImageUpload] = useState(false); // New state variable
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const lastPrompt = localStorage.getItem("lastSystemPrompt");
    if (lastPrompt) {
      setSystemPrompt(lastPrompt);
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

  return (
    <div
      className={`h-screen w-screen flex justify-center overflow-hidden dark:bg-zinc-800 ${
        darkMode ? "dark" : ""
      } font-tahoma`}
    >
      <div className="container h-auto w-full flex flex-col border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 m-2 rounded-lg">
        <Header
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          setIsVisionModel={setIsVisionModel}
          setAllowImageUpload={setAllowImageUpload} // New prop
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          setIsModalOpen={setIsModalOpen}
        />
        <div className="flex-grow overflow-hidden">
          <Chatbox
            selectedModel={selectedModel}
            systemPrompt={systemPrompt}
            isVisionModel={isVisionModel}
            allowImageUpload={allowImageUpload} // New prop
          />
        </div>
      </div>
      {isModalOpen && (
        <SettingsModal
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default App;
