import React, { useEffect, useState } from "react";
import axios from "axios";

const Header = ({ selectedModel, setSelectedModel }) => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get("http://localhost:11434/api/tags");
        const modelList = response.data.models.map((model) => model.model);
        setModels(modelList);

        // Get the last used model from local storage
        const lastUsedModel = localStorage.getItem("lastUsedModel");

        if (lastUsedModel && modelList.includes(lastUsedModel)) {
          setSelectedModel(lastUsedModel);
        } else if (modelList.length > 0) {
          setSelectedModel(modelList[0]); // Set default model to the first one
          localStorage.setItem("lastUsedModel", modelList[0]);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, [setSelectedModel]);

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    localStorage.setItem("lastUsedModel", newModel);
  };

  return (
    <div className="p-4 flex justify-between items-center bg-white">
      <h1 className="text-2xl font-bold">Ollama Simple WebUI</h1>
      <select
        value={selectedModel}
        onChange={handleModelChange}
        className="p-2 border border-zinc-300 rounded-lg"
      >
        {models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Header;
