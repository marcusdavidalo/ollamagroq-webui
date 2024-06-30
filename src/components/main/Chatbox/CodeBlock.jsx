import React from "react";

const CodeBlock = ({ code }) => (
  <pre className="bg-zinc-800 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-400 p-4 rounded-lg overflow-x-auto">
    <code>{code}</code>
  </pre>
);

export default CodeBlock;
