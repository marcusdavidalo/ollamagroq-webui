import React, { useState } from "react";
import Header from "./components/main/Header";
import Chatbox from "./components/main/Chatbox";
import SystemPrompt from "./components/main/SystemPrompt";

const App = () => {
  const [selectedModel, setSelectedModel] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
      <SystemPrompt setSystemPrompt={setSystemPrompt} />
      <Chatbox selectedModel={selectedModel} systemPrompt={systemPrompt} />
    </div>
  );
};

export default App;
