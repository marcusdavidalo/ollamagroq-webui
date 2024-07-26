import React from "react";

const AboutTab = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Version
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400">v1.0.0</p>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        License
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400">MIT License</p>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Credits
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400">
        Developed by Marcus David Alo
      </p>
    </div>
  );
};

export default AboutTab;
