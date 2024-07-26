import React, { useState, useEffect } from "react";
import { getGroqModels } from "../../../utils/groqClient";
import axios from "axios";

const ModelSelection = ({ settings, onSettingsChange }) => {
  const [localModels, setLocalModels] = useState([]);
  const [groqModels, setGroqModels] = useState([]);
  const [modelDetails, setModelDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocalModels = async () => {
      try {
        const response = await fetch("http://localhost:11434/api/models");
        const data = await response.json();
        setLocalModels(data.models.map((model) => model.name));
      } catch (error) {
        console.error("Failed to fetch local models:", error);
      }
    };

    const fetchGroqModels = async () => {
      try {
        const models = await getGroqModels();
        setGroqModels(models);
      } catch (error) {
        console.error("Failed to fetch Groq models:", error);
      }
    };

    Promise.all([fetchLocalModels(), fetchGroqModels()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (settings.selectedModel) {
      fetchModelDetails(settings.selectedModel);
    }
  }, [settings.selectedModel]);

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

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    const isGroqModel = groqModels.includes(selectedModel);
    onSettingsChange({
      ...settings,
      selectedModel,
      isGroqModel,
      isVisionModel: isGroqModel ? false : settings.isVisionModel,
      allowImageUpload: isGroqModel ? false : settings.allowImageUpload,
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Model Selection
      </h3>
      {isLoading ? (
        <p className="w-full p-2 border rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100">
          Loading models...
        </p>
      ) : (
        <select
          value={settings.selectedModel}
          onChange={handleModelChange}
          className="w-full p-2 border rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
        >
          <optgroup label="Local Models">
            {localModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </optgroup>
          <optgroup label="Groq Models">
            {groqModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </optgroup>
        </select>
      )}

      {!settings.isGroqModel && (
        <>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="visionModel"
              checked={settings.isVisionModel}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  isVisionModel: e.target.checked,
                })
              }
              className="form-checkbox"
            />
            <label
              htmlFor="visionModel"
              className="text-zinc-900 dark:text-zinc-100"
            >
              Vision Model
            </label>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="allowImageUpload"
              checked={settings.allowImageUpload}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  allowImageUpload: e.target.checked,
                })
              }
              className="form-checkbox"
            />
            <label
              htmlFor="allowImageUpload"
              className="text-zinc-900 dark:text-zinc-100"
            >
              Allow Image Upload
            </label>
          </div>
        </>
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
  );
};

export default ModelSelection;
