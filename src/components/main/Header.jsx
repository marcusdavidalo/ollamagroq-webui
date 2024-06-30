import React, { useEffect, useState, useMemo } from "react";
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
  setIsModalOpen,
}) => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [modelDetails, setModelDetails] = useState(null);

  const fetchModelDetails = async (modelName) => {
    try {
      const response = await axios.post("http://localhost:11434/api/show", {
        name: modelName,
      });
      setModelDetails(response.data);
    } catch (error) {
      console.error("Error fetching model details:", error);
    }
  };

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
          fetchModelDetails(lastUsedModel);
        } else if (modelList.length > 0) {
          setSelectedModel(modelList[0].name);
          setIsVisionModel(modelList[0].isVision);
          localStorage.setItem("lastUsedModel", modelList[0].name);
          fetchModelDetails(modelList[0].name);
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
    fetchModelDetails(model.name);
    setIsModelModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      setIsModelModalOpen(false);
    }
  };

  const filteredAndSortedModels = useMemo(() => {
    let result = models.filter((model) =>
      Object.values(model).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    result.sort((a, b) => {
      let compareA = a[sortCriteria];
      let compareB = b[sortCriteria];

      if (typeof compareA === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (compareA < compareB) return sortDirection === "asc" ? -1 : 1;
      if (compareA > compareB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [models, searchTerm, sortCriteria, sortDirection]);

  const handleSort = (criteria) => {
    if (criteria === sortCriteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortDirection("asc");
    }
  };

  return (
    <header className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 shadow-md font-tahoma rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-light">Ollama WebUI</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsModelModalOpen(true)}
            className="bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            {selectedModel ? formatModelName(selectedModel) : "Select Model"}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-zinc-500 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Settings
          </button>
        </div>
      </div>

      {isModelModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-backdrop"
          onClick={handleOutsideClick}
        >
          <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Select Model
              </h2>
              <button
                onClick={() => setIsModelModalOpen(false)}
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
              <div>
                <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-zinc-700 dark:text-zinc-300">
                  <button
                    onClick={() => handleSort("name")}
                    className="text-left hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Name{" "}
                    {sortCriteria === "name" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                  <button
                    onClick={() => handleSort("parameterSize")}
                    className="text-left hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Size{" "}
                    {sortCriteria === "parameterSize" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                  <button
                    onClick={() => handleSort("isVision")}
                    className="text-left hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Vision{" "}
                    {sortCriteria === "isVision" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                  <button
                    onClick={() => handleSort("families")}
                    className="text-left hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Families{" "}
                    {sortCriteria === "families" &&
                      (sortDirection === "asc" ? "▲" : "▼")}
                  </button>
                </div>
                <ul className="space-y-2">
                  {filteredAndSortedModels.map((model, index) => (
                    <li
                      key={index}
                      className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                      onClick={() => handleModelSelect(model)}
                    >
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {formatModelName(model.name)}
                          </div>
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {model.name}
                          </div>
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-400">
                          {model.parameterSize}
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-400">
                          {model.isVision ? "Yes" : "No"}
                        </div>
                        <div className="text-zinc-600 dark:text-zinc-400">
                          {model.families.join(", ")}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {modelDetails && (
              <div className="mt-4 border-t border-zinc-300 dark:border-zinc-600 pt-4">
                <h3 className="text-xl font-semibold mb-2">Model Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p>
                      <strong>Family:</strong> {modelDetails.details.family}
                    </p>
                    <p>
                      <strong>Parameter Size:</strong>{" "}
                      {modelDetails.details.parameter_size}
                    </p>
                    <p>
                      <strong>Quantization Level:</strong>{" "}
                      {modelDetails.details.quantization_level}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Architecture:</strong>{" "}
                      {modelDetails.model_info["general.architecture"]}
                    </p>
                    <p>
                      <strong>Context Length:</strong>{" "}
                      {modelDetails.model_info["llama.context_length"]}
                    </p>
                    <p>
                      <strong>Vocab Size:</strong>{" "}
                      {modelDetails.model_info["llama.vocab_size"]}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <h4 className="font-semibold">Parameters:</h4>
                  <pre className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded mt-1 text-sm overflow-x-auto">
                    {modelDetails.parameters}
                  </pre>
                </div>
                <div className="mt-2">
                  <h4 className="font-semibold">Template:</h4>
                  <pre className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded mt-1 text-sm overflow-x-auto">
                    {modelDetails.template}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
