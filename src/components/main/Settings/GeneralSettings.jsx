import React from "react";
import ModelSelection from "./ModelSelection";
import SystemPrompt from "./SystemPrompt";

const GeneralSettings = ({ settings, onSettingsChange }) => {
  return (
    <div className="space-y-4">
      <ModelSelection settings={settings} onSettingsChange={onSettingsChange} />
      <SystemPrompt settings={settings} onSettingsChange={onSettingsChange} />
    </div>
  );
};

export default GeneralSettings;
