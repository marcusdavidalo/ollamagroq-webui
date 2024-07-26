import React from "react";

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
  darkMode,
  toggleDarkMode,
  setIsModalOpen,
}) => {
  return (
    <header className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-4 shadow-md font-tahoma rounded-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-light">Ollama WebUI</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
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
    </header>
  );
};

export default Header;
