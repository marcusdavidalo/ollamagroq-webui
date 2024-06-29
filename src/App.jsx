import React, { useState, useEffect } from "react";
import Header from "./components/main/Header";
import Chatbox from "./components/main/Chatbox";
import SystemPrompt from "./components/main/SystemPrompt";

const App = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    const lastPrompt = localStorage.getItem("lastSystemPrompt");
    if (lastPrompt) {
      setSystemPrompt(lastPrompt);
    }
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center overflow-hidden">
      <div className="container h-full w-full flex flex-col border border-zinc-300">
        <Header
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
        <SystemPrompt
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
        />
        <div className="flex-grow overflow-hidden">
          <Chatbox selectedModel={selectedModel} systemPrompt={systemPrompt} />
        </div>
      </div>
    </div>
  );
};

export default App;
