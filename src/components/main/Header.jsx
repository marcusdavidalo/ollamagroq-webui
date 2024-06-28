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
        if (modelList.length > 0) {
          setSelectedModel(modelList[0]); // Set default model to the first one
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, [setSelectedModel]);

  return (
    <div className="p-4 border-b border-gray-300 flex justify-between items-center">
      <h1 className="text-2xl font-bold">AI Chat Application</h1>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg"
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
