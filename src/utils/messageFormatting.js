import React from "react";
import CodeBlock from "../components/main/Chatbox/CodeBlock";

export const formatMessage = (content) => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const parts = content.split(codeBlockRegex);
  const codeBlocks = content.match(codeBlockRegex) || [];

  return parts.reduce((acc, part, index) => {
    acc.push(<span key={`text-${index}`}>{part}</span>);
    if (index < codeBlocks.length) {
      const code = codeBlocks[index].replace(/```/g, "").trim();
      acc.push(<CodeBlock key={`code-${index}`} code={code} />);
    }
    return acc;
  }, []);
};
