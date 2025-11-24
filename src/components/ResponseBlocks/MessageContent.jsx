import React from "react";
import CodeBlock from "./CodeBlock";
import ScriptBlock from "./ScriptBlock";
import SummaryBlock from "./SummaryBlock";
import GenericBlock from "./GenericBlock";

const MessageContent = ({ msg }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    alert("Copied to clipboard!");
  };

  const contentByType = {
    code: <CodeBlock content={msg.content} />,
    script: <ScriptBlock content={msg.content} />,
    summary: <SummaryBlock content={msg.content} />,
    generic: <GenericBlock content={msg.content} />
  };

  return (
    <div className={`p-2 rounded-xl max-w-[80%] ${msg.role === "user" ? "self-end bg-blue-600" : "self-start bg-gray-800"} flex flex-col gap-1`}>
      <div className="flex justify-between items-start">
        <div>{contentByType[msg.response_type || "generic"]}</div>
        <button onClick={handleCopy} className="ml-2 text-gray-400 hover:text-white text-sm">
          Copy
        </button>
      </div>
    </div>
  );
};

export default MessageContent;
