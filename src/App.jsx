import React, { useState, useEffect } from "react";
import Header from "./components/main/Header";
import Chatbox from "./components/main/Chatbox";
import SystemPrompt from "./components/main/SystemPrompt";

const App = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isVisionModel, setIsVisionModel] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
      }`}
    >
      <div className="container h-full w-full flex flex-col border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <Header
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          setIsVisionModel={setIsVisionModel}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <SystemPrompt
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
        />
        <div className="flex-grow overflow-hidden">
          <Chatbox
            selectedModel={selectedModel}
            systemPrompt={systemPrompt}
            isVisionModel={isVisionModel}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
