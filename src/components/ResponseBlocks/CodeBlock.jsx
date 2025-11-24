import React from "react";

const CodeBlock = ({ content }) => (
  <pre className="bg-gray-900 p-2 rounded-xl overflow-x-auto text-green-400 font-mono whitespace-pre-wrap">
    {content}
  </pre>
);

export default CodeBlock;
