import React, { useEffect, useState } from "react";
import axios from "axios";

const formatModelName = (name) => {
  let formattedName = name.split(":")[0];
  formattedName = formattedName.replace(/[-_]/g, " ");
  formattedName = formattedName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedName;
};

const Header = ({
  selectedModel,
  setSelectedModel,
  setIsVisionModel,
  darkMode,
  toggleDarkMode,
}) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:11434/api/tags");
        const modelList = response.data.models.map((model) => ({
          name: model.model,
          isVision: model.details.families.includes("clip"),
          parameterSize: model.details.parameter_size,
          families: model.details.families,
        }));
        setModels(modelList);

        const lastUsedModel = localStorage.getItem("lastUsedModel");

        if (
          lastUsedModel &&
          modelList.some((model) => model.name === lastUsedModel)
        ) {
          setSelectedModel(lastUsedModel);
          setIsVisionModel(
            modelList.find((model) => model.name === lastUsedModel).isVision
          );
        } else if (modelList.length > 0) {
          setSelectedModel(modelList[0].name);
          setIsVisionModel(modelList[0].isVision);
          localStorage.setItem("lastUsedModel", modelList[0].name);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [setSelectedModel, setIsVisionModel]);

  const handleModelSelect = (model) => {
    setSelectedModel(model.name);
    setIsVisionModel(model.isVision);
    localStorage.setItem("lastUsedModel", model.name);
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      setIsModalOpen(false);
    }
  };

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ollama Simple WebUI</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            {selectedModel ? formatModelName(selectedModel) : "Select Model"}
          </button>
          <button
            className="bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            onClick={() => {
              /* Add functionality */
            }}
          >
            New Chat
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-backdrop"
          onClick={handleOutsideClick}
        >
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Select Model
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
            {isLoading ? (
              <p>Loading models...</p>
            ) : (
              <ul className="space-y-2">
                {filteredModels.map((model, index) => (
                  <li
                    key={index}
                    className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                    onClick={() => handleModelSelect(model)}
                  >
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatModelName(model.name)}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Original name: {model.name}
                      <br />
                      Size: {model.parameterSize} | Vision:{" "}
                      {model.isVision ? "Yes" : "No"} | Families:{" "}
                      {model.families.join(", ")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
