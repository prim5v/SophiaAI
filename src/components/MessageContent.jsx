import React, { useState } from "react";
import CodeBlock from "./ResponseBlocks/CodeBlock";
import ScriptBlock from "./ResponseBlocks/ScriptBlock";
import SummaryBlock from "./ResponseBlocks/SummaryBlock";
import GenericBlock from "./ResponseBlocks/GenericBlock";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/outline";

const MessageContent = ({ msg }) => {
  const { response_type, content, isHTML } = msg;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  let RenderBlock;
  switch (response_type) {
    case "code":
      RenderBlock = <CodeBlock content={content} />;
      break;
    case "script":
      RenderBlock = <ScriptBlock content={content} />;
      break;
    case "summary":
      RenderBlock = <SummaryBlock content={content} />;
      break;
    default:
      RenderBlock = <GenericBlock content={content} isHTML={isHTML} />;
      break;
  }

  return (
    <div className={`w-full relative flex flex-col gap-1`}>
      {RenderBlock}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
      >
        {copied ? "Copied!" : <ClipboardIcon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default MessageContent;
